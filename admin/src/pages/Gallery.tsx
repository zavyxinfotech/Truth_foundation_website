import React, { useEffect, useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { GalleryImage } from '../types';

const CATEGORIES = ['All', 'Meals', 'Education', 'Birthday Celebrations', 'Volunteers', 'Medical', 'Events', 'General'];

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

  // Edit Modal State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Meals');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleOpenEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setEditTitle(img.title || '');
    setEditCategory(img.category || 'Meals');
    setEditDescription(img.description || '');
    setEditFile(null);
    setEditPreview(null);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('category', editCategory);
      formData.append('description', editDescription);
      if (editFile) {
        formData.append('image', editFile);
      }

      const res = await apiRequest<{ image: GalleryImage }>(`/gallery/${editingImage.id}`, {
        method: 'PUT',
        body: formData,
      });

      setImages(images.map((img) => (img.id === editingImage.id ? res.image : img)));
      setEditingImage(null);
      alert('Gallery image updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update image');
    } finally {
      setUpdating(false);
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

  const getImageSrc = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:5173/src/${url.replace(/^\/?/, '')}`;
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
                  className="max-h-48 rounded-xl object-contain shadow-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#da8a24] mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop your high-resolution field photograph here, or <span className="text-[#da8a24]">browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, JPEG, WEBP up to 10MB</p>
              </>
            )}
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Image Title / Caption
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily Nutritional Lunch at Redhills Home"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-[#da8a24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-[#da8a24]"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description / Field Story (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the activity or child support initiative..."
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-[#da8a24]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#da8a24] to-[#b7711b] hover:from-[#e5952f] hover:to-[#c67c20] text-[#071b34] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload to Cloudinary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Photos Browser */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Cloudinary Stored Photographs</h3>
            <p className="text-xs text-slate-400">Total photos stored in Supabase: {images.length}</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
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
                className="group relative bg-[#071b34] border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#da8a24]/50 transition"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={getImageSrc(img.image_url)}
                    alt={img.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#071b34]/80 backdrop-blur-md text-[#da8a24] border border-slate-700">
                    {img.category}
                  </div>
                </div>

                <div className="p-3 space-y-2 border-t border-slate-800/80">
                  <p className="text-slate-200 truncate font-semibold text-xs" title={img.title}>
                    {img.title || 'Untitled'}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {img.cloudinary_public_id ? 'Cloudinary' : 'Existing'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(img)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#da8a24]" />
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="p-1 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Gallery Item Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071b34] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#da8a24]" />
                Edit Gallery Photo Details
              </h3>
              <button
                onClick={() => setEditingImage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photo Title / Caption</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-[#da8a24] focus:outline-none"
                />
              </div>

              {/* Optional replacement image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Replace Photo on Cloudinary (Optional)
                </label>
                {editPreview && (
                  <div className="mb-2 h-24 w-full rounded-lg overflow-hidden border border-slate-700">
                    <img src={editPreview} alt="New Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700 hover:border-[#da8a24] rounded-xl p-3 text-center cursor-pointer bg-slate-900/60"
                >
                  <p className="text-xs text-slate-300">
                    {editFile ? editFile.name : 'Click to select new image file'}
                  </p>
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setEditFile(f);
                      setEditPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-5 py-2 bg-[#da8a24] hover:bg-[#c77a1e] text-[#071b34] rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
