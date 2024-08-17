"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const rehydrateUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Optionally verify token with backend to fetch user data
                try {
                    const response = await axios.get('http://localhost:8000/auth/users/me');
                    setUser(response.data); // Set user data received from backend
                    router.push('/');
                } catch (error) {
                    console.error('Failed to rehydrate user:', error);
                }
            }
        };
        rehydrateUser();
    }, []);

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post('http://localhost:8000/auth/login', formData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            localStorage.setItem('access_token', response.data.access_token);
            setUser(response.data); // Assume response.data contains user info
            router.push('/');
        } catch (error) {
            console.log('Login Failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
