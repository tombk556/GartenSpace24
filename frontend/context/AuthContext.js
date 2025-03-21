"use client";

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const rehydrateUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    logout();
                } else {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    try {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me`);
                        setUser(response.data);
                        const expiresIn = decodedToken.exp * 1000 - Date.now();
                        setTimeout(() => {
                            logout();
                        }, expiresIn);
                    } catch (error) {
                        console.error('Failed to rehydrate user:', error);
                        logout();
                    }
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const token = response.data.access_token;
            const decodedToken = jwtDecode(token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('access_token', token);
            setUser(response.data);

            // Automatically log out when token expires
            const expiresIn = decodedToken.exp * 1000 - Date.now();
            setTimeout(() => {
                logout();
            }, expiresIn);

            router.push('/userentities');
            return null;
        } catch (error) {
            console.log('Login Failed:', error);
            return error.response.data.detail;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
