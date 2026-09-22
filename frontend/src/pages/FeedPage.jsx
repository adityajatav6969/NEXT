import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton } from '../components/ui/Skeletons';
import { usePosts } from '../context/PostContext';

const FeedPage = () => {
  const { posts, fetchPosts, fetchMorePosts, postsLoading, postsHasMore } = usePosts();
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchPosts();
      setInitialLoading(false);
    };

    loadData();
  }, [fetchPosts]);

  useEffect(() => {
    const handlePostCreated = () => {
      fetchPosts();
    };
    window.addEventListener('post:created', handlePostCreated);
    return () => window.removeEventListener('post:created', handlePostCreated);
  }, [fetchPosts]);



  const lastPostRef = useCallback(
    (node) => {
      if (postsLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && postsHasMore) {
            fetchMorePosts();
          }
        },
        { threshold: 0.5 }
      );

      if (node) observerRef.current.observe(node);
    },
    [postsLoading, postsHasMore, fetchMorePosts]
  );

  return (
    <Layout>
      <CreatePost />
      {initialLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-4"
        >
          {posts.map((post, index) => (
            <div key={post._id || post.id} ref={index === posts.length - 1 ? lastPostRef : null}>
              <PostCard post={post} />
            </div>
          ))}

          {postsLoading && !initialLoading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!postsHasMore && posts.length > 0 && (
            <p className="text-center text-sm text-dark-400 py-6">You're all caught up!</p>
          )}

          {!postsLoading && posts.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-dark-400 mb-2">No posts yet</p>
              <p className="text-sm text-dark-300">Be the first to share something!</p>
            </div>
          )}
        </motion.div>
      )}
    </Layout>
  );
};

export default FeedPage;
