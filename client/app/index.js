import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../assets/constants';
import { useEffect } from 'react';
import { router } from 'expo-router';

const SplashScreen = () => {
    useEffect(() => {
        const checkIsLoggedIn = async () => {
            const token = await AsyncStorage.getItem('token');
            const isAgent = await AsyncStorage.getItem('isAgent');
            
            setTimeout(() => {
                if (token && isAgent) return router.replace('/agent/dashboard');

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