import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import Avatar from '../ui/Avatar';
import api from '../../utils/api';
import { compressImage } from '../../utils/helpers';

const CreatePost = () => {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Validation: Text is required
    setPosting(true);
    try {
      let imageUrl = null;

      // Server-Side ImageKit Upload via Backend with client-side compression
      if (imageFile) {
        const fileToUpload = await compressImage(imageFile);
        const formData = new FormData();
        formData.append('image', fileToUpload);

        const uploadRes = await api.post('/posts/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60s timeout for image upload
        });
        
        if (uploadRes.data && uploadRes.data.url) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error('Image upload failed to return a URL');
        }
      }

      const { data: createdPost } = await api.post('/posts', { content: text, image: imageUrl }, { timeout: 30000 });
      
      if (addPost && createdPost) {
        addPost(createdPost);
      }
      
      setText('');
      removeImage();
      setOpen(false);
      // Let the frontend reload posts
      window.dispatchEvent(new Event('post:created'));
    } catch (error) {
      console.error('Failed to create post', error);
      const errorMessage =
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'Upload timed out. Please check your network connection or try a smaller image.'
          : error.message || 'Unknown error');
      alert('Failed to create post: ' + errorMessage);
    } finally {
      setPosting(false);
    }
  };

  const isGuest = user?.role === 'guest';

  if (isGuest) {
    return (
      <div className="card p-5 text-center bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30">
        <h3 className="text-lg font-bold text-dark-900 dark:text-dark-100 mb-2">Join the Conversation</h3>
        <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 max-w-md mx-auto">
          Create an account to share your thoughts, connect with developers, and like posts.
        </p>
        <button onClick={() => window.location.href = '/signup'} className="btn-brand py-2 px-6">
          Sign Up Now
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'Guest'} size="md" showRing />
          <button
            onClick={() => setOpen(true)}
            className="flex-1 text-left px-4 py-2.5 bg-dark-50 dark:bg-dark-700/50 border border-dark-200 dark:border-dark-700 rounded-full text-sm text-dark-400 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
          >
            What's on your mind, {user?.name?.split(' ')[0] || 'there'}?
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-100 dark:border-dark-700">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-blue-500" />
            Post
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => !posting && setOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between p-4 border-b border-dark-100 dark:border-dark-700">
                  <h2 className="font-semibold text-dark-900 dark:text-dark-100">Create Post</h2>
                  <button disabled={posting} onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 disabled:opacity-50">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={user?.name || 'Guest'} size="md" showRing />
                    <div>
                      <p className="font-semibold text-sm text-dark-900 dark:text-dark-100">{user?.name || 'Guest User'}</p>
                    </div>
                  </div>

                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share something with your network..."
                    className="w-full min-h-[120px] bg-transparent text-dark-800 dark:text-dark-200 placeholder-dark-400 focus:outline-none text-sm resize-none leading-relaxed"
                    autoFocus
                    disabled={posting}
                  />

                  {imagePreview && (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-dark-100 dark:border-dark-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
                      <button
                        onClick={removeImage}
                        disabled={posting}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border-t border-dark-100 dark:border-dark-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={posting}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-blue-500 disabled:opacity-50" 
                      title="Photo"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <motion.button
                    whileHover={!(!text.trim() || posting) ? { scale: 1.02 } : {}}
                    whileTap={!(!text.trim() || posting) ? { scale: 0.98 } : {}}
                    onClick={handlePost}
                    disabled={!text.trim() || posting}
                    className="btn-brand disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Posting...
                      </div>
                    ) : 'Post'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreatePost;
