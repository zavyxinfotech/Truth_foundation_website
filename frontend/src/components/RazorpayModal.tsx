import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Heart, Sparkles, CheckCircle2, QrCode, CreditCard, Building, Wallet, ArrowRight, Download, Printer, Lock, RefreshCw, Calendar, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign, DonorDetails } from '../types';
import { pixelTracker } from '../utils/pixelTracker';
import truthLogo from '../assets/images/truth_foundation_logo_1785562616008.jpg?w=128&format=webp';

interface RazorpayModalProps {
  initialAmount: number;
  initialFrequency?: 'One-time' | 'Monthly';
  campaign?: Campaign;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  initialAmount,
  initialFrequency = 'One-time',
  campaign,
  onClose
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 1: Amount, 2: Details, 3: Razorpay Gateway, 4: Processing, 5: Success Receipt
  const [amount, setAmount] = useState<number>(initialAmount || 500);
  const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>(initialFrequency);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  const [donorDetails, setDonorDetails] = useState<DonorDetails>({
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isEightYGRequired: true,
    isAnonymous: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transactionId, setTransactionId] = useState<string>('');

  const mealsCount = Math.floor(amount / 20);
  const monthlyAmounts = campaign?.monthlyOptions?.suggestedAmounts || [300, 500, 1000, 2500, 5000];
  const oneTimeAmounts = campaign?.suggestedAmounts || [100, 500, 1000, 2500, 5000];
  const currentPresets = frequency === 'Monthly' ? monthlyAmounts : oneTimeAmounts;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!donorDetails.fullName.trim()) errs.fullName = 'Full name is required';
    if (!donorDetails.email.trim() || !donorDetails.email.includes('@')) errs.email = 'Valid email is required for receipt';
    if (!donorDetails.phone.trim() || donorDetails.phone.length < 10) errs.phone = 'Valid 10-digit mobile number required';
    if (donorDetails.isEightYGRequired && (!donorDetails.panNumber.trim() || donorDetails.panNumber.length !== 10)) {
      errs.panNumber = 'Valid 10-character PAN number required for 80G tax receipt';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    pixelTracker.track('AddPaymentInfo', {
      amount,
      frequency,
      donor_email: donorDetails.email,
      pan_provided: !!donorDetails.panNumber
    });
    setStep(3);
  };

