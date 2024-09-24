import { useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { images } from '../assets/constants';

const SplashScreen = () => {
    NavigationBar.setBackgroundColorAsync("#212A2B");

    useEffect(() => {
        const checkIsLoggedIn = async () => {
            const token = await AsyncStorage.getItem('token');
            const role = await AsyncStorage.getItem('role');

            setTimeout(() => {
                if (token && role) {
                    return role === 'buyer' ? router.replace('/user/home') : router.replace('/agent/dashboard');
                }

                return router.replace('/login');
            }, 3000);
        }

        checkIsLoggedIn();
    }, []);

    return (
        <SafeAreaView className='flex items-center justify-center h-full bg-darkUmber-dark'>
            <Image
                source={images.logo}
                resizeMode='contain'
                className='w-[100px]'
            />

            <StatusBar backgroundColor={'#212A2B'} />
        </SafeAreaView>
    );
}

export default SplashScreen;