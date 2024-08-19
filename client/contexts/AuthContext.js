import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { config } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authMessage, setAuthMessage] = useState('');

    useEffect(() => {
        setAuthError('');
        setAuthMessage('');
    }, []);

    const register = async (userData) => {
        setAuthLoading(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/user/register`, userData);
            
            setAuthMessage(response.data.message);

            setTimeout(() => {
                setAuthMessage('');
                router.replace('/login');
            }, 3000);
        } catch (err) {
            setAuthError(err.response.data.message);

            setTimeout(() => {
                setAuthError('');
            }, 3000);
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (credentials) => {
        setAuthLoading(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/user/login`, credentials);
            
            setAuthMessage(response.data.message);

            await AsyncStorage.setItem('token', response.data.accessToken);

            setTimeout(() => {
                setAuthMessage('');
    
                response.data.role === 'individual-agent' || response.data.role === 'company-agent' ? router.replace('/agent/dashboard') : router.replace('/user/home');
            }, 3000);

        } catch (err) {
            setAuthError(err.response.data.message);

            setTimeout(() => {
                setAuthError('');
            }, 3000);
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{
            authLoading,
            setAuthError,
            authError,
            setAuthMessage,
            authMessage,
            register,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
