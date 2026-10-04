import React, { Suspense, lazy } from 'react';
import { Header } from '../../components/Header';
import { Hero } from '../../components/Hero';
import { WhyDonate } from '../../components/WhyDonate';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { ScrollSection } from '../../components/ScrollSection';
import { DarkToLightDivider, LightToDarkDivider } from '../../components/SectionDividers';
import { CURRENT_CAMPAIGN, FUTURE_CAMPAIGNS } from '../../data/campaignData';

const AboutSection = lazy(() => import('../../components/AboutSection').then(m => ({ default: m.AboutSection })));
const GallerySection = lazy(() => import('../../components/GallerySection').then(m => ({ default: m.GallerySection })));
const TrustSection = lazy(() => import('../../components/TrustSection').then(m => ({ default: m.TrustSection })));
const TestimonialsSection = lazy(() => import('../../components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection = lazy(() => import('../../components/FAQSection').then(m => ({ default: m.FAQSection })));
const Footer = lazy(() => import('../../components/Footer').then(m => ({ default: m.Footer })));

const FallbackLoader = () => <div className="w-full h-32 bg-[#0a2240]" />;

interface HomePageProps {
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onOpenDonateModal: (amount?: number) => void;
  onNavigate: (page: 'home' | 'about' | 'gallery' | 'contact' | 'donate', anchor?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeCampaignId,
  onSelectCampaign,
  onOpenDonateModal,
  onNavigate
}) => {
  const currentCampaign = FUTURE_CAMPAIGNS.find((c) => c.id === activeCampaignId) || CURRENT_CAMPAIGN;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* Header */}
      <Header
        currentPage="home"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* Hero Section (Dark) */}
      <Hero
        campaign={currentCampaign}
        onOpenDonateModal={onOpenDonateModal}
        onSelectCampaign={onSelectCampaign}
      />

      {/* Why Your Donation Matters Section (Light #f8fafc) */}
      <ScrollSection id="why-donate">
        <WhyDonate
          onOpenDonateModal={onOpenDonateModal}
        />
      </ScrollSection>

      {/* Transition: Light WhyDonate -> Dark AboutSection */}
      <LightToDarkDivider bgFrom="#f8fafc" bgTo="#0a2240" />

      <Suspense fallback={<FallbackLoader />}>
        {/* About Truth Foundation (Dark #0a2240) */}
        <ScrollSection id="about">
          <AboutSection />
        </ScrollSection>

        {/* Transition: Dark AboutSection -> Light GallerySection */}
        <DarkToLightDivider bgFrom="#0a2240" bgTo="#ffffff" />

        {/* Field Gallery (Light #ffffff) */}
        <ScrollSection id="gallery">
          <GallerySection onOpenDonateModal={onOpenDonateModal} />
        </ScrollSection>

        {/* Transition: Light GallerySection -> Dark TrustSection */}
        <LightToDarkDivider bgFrom="#ffffff" bgTo="#0a2240" />

        {/* Trust & Accreditations Section (Dark #0a2240) */}
        <ScrollSection id="trust">
          <TrustSection />
        </ScrollSection>

        {/* Transition: Dark TrustSection -> Light TestimonialsSection */}
        <DarkToLightDivider bgFrom="#0a2240" bgTo="#f8fafc" />

        {/* Testimonials (Light #f8fafc) */}
        <ScrollSection id="testimonials">
          <TestimonialsSection />
        </ScrollSection>

        {/* Transition: Light TestimonialsSection -> Dark FAQSection */}
        <LightToDarkDivider bgFrom="#f8fafc" bgTo="#0a2240" />

        {/* FAQ Section (Dark #0a2240) */}
        <ScrollSection id="faq">
          <FAQSection onOpenDonateModal={onOpenDonateModal} />
        </ScrollSection>

        {/* Transition: Dark FAQSection -> Light Footer */}
        <DarkToLightDivider bgFrom="#0a2240" bgTo="#f8fafc" />

        {/* Footer */}
        <Footer onNavigateHome={(anchor) => onNavigate('home', anchor)} />
      </Suspense>

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

    </div>
  );
};
