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

                return router.replace('/user/home');
            }, 3000);
        }

        checkIsLoggedIn();
    }, []);
    
    return (
        <SafeAreaView className='flex items-center justify-center bg-charcoal h-screen'>
            <Image 
                source={images.logo}
                resizeMode='contain'
                className='w-[100px]'
            />

            <StatusBar backgroundColor={'#36454F'} />
        </SafeAreaView>
    );
}

export default SplashScreen;