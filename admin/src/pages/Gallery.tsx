import React, { useEffect, useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Loader2,
  X,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { GalleryImage } from '../types';

const CATEGORIES = ['All', 'Meals', 'Birthday', 'Tuition', 'Volunteers', 'Medical', 'General'];

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Upload Form State
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meals');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const queryParam = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
      const data = await apiRequest<{ images: GalleryImage[] }>(`/gallery${queryParam}`);
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);

      const result = await apiRequest<{ image: GalleryImage }>('/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      setImages([result.image, ...images]);
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('Image uploaded to Cloudinary successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this image from Cloudinary and database?')) return;
    try {
      await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
      setImages(images.filter((img) => img.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Box Container */}
      <div className="bg-[#071b34]/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="mb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#da8a24]" />
            <span>Upload New Photo to Cloudinary CDN</span>
          </h3>
          <p className="text-xs text-slate-400">
            Uploaded images are stored on Cloudinary (cloud: <span className="text-[#da8a24] font-mono">xsuj7lkd</span>) and saved in Supabase.
          </p>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              previewUrl
                ? 'border-[#da8a24]/60 bg-[#da8a24]/5'
                : 'border-slate-700 hover:border-[#da8a24]/60 bg-slate-900/40 hover:bg-slate-900/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-xl object-contain shadow-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-[#da8a24] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">Click to browse or drag and drop image here</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
              </>
            )}
          </div>

          {/* Form Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Photo Title / Caption</label>
              <input
                type="text"
                placeholder="e.g. Daily Wholesome Meals at Redhills Orphanage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#da8a24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#da8a24]"
              >
                <option value="Meals">Meals</option>
                <option value="Birthday">Birthday Celebrations</option>
                <option value="Tuition">Tuition & Education</option>
                <option value="Volunteers">Volunteers & Events</option>
                <option value="Medical">Medical Support</option>
                <option value="General">General Campus</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-6 py-2.5 rounded-xl bg-[#da8a24] hover:bg-[#c77a1e] text-[#071b34] font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-md"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Filter & Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Cloud Gallery Photos</h3>
            <p className="text-xs text-slate-400">{images.length} photos active in cloud database</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#da8a24] text-[#071b34] font-semibold'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#da8a24]" />
            <span>Loading photos from Supabase...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm bg-[#071b34]/40 border border-slate-800 rounded-2xl">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p>No photos found for category: {selectedCategory}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative bg-[#071b34] border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={img.image_url}
                    alt={img.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#071b34]/80 backdrop-blur-md text-[#da8a24] border border-slate-700">
                    {img.category}
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <span className="text-slate-300 truncate font-medium text-[11px]" title={img.title}>
                    {img.title || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={img.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-white"
                      title="View full resolution"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-1 text-red-400/80 hover:text-red-400 transition cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