  const handlePayNow = () => {
    setStep(4); // Processing
    const txn = 'TXN_TF_' + Math.floor(100000000 + Math.random() * 900000000);
    setTransactionId(txn);

    setTimeout(() => {
      setStep(5); // Success Receipt
      pixelTracker.trackPaymentCompleted(amount, donorDetails.fullName, txn);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-[#040f1a]/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden" onClick={onClose}>
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200 overflow-hidden text-slate-900" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Bar */}
        <div className="bg-blue-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-blue-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={truthLogo}
              alt="Truth Foundation Logo"
              width={128}
              height={128}
              className="w-10 h-10 rounded-full object-cover border border-amber-400 bg-white shrink-0"
            />
            <div>
              <div className="font-semibold text-base text-white">Truth Foundation</div>
              <div className="text-[10px] text-amber-300 font-medium">Secured by Razorpay • Registered Public Charitable Trust</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-blue-200 hover:text-white bg-blue-950/80 hover:bg-blue-950 cursor-pointer transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Amount & Frequency Selection */}
        {step === 1 && (
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Step 1 of 3: Contribution Setup
              </span>
              <h3 className="text-2xl font-semibold text-blue-900 pt-2">How would you like to give?</h3>
              <p className="text-xs text-slate-500 font-normal">
                {frequency === 'Monthly'
                  ? `₹${amount.toLocaleString()}/month provides ${mealsCount} hot meals every month (${mealsCount * 12} meals/year)!`
                  : `Your ₹${amount.toLocaleString()} will provide ${mealsCount} hot meals today.`}
              </p>
            </div>

            {/* Monthly Giving Interactive Toggle Box */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 transition-all">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => setFrequency('One-time')}
                  className={`py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    frequency === 'One-time' ? 'bg-white text-blue-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>One-Time Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('Monthly')}
                  className={`py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    frequency === 'Monthly' ? 'bg-amber-400 text-blue-950 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-950 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Monthly Partner</span>
                  <span className="bg-blue-950 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase">Save 80G</span>
                </button>
              </div>

              {frequency === 'Monthly' && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs space-y-2 text-blue-950">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Monthly Partner Benefits:</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-1 pl-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Guarantees zero hunger for children all 365 days a year</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Automated monthly 80G tax exemption receipts via email</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>1-Click pause, cancel, or modify amount anytime</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Select {frequency === 'Monthly' ? 'Monthly' : 'Donation'} Amount (INR)</span>
                {frequency === 'Monthly' && <span className="text-amber-800 text-[11px] font-semibold">Billed Monthly</span>}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {currentPresets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border-2 transition cursor-pointer ${
                      amount === amt
                        ? 'bg-amber-50 border-amber-400 text-blue-900 font-semibold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    ₹{amt.toLocaleString()}{frequency === 'Monthly' ? '/mo' : ''}
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      {Math.floor(amt / 20)} Meals{frequency === 'Monthly' ? '/mo' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Or enter custom amount (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(50, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-8 pr-16 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-blue-900 focus:outline-hidden focus:border-amber-400"
                />
                {frequency === 'Monthly' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    / month
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-amber-400 hover:bg-amber-300 text-blue-950 font-semibold py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-base uppercase tracking-wider"
            >
              <Heart className="w-4 h-4 fill-blue-950" />
              <span>Donate Now</span>
            </button>
          </div>
        )}

        {/* STEP 2: Donor Details Form for 80G Tax Receipt */}
        {step === 2 && (
          <form onSubmit={handleDetailsSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Step 2 of 3: Donor Details
              </span>
              <h3 className="text-xl font-semibold text-slate-900 pt-1">Required for 80G Tax Exemption Certificate</h3>
              <div className="inline-block text-[11px] font-semibold text-blue-900 bg-blue-50 px-3 py-0.5 rounded-full mt-1">
                Amount: ₹{amount.toLocaleString()} ({frequency === 'Monthly' ? 'Monthly Partner Pledge' : 'One-Time Contribution'})
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name (as per PAN) *</label>
                <input
                  type="text"
                  value={donorDetails.fullName}
                  onChange={(e) => setDonorDetails({ ...donorDetails, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={donorDetails.email}
                    onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    value={donorDetails.phone}
                    onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">PAN Card Number (for 80G Tax Exemption) *</label>
                <input
                  type="text"
                  maxLength={10}
                  value={donorDetails.panNumber}
                  onChange={(e) => setDonorDetails({ ...donorDetails, panNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                {errors.panNumber && <p className="text-red-500 text-[10px] mt-0.5">{errors.panNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={donorDetails.city}
                    onChange={(e) => setDonorDetails({ ...donorDetails, city: e.target.value })}
                    placeholder="Mumbai / Delhi"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={donorDetails.state}
                    onChange={(e) => setDonorDetails({ ...donorDetails, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-xs cursor-pointer"
              >
                <span>Proceed to Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Razorpay Payment Gateway Selection */}
        {step === 3 && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-400">Total Contribution</div>
                <div className="text-2xl font-semibold text-amber-400">
                  ₹{amount.toLocaleString()}{frequency === 'Monthly' ? '/mo' : ''}
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                  50% 80G Tax Exemption
                </span>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  {mealsCount} Meals{frequency === 'Monthly' ? '/month' : ''}
                </div>
              </div>
            </div>

            {/* Razorpay Method Tabs */}
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'UPI' ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200' : ''}`}
              >
                <QrCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'Card' ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200' : ''}`}
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'NetBanking' ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200' : ''}`}
              >
                <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>NetBank</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'Wallet' ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200' : ''}`}
              >
                <Wallet className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Wallet</span>
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-800">
                  Select {frequency === 'Monthly' ? 'UPI Autopay Mandate' : 'Instant UPI App'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setUpiApp('gpay')}
                    className={`p-3 rounded-xl border text-center transition ${upiApp === 'gpay' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-slate-200'}`}
                  >
                    Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiApp('phonepe')}
                    className={`p-3 rounded-xl border text-center transition ${upiApp === 'phonepe' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-slate-200'}`}
                  >
                    PhonePe
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiApp('paytm')}
                    className={`p-3 rounded-xl border text-center transition ${upiApp === 'paytm' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-slate-200'}`}
                  >
                    Paytm UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiApp('qr')}
                    className={`p-3 rounded-xl border text-center transition ${upiApp === 'qr' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-slate-200'}`}
                  >
                    Scan QR Code
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <input type="text" placeholder="Card Number (4000 1234 5678 9010)" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY" className="p-2.5 bg-white border border-slate-300 rounded-lg" />
                  <input type="password" maxLength={3} placeholder="CVV" className="p-2.5 bg-white border border-slate-300 rounded-lg font-mono" />
                </div>
              </div>
            )}

            <button
              onClick={handlePayNow}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <Lock className="w-4 h-4" />
              <span>
                {frequency === 'Monthly'
                  ? `SetUp ₹${amount.toLocaleString()}/mo Recurring Pledge`
                  : `Pay ₹${amount.toLocaleString()} Securely`}
              </span>
            </button>
          </div>
        )}

        {/* STEP 4: Processing State */}
        {step === 4 && (
          <div className="p-12 text-center space-y-4 my-8">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-xl font-semibold text-slate-900">Communicating with Razorpay Gateway...</h3>
            <p className="text-xs text-slate-500 font-normal">
              {frequency === 'Monthly'
                ? 'Registering secure Razorpay Recurring Mandate...'
                : 'Encrypting secure payment details...'}
            </p>
          </div>
        )}

        {/* STEP 5: Success Receipt & 80G Tax Exemption Certificate */}
        {step === 5 && (
          <div className="p-6 space-y-5 text-center bg-slate-50 overflow-y-auto flex-1">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                {frequency === 'Monthly' ? 'Monthly Partner Program Enrolled' : 'Donation Completed Successfully'}
              </span>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2">Thank You, {donorDetails.fullName}!</h3>
              <p className="text-xs text-slate-600 mt-1 font-normal">
                {frequency === 'Monthly'
                  ? `Your monthly pledge of ₹${amount.toLocaleString()} will fund ${mealsCount * 12} hot meals every year (${mealsCount} meals every month)!`
                  : `Your generosity has provided ${mealsCount} hot nutritious meals to children today.`}
              </p>
            </div>

            {/* Official Tax Exemption Receipt Card */}
            <div className="bg-white border border-slate-300 rounded-2xl p-4 text-left space-y-3 shadow-xs text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-800">80G Tax Exemption Receipt</span>
                <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">{transactionId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Donor: <strong className="text-slate-900 block">{donorDetails.fullName}</strong></div>
                <div>PAN: <strong className="text-slate-900 font-mono block">{donorDetails.panNumber || 'N/A'}</strong></div>
                <div>Amount: <strong className="text-slate-900 block">₹{amount.toLocaleString()}{frequency === 'Monthly' ? '/mo' : ''}</strong></div>
                <div>Frequency: <strong className="text-slate-900 block">{frequency === 'Monthly' ? 'Monthly Partner' : 'One-Time'}</strong></div>
                <div>Meals Funded: <strong className="text-slate-900 block">{frequency === 'Monthly' ? `${mealsCount * 12} Meals/Yr` : `${mealsCount} Meals`}</strong></div>
                <div>Tax Status: <strong className="text-slate-900 block">50% Exempt (80G)</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                Truth Foundation Reg # S/30291/2018/ND • 80G Order # AAATT1234F20214
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save 80G PDF
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-xl text-xs cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
