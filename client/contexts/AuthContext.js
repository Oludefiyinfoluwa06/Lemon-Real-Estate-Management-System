import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { config } from '../config';

import { CLOUDINARY_CLOUD_NAME } from '@env';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');

    useEffect(() => {
        setAuthError('');
        setAuthMessage('');
    }, []);

    const register = async (userData) => {
        setAuthLoading(true);

        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/user/register`, userData);

            setAuthMessage(response.data.message);

            await AsyncStorage.setItem('token', response.data.accessToken);

            setTimeout(() => {
                setAuthMessage('');

                router.replace(`/profile-picture-upload?role=${response.data.role}`);
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

    const uploadProfilePicture = async (role, image) => {
        setAuthLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                return router.replace('/login');
            }

            const formData = new FormData();
            formData.append('file', {
                uri: image,
                type: 'image/jpeg',
                name: 'upload.jpg',
            });
            formData.append('upload_preset', 'lemon-app');

            const imgResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setProfilePictureUrl(imgResponse.data.url);

            const response = await axios.put(`${config.API_BASE_URL}/api/user/profile-picture/upload`, { profilePictureUrl }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setAuthMessage(response.data.message);

            setTimeout(() => {
                setAuthMessage('');

                role === 'individual-agent' || role === 'company-agent' ? router.replace('/agent/dashboard') : router.replace('/user/home');
            }, 3000);
        } catch (error) {
            setAuthError(error.response.data.message);

            setTimeout(() => {
                setAuthError('');
            }, 3000);
        } finally {
            setAuthLoading(false);
        }
    }

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
            uploadProfilePicture,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
