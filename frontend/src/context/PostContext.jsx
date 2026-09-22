import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const PostContext = createContext(null);

const initialState = {
  posts: [],
  postsLoading: false,
  postsNextCursor: null,
  postsHasMore: true,
};

function postReducer(state, action) {
  switch (action.type) {
    case 'FETCH_POSTS_START':
      return { ...state, postsLoading: true };
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        posts: action.payload.posts,
        postsNextCursor: action.payload.nextCursor,
        postsHasMore: action.payload.hasMore,
        postsLoading: false,
      };
    case 'FETCH_POSTS_FAILURE':
      return { ...state, postsLoading: false };
    case 'FETCH_MORE_POSTS_SUCCESS':
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        postsNextCursor: action.payload.nextCursor,
        postsHasMore: action.payload.hasMore,
        postsLoading: false,
      };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'LIKE_POST_OPTIMISTIC':
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload || post.id === action.payload) {
            const currentLikes = Array.isArray(post.likes) ? post.likes : [];
            const isCurrentlyLiked = post.isLiked;
            return {
              ...post,
              isLiked: !isCurrentlyLiked,
              likes: isCurrentlyLiked ? currentLikes.slice(0, -1) : [...currentLikes, 'temp'],
            };
          }
          return post;
        }),
      };
    case 'LIKE_POST_REVERT':
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload || post.id === action.payload) {
            const currentLikes = Array.isArray(post.likes) ? post.likes : [];
            const isCurrentlyLiked = post.isLiked;
            return {
              ...post,
              isLiked: !isCurrentlyLiked, // revert
              likes: isCurrentlyLiked ? currentLikes.slice(0, -1) : [...currentLikes, 'temp'],
            };
          }
          return post;
        }),
      };
    case 'SAVE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload || post.id === action.payload
            ? { ...post, isSaved: !post.isSaved }
            : post
        ),
      };
    case 'ADD_POST':
      if (state.posts.some((post) => post._id === action.payload._id)) return state;
      return { ...state, posts: [action.payload, ...state.posts] };
    default:
      return state;
  }
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const fetchPosts = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_POSTS_START' });
      const { data } = await api.get('/posts?limit=20');
      dispatch({
        type: 'FETCH_POSTS_SUCCESS',
        payload: {
          posts: data.posts || data,
          nextCursor: data.nextCursor || null,
          hasMore: data.hasMore ?? false,
        },
      });
    } catch (error) {
      console.error('Error fetching posts', error);
      dispatch({ type: 'FETCH_POSTS_FAILURE' });
    }
  }, []);

  const fetchMorePosts = useCallback(async () => {
    const { postsNextCursor, postsHasMore, postsLoading } = state;
    if (!postsHasMore || postsLoading || !postsNextCursor) return;

    try {
      dispatch({ type: 'FETCH_POSTS_START' });
      const { data } = await api.get(`/posts?cursor=${postsNextCursor}&limit=20`);
      dispatch({
        type: 'FETCH_MORE_POSTS_SUCCESS',
        payload: {
          posts: data.posts || data,
          nextCursor: data.nextCursor || null,
          hasMore: data.hasMore ?? false,
        },
      });
    } catch (error) {
      console.error('Error fetching more posts', error);
      dispatch({ type: 'FETCH_POSTS_FAILURE' });
    }
  }, [state]);

  const likePost = useCallback(async (postId) => {
    dispatch({ type: 'LIKE_POST_OPTIMISTIC', payload: postId });
    try {
      await api.put(`/posts/${postId}/like`);
    } catch (error) {
      console.error('Error liking post:', error);
      dispatch({ type: 'LIKE_POST_REVERT', payload: postId });
    }
  }, []);

  const savePost = useCallback((postId) => {
    dispatch({ type: 'SAVE_POST', payload: postId });
  }, []);

  const setPosts = useCallback((posts) => {
    dispatch({ type: 'SET_POSTS', payload: posts });
  }, []);

  const addPost = useCallback((post) => {
    dispatch({ type: 'ADD_POST', payload: post });
  }, []);

  const value = {
    ...state,
    fetchPosts,
    fetchMorePosts,
    likePost,
    savePost,
    setPosts,
    addPost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
