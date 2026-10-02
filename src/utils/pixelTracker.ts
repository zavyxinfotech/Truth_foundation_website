import { PixelEvent } from '../types';

type PixelListener = (event: PixelEvent) => void;

class PixelTracker {
  private listeners: PixelListener[] = [];
  private history: PixelEvent[] = [];

  constructor() {
    // Initial PageView
    this.track('PageView', {
      page_title: 'One Meal. One Smile. - Truth Foundation',
      page_location: window.location.href,
      campaign: 'Meta Ads Donation Landing'
    });
  }

  public subscribe(listener: PixelListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getHistory(): PixelEvent[] {
    return [...this.history];
  }

  public track(eventName: string, payload: Record<string, any> = {}) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Meta Pixel simulation
    const metaEvent: PixelEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      eventName,
      platform: 'Meta Pixel',
      payload
    };

    this.history.unshift(metaEvent);
    if (this.history.length > 50) this.history.pop();

    // Trigger window events if Meta Pixel script exists
    if (typeof window !== 'undefined') {
      (window as any).fbq?.('track', eventName, payload);
      (window as any).gtag?.('event', eventName, payload);
    }

    this.listeners.forEach(listener => listener(metaEvent));
  }

  public trackDonateClick(amount: number, source: string) {
    this.track('InitiateCheckout', {
      value: amount,
      currency: 'INR',
      content_name: 'Meal Donation',
      content_category: 'NGO Donation',
      source
    });
  }

  public trackPaymentCompleted(amount: number, donorName: string, transactionId: string) {
    this.track('Purchase', {
      value: amount,
      currency: 'INR',
      transaction_id: transactionId,
      content_type: 'Donation',
      donor_name: donorName,
      tax_exemption_requested: true
    });
  }

  public trackWhatsAppClick(source: string) {
    this.track('Lead', {
      method: 'WhatsApp Chat',
      source,
      interest: 'Donation Enquiry'
    });
  }
}

export const pixelTracker = new PixelTracker();
