import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { config } from '../config';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [chatError, setChatError] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let newSocket;
        try {
            newSocket = io(config.API_BASE_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                setSocket(newSocket);
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            newSocket.on('receiveMessage', (message) => {
                if (message && typeof message === 'object') {
                    setMessages((prevMessages) => {
                        const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
                        const messageExists = currentMessages.some(
                            msg => msg._id === message._id
                        );
                        if (!messageExists) {
                            return [...currentMessages, message];
                        }
                        return currentMessages;
                    });
                }
            });

            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
        } catch (error) {
            console.error('Socket initialization error:', error);
        }
    }, []);

    const showError = (errorMessage) => {
        setChatError(errorMessage);
        setTimeout(() => {
            setChatError('');
        }, 3000);
    };

    const sendMessage = async (data) => {
        try {
            if (!socket || !isConnected) {
                throw new Error('Socket connection not established');
            }

            if (!data || typeof data !== 'object') {
                throw new Error('Invalid message data');
            }

            socket.emit('sendMessage', data);

            const response = await axios.post(
                `${config.API_BASE_URL}/api/chat/send`,
                data
            );

            setMessages((prevMessages) => {
                const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
                return [...currentMessages, response.data];
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            showError(errorMessage);
            throw error;
        }
    };

    const getMessages = async (senderId, receiverId) => {
        try {
            if (!senderId || !receiverId) {
                throw new Error('SenderId and ReceiverId are required');
            }

            const response = await axios.get(
                `${config.API_BASE_URL}/api/chat/${senderId}/${receiverId}`
            );

            const messageArray = Array.isArray(response.data) ? response.data : [];
            setMessages(messageArray);
            return messageArray;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            showError(errorMessage);
            throw error;
        }
    };

    const fetchChats = async (userId) => {
        try {
            if (!userId) {
                throw new Error('UserId is required');
            }

            const response = await axios.get(
                `${config.API_BASE_URL}/api/chat/list/${userId}`
            );

            const chatArray = Array.isArray(response.data) ? response.data : [];
            setChatList(chatArray);
            return chatArray;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            showError(errorMessage);
            throw error;
        }
    };

    const value = {
        messages: Array.isArray(messages) ? messages : [],
        sendMessage,
        getMessages,
        fetchChats,
        chatList: Array.isArray(chatList) ? chatList : [],
        chatError,
        isConnected
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);