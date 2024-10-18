import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Chats = () => {
    const chatList = [
        {
            _id: '1',
            name: 'John Doe',
            lastMessage: 'Hello, how can I assist you?',
            timestamp: '10:00 AM',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            _id: '2',
            name: 'Jane Smith',
            lastMessage: 'Thank you for your help!',
            timestamp: '09:45 AM',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            _id: '3',
            name: 'Chris Johnson',
            lastMessage: 'Can we schedule a meeting?',
            timestamp: 'Yesterday',
            avatar: 'https://via.placeholder.com/40',
        },
    ];

    const renderChatItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push(`/agent/chat/${item._id}?name=${item.name}&profilePicture=${item.avatar}`);
                }}
                className="flex-row items-center bg-darkUmber-light p-4 mb-2 rounded-lg"
            >
                <Image
                    source={{ uri: item.avatar }}
                    className="w-10 h-10 rounded-full"
                />
                <View className="flex-1 ml-4">
                    <Text className="text-white font-medium text-lg">{item.name}</Text>
                    <Text className="text-frenchGray-light">{item.lastMessage}</Text>
                </View>
                <Text className="text-frenchGray-light">{item.timestamp}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-darkUmber-dark p-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-bold">Chats</Text>
            </View>
            <FlatList
                data={chatList}
                renderItem={renderChatItem}
                keyExtractor={(item) => item._id}
            />
        </SafeAreaView>
    );
};

export default Chats;
