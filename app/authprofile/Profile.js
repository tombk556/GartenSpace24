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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me`, {
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

  const updateAccount = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update_user_infos`,
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
    
    const deleteAccount = (e) => {
      e.preventDefault();
      const token = localStorage.getItem('access_token');
      
      axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete_user`)
      .then(() => {
        localStorage.removeItem('access_token');
        window.location.href = '/';
        alert('Account deleted successfully');
      }).catch((error) => {
        console.log(error);
      });
    };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <p className="text-gray-700 mb-6"> ID:
            <span className="green_text"> {user.id}</span>
          </p>
          <form onSubmit={updateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username:</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full text-gray-800 px-4 py-3.5 rounded-md border-2 border-gray-800 focus:outline-none focus:transform focus:scale-105 transition-transform duration-200"
                />
            </div>
          <ErrorMessage message={error} />
            <button
              type="submit"
              className="black_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
            >
              Update Profile
            </button>
            <button
              type="submit"
              className="red_btn w-full text-white text-sm font-semibold py-3.5 rounded-md"
              onClick={deleteAccount}
            >
              Delete Account
            </button>
          </form>
        </div>
  );
}
