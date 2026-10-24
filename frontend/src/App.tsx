import React, { useState, Suspense, lazy } from 'react';
import { HomePage } from './pages/home/HomePage';
import { PageType } from './components/Header';

// Lazy load dedicated sub-pages for optimal performance
const AboutPage = lazy(() => import('./pages/about/AboutPage').then(m => ({ default: m.AboutPage })));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./pages/contact/ContactPage').then(m => ({ default: m.ContactPage })));
const DonatePage = lazy(() => import('./components/DonatePage').then(m => ({ default: m.DonatePage })));

const FallbackLoader = () => (
  <div className="w-full min-h-screen bg-[#0a2240] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#da8a24] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [activeCampaignId, setActiveCampaignId] = useState<string>('one-meal-one-smile');
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['about', 'gallery', 'contact', 'donate', 'home'].includes(hash)) {
      return hash as PageType;
    }
    const saved = sessionStorage.getItem('current_page');
    if (saved && ['about', 'gallery', 'contact', 'donate', 'home'].includes(saved)) {
      return saved as PageType;
    }
    return 'home';
  });
  const [donateAmount, setDonateAmount] = useState<number>(500);

  React.useEffect(() => {
    const handleHashOrPopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (['about', 'gallery', 'contact', 'donate', 'home'].includes(hash)) {
        setCurrentPage(hash as PageType);
        sessionStorage.setItem('current_page', hash);
      }
    };
    window.addEventListener('hashchange', handleHashOrPopState);
    window.addEventListener('popstate', handleHashOrPopState);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPopState);
      window.removeEventListener('popstate', handleHashOrPopState);
    };
  }, []);

  const handleOpenDonateModal = (amount: number = 500) => {
    setDonateAmount(amount);
    setCurrentPage('donate');
    window.location.hash = 'donate';
    sessionStorage.setItem('current_page', 'donate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageType, anchor?: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    sessionStorage.setItem('current_page', page);
    if (anchor && page === 'home') {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentPage === 'donate') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <DonatePage
          initialAmount={donateAmount}
          onClose={() => handleNavigate('home')}
          onDonateSuccess={() => handleNavigate('home')}
          onNavigateHome={(anchor) => handleNavigate('home', anchor)}
        />
      </Suspense>
    );
  }

  if (currentPage === 'about') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <AboutPage
          onOpenDonateModal={handleOpenDonateModal}
          onNavigate={handleNavigate}
        />
      </Suspense>
    );
  }

  if (currentPage === 'gallery') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <GalleryPage
          onOpenDonateModal={handleOpenDonateModal}
          onNavigate={handleNavigate}
        />
      </Suspense>
    );
  }

  if (currentPage === 'contact') {
    return (
      <Suspense fallback={<FallbackLoader />}>
        <ContactPage
          onOpenDonateModal={handleOpenDonateModal}
          onNavigate={handleNavigate}
        />
      </Suspense>
    );
  }

  return (
    <HomePage
      activeCampaignId={activeCampaignId}
      onSelectCampaign={setActiveCampaignId}
      onOpenDonateModal={handleOpenDonateModal}
      onNavigate={handleNavigate}
    />
  );
}
