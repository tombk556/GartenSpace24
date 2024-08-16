"use client"

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(); // Named export

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // On mount, check if the user is already authenticated
        const token = localStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optionally, verify the token by making a request to the backend
            axios.get('http://localhost:8000/auth/users/me')
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.log('Token verification failed:', error);
                    logout(); // Clear token and logout if verification fails
                });
        }
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
            setUser(response.data);
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
