"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMessage from "@components/ErrorMessage";

export default function Profile() {
  const [user, setUser] = useState({ email: '', username: '', id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios
      .get('http://localhost:8000/auth/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    axios
      .put(
        'http://localhost:8000/auth/update_user_infos',
        {
          email: user.email,
          username: user.username        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert('Profile updated successfully');
      })
      .catch((error) => {
        setError(error.response.data.detail);
      });
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <p className="text-gray-700 mb-6"> ID:
            <span className="orange_text"> {user.id}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full text text-gray-800 px-4 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-black"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username:</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full text text-gray-800 px-4 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          <ErrorMessage message={error} />
            <button
              type="submit"
              className="black_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
            >
              Update Profile
            </button>
          </form>
        </div>
  );
}
