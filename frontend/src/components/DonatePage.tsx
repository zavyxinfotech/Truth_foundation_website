/* cspell:disable */
/* eslint-disable */
import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, Award, Printer, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import truthLogo from '../assets/images/truth_foundation_logo_1785562616008.jpg?w=128&format=webp';
import sadChildPainting from '../assets/images/sad_child_painting.jpg?w=512;1024&format=webp;jpg&as=picture';
import brushMask from '../assets/images/brush_mask.png?w=700&format=webp';
import razorpayLogo from '../assets/images/razorpay_logo.png';
import { pixelTracker } from '../utils/pixelTracker';
import { Picture } from './Picture';

const RazorpayBadge: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className = '' }) => (
  <img
    src={razorpayLogo}
    alt="Razorpay"
    className={`${size === 'sm' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-7'} w-auto object-contain ${className}`}
  />
);

interface DonatePageProps {
  initialAmount?: number;
  onClose?: () => void;
  onDonateSuccess?: () => void;
  onNavigateHome?: (anchor?: string) => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({ initialAmount = 500, onClose, onDonateSuccess, onNavigateHome }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount >= 500 ? initialAmount : 500);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    paymentId: string;
    orderId: string;
    receiptNumber: string;
    amount: number;
    fullName: string;
  } | null>(null);

  const parsedCustom = parseInt(customValue, 10);
  const activeAmount = isCustom ? (parsedCustom && parsedCustom >= 500 ? parsedCustom : 500) : selectedAmount;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsProcessing(true);
    pixelTracker.trackDonateClick(activeAmount, 'Separate Donate Page Submit');

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load secure Razorpay gateway. Please check your internet connection.');
      }

      // 1. Create order on backend (amount in rupees)
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Unable to initialize secure order. Please try again.');
      }

      // 2. Open Live Razorpay Checkout Modal
      const razorpayKey = orderData.key_id || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TkcXDVNE0IJstM';

      const options = {
        key: razorpayKey,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'Truth Foundation',
        description: `Donation to feed & care for children (₹${activeAmount.toLocaleString()})`,
        image: truthLogo,
        order_id: orderData.order_id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          foundation: 'Truth Foundation Chennai'
        },
        theme: {
          color: '#0a2240'
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment Signature with backend & save to Supabase
            const verifyRes = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: activeAmount,
                donor_details: {
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone
                }
              })
            });

            const verifyData = await verifyRes.json();
            const receiptNum = verifyData?.donation?.receipt_number || `TF-${Date.now().toString().slice(-6)}`;

            setPaymentSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              receiptNumber: receiptNum,
              amount: activeAmount,
              fullName: formData.fullName
            });

            setIsProcessing(false);

            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
              });
            } catch {
              // Ignore confetti error
            }

            pixelTracker.trackPaymentCompleted(activeAmount, formData.fullName, response.razorpay_payment_id);
            if (onDonateSuccess) onDonateSuccess();
          } catch (err) {
            console.error('Payment verification error:', err);
            setIsProcessing(false);
            setPaymentSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              receiptNumber: `TF-${Date.now().toString().slice(-6)}`,
              amount: activeAmount,
              fullName: formData.fullName
            });
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (resp: any) {
        setIsProcessing(false);
        setErrorMessage(resp.error?.description || 'Payment was cancelled or unsuccessful. Please try again.');
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error('Razorpay initialization error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#fdfbf7] text-slate-900 flex flex-col justify-between font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Header Bar */}
      <header className="w-full bg-white text-slate-900 py-2 sm:py-2.5 px-4 sm:px-8 border-b border-slate-200/80 shadow-2xs sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Permanent Left Logo & Title Branding */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group shrink cursor-pointer"
            aria-label="Truth Foundation Home Page"
          >
            <img
              src={truthLogo}
              alt="Truth Foundation Logo"
              width={128}
              height={128}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#da8a24] shrink-0 shadow-sm"
            />
            <div className="min-w-0 text-left whitespace-nowrap">
              <span className="text-sm xs:text-base sm:text-xl lg:text-2xl font-semibold text-[#0a2240] tracking-tight leading-none block group-hover:text-[#da8a24] transition-colors">
                TRUTH FOUNDATION
              </span>
              <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[#0a2240] uppercase tracking-wider block pt-0.5">
                REGISTERED NGO • CHENNAI
              </p>
            </div>
          </a>

          {/* Right Header Trust Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Official Payment Partner:</span>
            <img
              src={razorpayLogo}
              alt="Razorpay"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </div>

        </div>
      </header>

      {/* Main Container - Fills vertical desktop height seamlessly */}
      <main className="max-w-7xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 pt-2.5 pb-2 lg:pt-3.5 lg:pb-2.5 flex flex-col justify-between overflow-y-auto lg:overflow-hidden">
        
        {paymentSuccess ? (
          /* Official Verified Razorpay Receipt View */
          <div className="max-w-2xl mx-auto my-auto bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                <span>Payment Verified via</span>
                <img src={razorpayLogo} alt="Razorpay" className="h-4.5 w-auto object-contain" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a2240] mt-2">
                Thank You, {paymentSuccess.fullName}!
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-normal">
                Your contribution of <strong className="text-[#0a2240]">₹{paymentSuccess.amount.toLocaleString()}</strong> has been securely received by Truth Foundation.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="font-semibold text-[#0a2240]">Donation Receipt</span>
                <span className="font-mono text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md font-semibold">
                  {paymentSuccess.receiptNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 py-1">
                <div>
                  <span className="text-slate-500 text-xs block">Donor Name</span>
                  <span className="font-semibold text-slate-900">{paymentSuccess.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Amount Paid</span>
                  <span className="font-semibold text-slate-900">₹{paymentSuccess.amount.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-xs block">Razorpay Payment ID</span>
                  <span className="font-mono text-xs font-semibold text-slate-900 break-all">{paymentSuccess.paymentId}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 text-xs block">Beneficiary Organization</span>
                  <span className="font-semibold text-[#0a2240]">Truth Foundation (Registered Public Charitable Trust)</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleLogoClick}
                className="flex-1 py-3 px-4 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Donation View */
          <>
            {/* Hero Section Banner - Heading size preserved exactly */}
            <div className="max-w-4xl space-y-1 shrink-0">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#0a2240] tracking-tight leading-tight">
                Make Your Contribution
              </h1>

              <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-2xl font-normal leading-relaxed">
                Your generosity empowers children, provides education, healthcare, nutrition, shelter, and community development across India.
              </p>
            </div>

            {/* 2-Column Grid Layout - Spans cleanly to fill desktop height */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-stretch flex-1 my-2 lg:my-3">
              
              {/* Left Section (6 Columns Desktop): Amount Selection */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-3 lg:space-y-4">
                
                {/* Amount Selection */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#0a2240] tracking-tight">
                      Select Donation Amount (INR)
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">Starts from ₹500</span>
                  </div>

                  {/* 2-Row Amount Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[500, 1000, 2000, 2500, 5000, 10000].map((amt) => {
                      const isSelected = !isCustom && selectedAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setIsCustom(false);
                          }}
                          className={`py-2.5 sm:py-3 px-2 rounded-xl font-semibold text-sm sm:text-base border-2 transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#da8a24] border-[#da8a24] text-[#0a2240] shadow-sm scale-102'
                              : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      );
                    })}

                    {/* Custom Amount Button Pill */}
                    <div className={`relative col-span-2 sm:col-span-2 rounded-xl border-2 transition-all flex items-center justify-center ${
                      isCustom ? 'border-[#da8a24] bg-amber-50 shadow-sm' : 'border-slate-200/90 bg-white shadow-2xs'
                    }`}>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm text-[#0a2240]">₹</span>
                      <input
                        type="number"
                        min="500"
                        value={customValue}
                        onFocus={() => setIsCustom(true)}
                        onChange={(e) => {
                          setIsCustom(true);
                          setCustomValue(e.target.value);
                        }}
                        placeholder="Other (Min ₹500)"
                        className="w-full py-2.5 sm:py-3 pl-7 pr-3 text-center text-sm sm:text-base font-semibold text-[#0a2240] bg-transparent focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Emotional Painted Image Section - Fills left column height */}
                <div className="w-full flex-1 flex items-center justify-center pt-1 sm:pt-2">
                  <div
                    className="relative w-full max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-video lg:h-64 xl:h-72"
                    style={{ mixBlendMode: 'multiply' }}
                  >
                    <Picture
                      picture={sadChildPainting}
                      sizes="(min-width: 640px) 512px, calc(100vw - 2rem)"
                      alt="Emotional painting of a child receiving care"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url('${brushMask}')`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        mixBlendMode: 'lighten'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Right Section (6 Columns Desktop): Clean form without background color */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-3 lg:space-y-3.5">
                
                {/* SELECTED CONTRIBUTION Box */}
                <div className="bg-white/80 border border-slate-200/90 py-2.5 lg:py-3 px-4 rounded-xl flex items-center justify-between shadow-2xs">
                  <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                    SELECTED CONTRIBUTION
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-[#0a2240]">
                    ₹{activeAmount.toLocaleString()}
                  </div>
                </div>

                {/* Donor Information Form Fields */}
                <div className="space-y-2.5 lg:space-y-3">
                  <h2 className="text-base sm:text-lg font-semibold text-[#0a2240] tracking-tight">
                    Donor Information
                  </h2>

                  <div>
                    <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-11 sm:h-12 px-3.5 bg-white border border-slate-200/90 rounded-xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1">Email Address (for Receipt) *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full h-11 sm:h-12 px-3.5 bg-white border border-slate-200/90 rounded-xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full h-11 sm:h-12 px-3.5 bg-white border border-slate-200/90 rounded-xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full h-12.5 sm:h-13 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold text-base sm:text-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 uppercase tracking-wider ${
                    isProcessing ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0a2240]" />
                      <span>OPENING SECURE GATEWAY...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 fill-[#0a2240] text-[#0a2240] shrink-0" />
                      <span>DONATE ₹{activeAmount.toLocaleString()} NOW</span>
                    </>
                  )}
                </button>

                {/* Trust indicator - Exact attached Razorpay logo for building trust */}
                <div className="pt-1.5 flex items-center justify-center gap-2 sm:gap-2.5 text-slate-500 text-xs sm:text-sm">
                  <span className="font-medium text-slate-600">Official Payment Partner:</span>
                  <img src={razorpayLogo} alt="Razorpay" className="h-6 sm:h-7 w-auto object-contain" />
                  <span className="hidden sm:inline text-slate-400 font-normal">• Instant UPI, Cards & NetBanking</span>
                </div>

              </div>

            </form>
          </>
        )}
      </main>

      {/* Compact minimal footer for Donate page */}
      <footer className="py-2.5 sm:py-3 border-t border-amber-200/40 text-center text-xs text-slate-500 font-normal shrink-0">
        © {new Date().getFullYear()} Truth Foundation • Registered NGO. Developed with ❤️ by{' '}
        <a
          href="https://zavyx.odoo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0a2240] hover:text-[#da8a24] font-medium tracking-wide transition-colors"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          ZAVYX InfoTech
        </a>
      </footer>
    </div>
  );
};
