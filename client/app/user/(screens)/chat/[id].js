import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const ChatScreen = () => {
    const params = useLocalSearchParams();
    const name = params.name;
    const profilePicture = params.profilePicture;

    const [messages, setMessages] = useState([
        { id: 1, sender: 'them', text: 'Hey, how are you?' },
        { id: 2, sender: 'me', text: 'I am good, thanks!' },
        { id: 3, sender: 'them', text: 'That\'s great to hear.' }
    ]);
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = () => {
        if (messageText.trim()) {
            setMessages([
                ...messages,
                { id: messages.length + 1, sender: 'me', text: messageText.trim() }
            ]);
            setMessageText('');
        }
    };

    const renderMessageItem = ({ item }) => (
        <View
            style={{
                padding: 10,
                backgroundColor: item.sender === 'me' ? '#BBCC13' : '#3D454B',
                alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
                borderRadius: 10,
                marginVertical: 5,
                maxWidth: '80%',
            }}
        >
            <Text className="text-white font-rregular">{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView className='flex-1 bg-darkUmber-dark'>
            <View className='flex-row items-center bg-frenchGray-dark p-4'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back-outline' size={20} color={"#FFFFFF"} />
                </TouchableOpacity>
                <View className="flex-row items-center ml-2">
                    {profilePicture ? (
                        <Image
                            source={{ uri: profilePicture }}
                            className='w-10 h-10 rounded-full'
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
                    )}
                    <Text className='text-white font-rbold text-xl ml-3'>{name}</Text>
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView behavior="padding">
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: '#2B3B3C',
                        borderTopWidth: 1,
                        borderTopColor: '#3D454B',
                    }}
                >
                    <View className='flex-row items-center bg-frenchGray-light rounded-lg'>
                        <TextInput
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder="Type a message"
                            placeholderTextColor="#AFAFAF"
                            className='flex-1 p-3 text-white font-rregular'
                            style={{ maxHeight: 100 }}
                            multiline
                        />
                        <TouchableOpacity onPress={handleSendMessage} className='p-3'>
                            <Ionicons name='send' size={24} color='#BBCC13' />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ChatScreen;
