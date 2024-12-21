import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import { setPageTitle } from '../../redux/actions';

// Utility to convert file to Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Posts = () => {
  const dispatch = useDispatch();

  // State management
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [quilValue, setQuilValue] = useState('');
  const [formParams, setFormParams] = useState({
    title: '',
    image: null,
    description: '',
  });
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle('News Management'));
  }, [dispatch]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/posts');
      setAllPosts(response.data.result);
    } catch (error) {
      setError('Failed to fetch posts.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setFormParams((prev) => ({ ...prev, image: base64 }));
    }
  };

  // Open modal for editing/adding
  const openModal = (post = null) => {
    setEditingPost(post);
    setModalVisible(true);
    if (post) {
      setFormParams({ title: post.title, image: post.image, description: post.description });
      setQuilValue(post.description);
    } else {
      setFormParams({ title: '', image: null, description: '' });
      setQuilValue('');
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingPost(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setPostLoading(true);
    const data = { ...formParams, description: quilValue };

    try {
      if (editingPost) {
        await axios.put(`http://localhost:3000/api/posts/${editingPost._id}`, data);
        Swal.fire('Success', 'Post updated successfully', 'success');
      } else {
        await axios.post('http://localhost:3000/api/posts', data);
        Swal.fire('Success', 'Post created successfully', 'success');
      }
      fetchPosts();
      closeModal();
    } catch (error) {
      Swal.fire('Error', 'Failed to save post', 'error');
      console.error(error);
    } finally {
      setPostLoading(false);
    }
  };

  // Handle post deletion
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/posts/${id}`);
        Swal.fire('Deleted!', 'Post has been deleted.', 'success');
        fetchPosts();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete post', 'error');
        console.error(error);
      }
    }
  };

  // Filtered posts
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="posts-container">
      <div className="header">
        <h1>News Management</h1>
        <button onClick={() => openModal()} className="add-post-button">
          Add New Post
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <div key={post._id} className="post-item">
              <h2>{post.title}</h2>
              {post.image && <img src={post.image} alt={post.title} className="post-image" />}
              <p>{post.description}</p>
              <div className="actions">
                <button onClick={() => openModal(post)}>Edit</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formParams.title}
              onChange={handleInputChange}
            />
            <input type="file" onChange={handleFileUpload} />
