import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  X,
  ExternalLink,
  Layers,
  BookOpen,
  PhoneCall,
  Home,
  Compass,
  Bell
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { SiteContentData, HeroSlide, AboutProgram, DonationPopupMessage, DonationPopupsConfig } from '../types';
import supportCauseGirlImg from '../assets/support_cause_girl_donate.png';

const DEFAULT_POPUPS_ADMIN: DonationPopupMessage[] = [
  {
    id: 'pop-1',
    name: 'Karthik Raja',
    amount: 1500,
    cause: 'Special Meals for 15 Children',
    location: 'Chennai',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-2',
    name: 'Priya Sundaram',
    amount: 750,
    cause: 'Senior Care & Daily Medicines',
    location: 'Tambaram',
    time_ago: '1 min ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-3',
    name: 'Ananya Sharma',
    amount: 2500,
    cause: 'Monthly Education Kit & Books',
    location: 'Anna Nagar',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-4',
    name: 'Vignesh Kumar',
    amount: 1000,
    cause: 'Daily Nutritious Breakfast for Kids',
    location: 'Thiruvallur',
    time_ago: '2 mins ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-5',
    name: 'Meera Krishnan',
    amount: 5000,
    cause: 'Special Needs Therapy & Care',
    location: 'Adyar',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-6',
    name: 'Rajesh Natarajan',
    amount: 3000,
    cause: 'Emergency Shelter & Bedding Provisions',
    location: 'Velachery',
    time_ago: '3 mins ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-7',
    name: 'Divya & Arun',
    amount: 1200,
    cause: 'Sunday Feast for Orphan Children',
    location: 'Redhills',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-8',
    name: 'Sangeetha R.',
    amount: 800,
    cause: 'Fresh Fruits & Wholesome Diet',
    location: 'Mylapore',
    time_ago: '4 mins ago',
    cta_text: 'Add your donation'
  }
];

export const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'gallery' | 'contact' | 'popups'>('hero');
  const [content, setContent] = useState<SiteContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Slide Modal State (Add / Edit)
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    id: '',
    title: '',
    tagline: '',
    subtitle: '',
    badge: '',
    tag: '',
    image_url: ''
  });
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [slidePreview, setSlidePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement | null>(null);

  // Program Modal State (Add / Edit in About page)
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(null);
  const [programForm, setProgramForm] = useState<AboutProgram>({
    id: '',
    title: '',
    location: '',
    tag: '',
    badge: '',
    image_url: '',
    description: '',
    details: []
  });
  const [programDetailsRaw, setProgramDetailsRaw] = useState('');
  const [programFile, setProgramFile] = useState<File | null>(null);
  const [programPreview, setProgramPreview] = useState<string | null>(null);
  const programFileInputRef = useRef<HTMLInputElement | null>(null);

  // Donation Popups State (Add / Edit)
  const [popupModalOpen, setPopupModalOpen] = useState(false);
  const [editingPopupIndex, setEditingPopupIndex] = useState<number | null>(null);
  const [popupForm, setPopupForm] = useState<DonationPopupMessage>({
    id: '',
    name: '',
    amount: 1000,
    cause: '',
    location: '',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  });

  const getPopupsList = (): DonationPopupMessage[] => {
    return content.donation_popups?.popups || DEFAULT_POPUPS_ADMIN;
  };

  const handleOpenAddPopup = () => {
    setEditingPopupIndex(null);
    setPopupForm({
      id: `pop_${Date.now()}`,
      name: '',
      amount: 1000,
      cause: '',
      location: 'Chennai',
      time_ago: 'Just now',
      cta_text: 'Add your donation'
    });
    setPopupModalOpen(true);
  };

  const handleOpenEditPopup = (index: number) => {
    const list = getPopupsList();
    const item = list[index];
    if (!item) return;
    setEditingPopupIndex(index);
    setPopupForm({ ...item });
    setPopupModalOpen(true);
  };

  const handleDeletePopup = async (index: number) => {
    if (!confirm('Are you sure you want to delete this donation popup message?')) return;
    const currentList = [...getPopupsList()];
    currentList.splice(index, 1);
    const updatedConfig: DonationPopupsConfig = {
      enabled: content.donation_popups?.enabled ?? true,
      interval_seconds: content.donation_popups?.interval_seconds ?? 5,
      popups: currentList
    };
    await saveSection('donation_popups', updatedConfig);
  };

  const handleSavePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupForm.name.trim()) {
      alert('Donor name is required');
      return;
    }
    if (!popupForm.amount || popupForm.amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    const currentList = [...getPopupsList()];
    if (editingPopupIndex !== null) {
      currentList[editingPopupIndex] = popupForm;
    } else {
      currentList.push({
        ...popupForm,
        id: popupForm.id || `pop_${Date.now()}`
      });
    }
    const updatedConfig: DonationPopupsConfig = {
      enabled: content.donation_popups?.enabled ?? true,
      interval_seconds: content.donation_popups?.interval_seconds ?? 5,
      popups: currentList
    };
    await saveSection('donation_popups', updatedConfig);
    setPopupModalOpen(false);
  };


  // Load Content from Backend
  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ content: SiteContentData }>('/content');
      setContent(res.content || {});
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  // Upload an image to Cloudinary helper
  const uploadImageToCloudinary = async (file: File, folder = 'truth_foundation_cms'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    const res = await apiRequest<{ secure_url: string }>('/content/upload-image', {
      method: 'POST',
      body: formData
    });
    return res.secure_url;
  };

  // Save specific section to Backend
  const saveSection = async (sectionKey: string, data: any) => {
    setSaving(true);
    try {
      await apiRequest(`/content/${sectionKey}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      showNotification(`Saved "${sectionKey.replace('_', ' ').toUpperCase()}" successfully!`);
      await loadContent();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save section', true);
    } finally {
      setSaving(false);
    }
  };

  // --- HERO SLIDE HANDLERS ---
  const handleOpenAddSlide = () => {
    setEditingSlideIndex(null);
    setSlideForm({
      id: `slide_${Date.now()}`,
      title: '',
      tagline: '',
      subtitle: '',
      badge: '',
      tag: '',
      image_url: ''
    });
    setSlideFile(null);
    setSlidePreview(null);
    setSlideModalOpen(true);
  };

  const handleOpenEditSlide = (index: number) => {
    const slide = content.home_hero?.slides?.[index];
    if (!slide) return;
    setEditingSlideIndex(index);
    setSlideForm({ ...slide });
    setSlideFile(null);
    setSlidePreview(slide.image_url);
    setSlideModalOpen(true);
  };

  const handleSaveSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title.trim()) {
      alert('Title is required for slide');
      return;
    }

    setUploadingImage(true);
    try {
      let finalImageUrl = slideForm.image_url;

      if (slideFile) {
        finalImageUrl = await uploadImageToCloudinary(slideFile, 'truth_foundation_hero');
      }

      if (!finalImageUrl) {
        alert('Please select an image for this slide or enter an image URL');
        setUploadingImage(false);
        return;
      }

      const updatedSlide: HeroSlide = {
        ...slideForm,
        image_url: finalImageUrl
      };

      const currentSlides = [...(content.home_hero?.slides || [])];

      if (editingSlideIndex !== null) {
        currentSlides[editingSlideIndex] = updatedSlide;
      } else {
        currentSlides.push(updatedSlide);
      }

      await saveSection('home_hero', { slides: currentSlides });
      setSlideModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to upload image / save slide');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteSlide = async (index: number) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    const currentSlides = [...(content.home_hero?.slides || [])];
    currentSlides.splice(index, 1);
    await saveSection('home_hero', { slides: currentSlides });
  };

  // --- ABOUT PROGRAM HANDLERS ---
  const handleOpenAddProgram = () => {
    setEditingProgramIndex(null);
    setProgramForm({
      id: `prog_${Date.now()}`,
      title: '',
      location: '',
      tag: '',
      badge: '',
      image_url: '',
      description: '',
      details: []
    });
    setProgramDetailsRaw('');
    setProgramFile(null);
    setProgramPreview(null);
    setProgramModalOpen(true);
  };

  const handleOpenEditProgram = (index: number) => {
    const prog = content.about_page?.programs?.[index];
    if (!prog) return;
    setEditingProgramIndex(index);
    setProgramForm({ ...prog });
    setProgramDetailsRaw((prog.details || []).join('\n'));
    setProgramFile(null);
    setProgramPreview(prog.image_url);
    setProgramModalOpen(true);
  };

  const handleSaveProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title.trim()) {
      alert('Program title is required');
      return;
    }

    setUploadingImage(true);
    try {
      let finalImageUrl = programForm.image_url;
      if (programFile) {
        finalImageUrl = await uploadImageToCloudinary(programFile, 'truth_foundation_programs');
      }

      const parsedDetails = programDetailsRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedProgram: AboutProgram = {
        ...programForm,
        image_url: finalImageUrl,
        details: parsedDetails
      };

      const currentPrograms = [...(content.about_page?.programs || [])];
      if (editingProgramIndex !== null) {
        currentPrograms[editingProgramIndex] = updatedProgram;
      } else {
        currentPrograms.push(updatedProgram);
      }

      const newAboutPage = {
        ...(content.about_page || {}),
        programs: currentPrograms
      };

      await saveSection('about_page', newAboutPage);
      setProgramModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save program');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProgram = async (index: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    const currentPrograms = [...(content.about_page?.programs || [])];
    currentPrograms.splice(index, 1);
    const newAboutPage = {
      ...(content.about_page || {}),
      programs: currentPrograms
    };
    await saveSection('about_page', newAboutPage);
  };

  // Image helper for previews (handles both web URLs and local paths)
  const getRenderableImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Map local static paths to frontend origin or asset
    return `http://localhost:5173/src/${url.replace(/^\/?/, '')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-[#da8a24]" />
        <span>Loading CMS site content from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Status Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#da8a24]" />
            Website Content & Media Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Edit text, upload replacement images directly to Cloudinary, add or delete sections across Home, About, Gallery, and Contact pages.
          </p>
        </div>

        {/* Live Website Preview Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-[#da8a24]" />
          <span>View Live Changes</span>
        </a>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#da8a24] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Home & Hero Slides</span>
          <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-slate-900/60 text-slate-200 ml-1">
            {content.home_hero?.slides?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'about'
              ? 'bg-[#da8a24] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>About & Programs</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-[#da8a24] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-4 h-4 shrink-0" />
          <span>Gallery Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#da8a24] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>Contact & Offices</span>
        </button>

        <button
          onClick={() => setActiveTab('popups')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'popups'
              ? 'bg-[#da8a24] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          <span>Donation Popups</span>
          <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-slate-900/60 text-slate-200 ml-1">
            {getPopupsList().length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HOME PAGE & HERO SLIDES                                */}
      {/* ============================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Hero Slideshow Carousel</h2>
              <p className="text-xs text-slate-400">Manage the slides that display on the top of the homepage.</p>
            </div>
            <button
              onClick={handleOpenAddSlide}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition shrink-0 cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Slide</span>
            </button>
          </div>

          {/* Grid of Slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(content.home_hero?.slides || []).map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-[#071b34] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[#da8a24]/50 transition duration-200"
              >
                <div>
                  {/* Slide Image Preview with Badges */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={getRenderableImageUrl(slide.image_url)}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071b34] via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {slide.tag && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#da8a24] text-white">
                          {slide.tag}
                        </span>
                      )}
                      {slide.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/60 text-white backdrop-blur-sm">
                          {slide.badge}
                        </span>
                      )}
                    </div>
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md bg-slate-950/80 text-slate-300">
                      Slide #{idx + 1}
                    </span>
                  </div>

                  {/* Content details */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white line-clamp-1">{slide.title}</h3>
                    {slide.tagline && (
                      <p className="text-xs font-medium text-[#da8a24] italic line-clamp-1">{slide.tagline}</p>
                    )}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{slide.subtitle}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3.5 sm:p-4 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                    {slide.image_url.includes('cloudinary') ? 'Cloudinary Hosted' : 'Default Asset'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditSlide(idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#da8a24]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(idx)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs transition cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Home Impact Stats */}
          <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#da8a24]" />
              Home Page Key Impact Metrics
            </h3>
            <p className="text-xs text-slate-400">Update verified numbers shown in cards and counters on the homepage.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Daily Meals Served</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.daily_meals || 1500}
                  id="stat_daily_meals"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Resident Orphans</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.resident_orphans || 45}
                  id="stat_resident_orphans"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tuition Students</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.tuition_students || 346}
                  id="stat_tuition_students"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Elderly Seniors</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.elderly_seniors || 20}
                  id="stat_elderly_seniors"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Special Needs Kids</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.special_needs_kids || 23}
                  id="stat_special_needs_kids"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Years of Service</label>
                <input
                  type="number"
                  defaultValue={content.home_stats?.years_of_service || 15}
                  id="stat_years_of_service"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedStats = {
                    daily_meals: parseInt((document.getElementById('stat_daily_meals') as HTMLInputElement).value, 10),
                    resident_orphans: parseInt((document.getElementById('stat_resident_orphans') as HTMLInputElement).value, 10),
                    tuition_students: parseInt((document.getElementById('stat_tuition_students') as HTMLInputElement).value, 10),
                    elderly_seniors: parseInt((document.getElementById('stat_elderly_seniors') as HTMLInputElement).value, 10),
                    special_needs_kids: parseInt((document.getElementById('stat_special_needs_kids') as HTMLInputElement).value, 10),
                    years_of_service: parseInt((document.getElementById('stat_years_of_service') as HTMLInputElement).value, 10),
                    staff_count: 16
                  };
                  saveSection('home_stats', updatedStats);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Metrics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ABOUT PAGE & PROGRAMS                                  */}
      {/* ============================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-6 sm:space-y-8">
          {/* About Hero Banner Configuration */}
          <div className="p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#da8a24]" />
              About Page Hero Banner
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Banner Heading</label>
                <input
                  type="text"
                  id="about_hero_title"
                  defaultValue={content.about_page?.hero_title || 'Empowering Vulnerable Lives Since 2010'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Banner Tagline</label>
                <input
                  type="text"
                  id="about_hero_tagline"
                  defaultValue={content.about_page?.hero_tagline || '15+ Years of Dedicated Service to Underprivileged Communities'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Banner Subtitle / Description</label>
                <textarea
                  id="about_hero_subtitle"
                  rows={2}
                  defaultValue={content.about_page?.hero_subtitle || 'Founded on 5th July 2010, Truth Foundation is a registered Public Charitable Trust in Chennai, Tamil Nadu.'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedAbout = {
                    ...(content.about_page || {}),
                    hero_title: (document.getElementById('about_hero_title') as HTMLInputElement).value,
                    hero_tagline: (document.getElementById('about_hero_tagline') as HTMLInputElement).value,
                    hero_subtitle: (document.getElementById('about_hero_subtitle') as HTMLTextAreaElement).value
                  };
                  saveSection('about_page', updatedAbout);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner Details</span>
              </button>
            </div>
          </div>

          {/* Core Programs Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Core Programs & Centers</h3>
                <p className="text-xs text-slate-400">Programs showcased on the About page and across campaigns.</p>
              </div>
              <button
                onClick={handleOpenAddProgram}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold shadow-md transition w-full sm:w-auto shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Program</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(content.about_page?.programs || []).map((prog, idx) => (
                <div
                  key={prog.id || idx}
                  className="bg-[#071b34] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-900">
                      <img
                        src={getRenderableImageUrl(prog.image_url)}
                        alt={prog.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071b34] via-transparent to-transparent" />
                      {prog.tag && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#da8a24] text-white">
                          {prog.tag}
                        </span>
                      )}
                      {prog.badge && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/60 text-white backdrop-blur-sm">
                          {prog.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <h4 className="text-base font-bold text-white">{prog.title}</h4>
                      {prog.location && <p className="text-xs text-[#da8a24] font-medium">{prog.location}</p>}
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{prog.description}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditProgram(idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#da8a24]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(idx)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission Statements */}
          <div className="p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#da8a24]" />
              Mission & Vision Statements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Our Mission</label>
                <textarea
                  id="about_mission_statement"
                  rows={3}
                  defaultValue={content.about_page?.mission_statement || 'To provide shelter, nutritious food, free education, and holistic care to orphans, special-needs children, and neglected elderly citizens.'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Our Vision</label>
                <textarea
                  id="about_vision_statement"
                  rows={3}
                  defaultValue={content.about_page?.vision_statement || 'A compassionate society where every abandoned child finds a loving home and every vulnerable senior lives with dignity.'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedAbout = {
                    ...(content.about_page || {}),
                    mission_statement: (document.getElementById('about_mission_statement') as HTMLTextAreaElement).value,
                    vision_statement: (document.getElementById('about_vision_statement') as HTMLTextAreaElement).value
                  };
                  saveSection('about_page', updatedAbout);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Mission & Vision</span>
              </button>
            </div>
          </div>

          {/* Support a Cause CTA Section */}
          <div className="p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#da8a24]" />
              Support a Cause. Change a Life. (About Page CTA Card)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Image Preview with Transparent Cutout */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs font-medium text-slate-400 mb-2">Cutout Image (Transparent)</span>
                <div className="w-full h-44 flex items-center justify-center rounded-lg bg-[#040f1d] p-2 border border-slate-700/50">
                  <img
                    src={supportCauseGirlImg}
                    alt="Support a Cause Girl Donate"
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 mt-2 font-mono">Transparent Background Active</span>
              </div>

              {/* Text Fields */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Card Heading</label>
                  <input
                    type="text"
                    id="about_cta_title"
                    defaultValue={content.about_page?.cta_title || 'Support a Cause. Change a Life.'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Card Subtitle / Description</label>
                  <textarea
                    id="about_cta_subtitle"
                    rows={2}
                    defaultValue={content.about_page?.cta_subtitle || 'Your contribution brings hope, education, nourishment, and care to children, elderly, and special-needs individuals across Tamil Nadu.'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Image Asset Path</label>
                  <input
                    type="text"
                    id="about_cta_image_url"
                    defaultValue={content.about_page?.cta_image_url || 'assets/images/support_cause_girl_donate.png'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedAbout = {
                    ...(content.about_page || {}),
                    cta_title: (document.getElementById('about_cta_title') as HTMLInputElement).value,
                    cta_subtitle: (document.getElementById('about_cta_subtitle') as HTMLTextAreaElement).value,
                    cta_image_url: (document.getElementById('about_cta_image_url') as HTMLInputElement).value
                  };
                  saveSection('about_page', updatedAbout);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition"
              >
                <Save className="w-4 h-4" />
                <span>Save CTA Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: GALLERY PAGE BANNER                                    */}
      {/* ============================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-5 sm:space-y-6">
          <div className="p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#da8a24]" />
              Gallery Page Hero Banner
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Hero Heading</label>
                <input
                  type="text"
                  id="gallery_hero_title"
                  defaultValue={content.gallery_page?.hero_title || 'Moments of Hope, Service & Smiles'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Hero Subtitle</label>
                <textarea
                  id="gallery_hero_subtitle"
                  rows={2}
                  defaultValue={content.gallery_page?.hero_subtitle || 'A visual glimpse into our daily work: nurturing children, supporting elders, and transforming lives across Tamil Nadu.'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedGallery = {
                    hero_title: (document.getElementById('gallery_hero_title') as HTMLInputElement).value,
                    hero_subtitle: (document.getElementById('gallery_hero_subtitle') as HTMLTextAreaElement).value,
                    hero_image_url: content.gallery_page?.hero_image_url || 'assets/images/Gallery_page_hero_section_desktop_view.jpeg'
                  };
                  saveSection('gallery_page', updatedGallery);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Gallery Banner</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-white">Looking for Photo Uploads?</h4>
              <p className="text-xs text-slate-400">Use the Gallery Uploader tab in the left sidebar to add, categorize, and delete gallery images.</p>
            </div>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'gallery';
                window.location.reload();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition text-center shrink-0 w-full sm:w-auto"
            >
              Go to Gallery Uploader
            </a>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CONTACT PAGE & OFFICES                                 */}
      {/* ============================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-5 sm:space-y-6">
          <div className="p-4 sm:p-6 bg-[#071b34] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#da8a24]" />
              Official Contact & Office Information
            </h3>
            <p className="text-xs text-slate-400">These details are displayed on the public Contact page and in the footer.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
              {/* Phone & Email */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Primary Phone (Redhills)</label>
                <input
                  type="text"
                  id="contact_redhills_phone"
                  defaultValue={content.contact_page?.redhills_phone || '+91 63827 21178'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Secondary Phone (Kolathur)</label>
                <input
                  type="text"
                  id="contact_kolathur_phone"
                  defaultValue={content.contact_page?.kolathur_phone || '+91 99622 94949'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">WhatsApp CTA Number</label>
                <input
                  type="text"
                  id="contact_whatsapp_number"
                  defaultValue={content.contact_page?.whatsapp_number || '+916382721178'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Official Email Address</label>
                <input
                  type="email"
                  id="contact_email"
                  defaultValue={content.contact_page?.redhills_email || 'truthfoundation2010@gmail.com'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              {/* Addresses */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Registered Home Office Address (Redhills)
                </label>
                <textarea
                  id="contact_redhills_address"
                  rows={2}
                  defaultValue={content.contact_page?.redhills_address || 'No. 12, Gandhi Nagar, Redhills, Chennai - 600052, Tamil Nadu, India'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Corporate Office Address (Kolathur)
                </label>
                <textarea
                  id="contact_kolathur_address"
                  rows={2}
                  defaultValue={content.contact_page?.kolathur_address || 'Old No. 12, New No. 28, 2nd Main Road, Thanikachalam Nagar, E-Block, Kolathur, Chennai - 600099, Tamil Nadu, India'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Operating Hours</label>
                <input
                  type="text"
                  id="contact_timings"
                  defaultValue={content.contact_page?.timings || 'Monday - Saturday: 9:00 AM - 7:00 PM'}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                disabled={saving}
                onClick={() => {
                  const updatedContact = {
                    hero_title: content.contact_page?.hero_title || 'Get In Touch With Truth Foundation',
                    hero_subtitle: content.contact_page?.hero_subtitle || 'We are here to answer your questions and guide your donation contributions.',
                    hero_image_url: content.contact_page?.hero_image_url || 'assets/images/contact_page_hero_background_image_desktop_view.jpg',
                    redhills_name: 'Truth Foundation Home & Orphanage Campus',
                    redhills_address: (document.getElementById('contact_redhills_address') as HTMLTextAreaElement).value,
                    redhills_phone: (document.getElementById('contact_redhills_phone') as HTMLInputElement).value,
                    redhills_email: (document.getElementById('contact_email') as HTMLInputElement).value,
                    kolathur_name: 'Administrative & Corporate Office',
                    kolathur_address: (document.getElementById('contact_kolathur_address') as HTMLTextAreaElement).value,
                    kolathur_phone: (document.getElementById('contact_kolathur_phone') as HTMLInputElement).value,
                    kolathur_email: (document.getElementById('contact_email') as HTMLInputElement).value,
                    whatsapp_number: (document.getElementById('contact_whatsapp_number') as HTMLInputElement).value,
                    timings: (document.getElementById('contact_timings') as HTMLInputElement).value
                  };
                  saveSection('contact_page', updatedContact);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: DONATION POPUPS & LIVE MESSAGES                         */}
      {/* ============================================================== */}
      {activeTab === 'popups' && (
        <div className="space-y-6">
          {/* Top Info & Settings Card */}
          <div className="bg-[#071b34] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#da8a24]" />
                  Live Donation Popups (WhatsApp Widget Notifications)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Configure automatic typing and live donor contribution messages that pop up near the floating WhatsApp icon across both mobile and desktop views.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleOpenAddPopup}
                  className="flex items-center gap-2 px-4 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Donor Message</span>
                </button>
              </div>
            </div>

            {/* Global Settings: Enable Toggle & Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <input
                  type="checkbox"
                  id="popups_enabled_toggle"
                  defaultChecked={content.donation_popups?.enabled ?? true}
                  className="w-4 h-4 accent-[#da8a24] rounded cursor-pointer"
                />
                <label htmlFor="popups_enabled_toggle" className="text-xs font-medium text-slate-200 cursor-pointer">
                  Enable Popup Notifications on Website
                </label>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <label htmlFor="popups_interval_input" className="text-xs font-medium text-slate-300 shrink-0">
                  Cycle Interval (Seconds):
                </label>
                <input
                  type="number"
                  id="popups_interval_input"
                  min="3"
                  max="60"
                  defaultValue={content.donation_popups?.interval_seconds ?? 5}
                  className="w-20 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-bold focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="flex items-center sm:col-span-2 lg:col-span-1 justify-end">
                <button
                  disabled={saving}
                  onClick={() => {
                    const isEnabled = (document.getElementById('popups_enabled_toggle') as HTMLInputElement)?.checked ?? true;
                    const interval = parseInt((document.getElementById('popups_interval_input') as HTMLInputElement)?.value || '5', 10);
                    const updatedConfig: DonationPopupsConfig = {
                      enabled: isEnabled,
                      interval_seconds: interval >= 3 ? interval : 5,
                      popups: getPopupsList()
                    };
                    saveSection('donation_popups', updatedConfig);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Popup Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of Popup Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPopupsList().map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#071b34] border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#da8a24] to-[#f59e0b] text-[#071b34] font-bold text-xs flex items-center justify-center shrink-0">
                        {(item.name || 'TF')
                          .split(' ')
                          .map((w) => w[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {item.location || 'Chennai'} • <span className="text-emerald-400">{item.time_ago || 'Just now'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-slate-900/70 rounded-xl p-2.5 text-xs text-slate-300">
                    <span className="text-slate-400">Cause:</span>{' '}
                    <span className="font-medium text-white">{item.cause || 'Meals & Care'}</span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>CTA Button:</span>
                    <span className="text-[#da8a24] font-medium">"{item.cta_text || 'Add your donation'}"</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenEditPopup(idx)}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer text-xs flex items-center gap-1"
                    title="Edit message"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#da8a24]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePopup(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition cursor-pointer text-xs flex items-center gap-1"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT HERO SLIDE                                  */}
      {/* ============================================================== */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#071b34] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#da8a24]" />
                {editingSlideIndex !== null ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <button
                onClick={() => setSlideModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Slide Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  placeholder="e.g. ONE MEAL. ONE SMILE."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={slideForm.tagline}
                  onChange={(e) => setSlideForm({ ...slideForm, tagline: e.target.value })}
                  placeholder="e.g. Your ₹500 can provide warm, nutritious meals"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle / Paragraph</label>
                <textarea
                  rows={2}
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  placeholder="e.g. Every donation directly funds nutritious meals, education, and healthcare..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tag Badge (Amber)</label>
                  <input
                    type="text"
                    value={slideForm.tag}
                    onChange={(e) => setSlideForm({ ...slideForm, tag: e.target.value })}
                    placeholder="e.g. Public Charitable Trust"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Secondary Badge</label>
                  <input
                    type="text"
                    value={slideForm.badge}
                    onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                    placeholder="e.g. Est. 5th July 2010"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Hero Slide Image (Stores directly to Cloudinary)
                </label>

                {slidePreview && (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-slate-800">
                    <img
                      src={slideFile ? slidePreview : getRenderableImageUrl(slidePreview)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white">
                      {slideFile ? 'New Image Selected' : 'Current Image'}
                    </div>
                  </div>
                )}

                <div
                  onClick={() => slideFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-[#da8a24] rounded-xl p-4 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-[#da8a24] mb-1" />
                  <p className="text-xs font-semibold text-slate-200">
                    {slideFile ? slideFile.name : 'Click to upload replacement image to Cloudinary'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                </div>
                <input
                  ref={slideFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSlideFile(f);
                      setSlidePreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-5 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Hero Slide</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT ABOUT PROGRAM                                */}
      {/* ============================================================== */}
      {programModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#071b34] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#da8a24]" />
                {editingProgramIndex !== null ? 'Edit Core Program' : 'Add New Program'}
              </h3>
              <button
                onClick={() => setProgramModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgramSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Program Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="e.g. Redhills Orphanage Home"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={programForm.location || ''}
                    onChange={(e) => setProgramForm({ ...programForm, location: e.target.value })}
                    placeholder="e.g. Redhills, Northern Chennai"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tag / Badge</label>
                  <input
                    type="text"
                    value={programForm.tag || ''}
                    onChange={(e) => setProgramForm({ ...programForm, tag: e.target.value })}
                    placeholder="e.g. 15+ Years Active"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Detailed summary of the initiative..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Features / Bullets (One per line)
                </label>
                <textarea
                  rows={3}
                  value={programDetailsRaw}
                  onChange={(e) => setProgramDetailsRaw(e.target.value)}
                  placeholder="Separate dormitories for boys & girls&#10;16 committed full-time caregivers&#10;Nutritious 3-meal daily diet"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Program Cover Image
                </label>
                {programPreview && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-slate-800">
                    <img
                      src={programFile ? programPreview : getRenderableImageUrl(programPreview)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  onClick={() => programFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-[#da8a24] rounded-xl p-4 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-[#da8a24] mb-1" />
                  <p className="text-xs font-semibold text-slate-200">
                    {programFile ? programFile.name : 'Upload image to Cloudinary'}
                  </p>
                </div>
                <input
                  ref={programFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setProgramFile(f);
                      setProgramPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProgramModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-5 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Program</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT DONATION POPUP                               */}
      {/* ============================================================== */}
      {popupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#071b34] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#da8a24]" />
                {editingPopupIndex !== null ? 'Edit Donor Popup Message' : 'Add New Donor Message'}
              </h3>
              <button
                onClick={() => setPopupModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePopupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Donor Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={popupForm.name}
                  onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })}
                  placeholder="e.g. Karthik Raja"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Donation Amount (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={popupForm.amount}
                    onChange={(e) => setPopupForm({ ...popupForm, amount: Number(e.target.value) })}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                  <span className="text-[10px] text-amber-400/80">Suggested: ₹500 or above</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Donor Location</label>
                  <input
                    type="text"
                    value={popupForm.location || ''}
                    onChange={(e) => setPopupForm({ ...popupForm, location: e.target.value })}
                    placeholder="e.g. Chennai / Tambaram"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cause / Purpose <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={popupForm.cause || ''}
                  onChange={(e) => setPopupForm({ ...popupForm, cause: e.target.value })}
                  placeholder="e.g. Special Meals for 15 Children"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time Tag</label>
                  <input
                    type="text"
                    value={popupForm.time_ago || ''}
                    onChange={(e) => setPopupForm({ ...popupForm, time_ago: e.target.value })}
                    placeholder="e.g. Just now / 2 mins ago"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={popupForm.cta_text || ''}
                    onChange={(e) => setPopupForm({ ...popupForm, cta_text: e.target.value })}
                    placeholder="e.g. Add your donation"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPopupModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
