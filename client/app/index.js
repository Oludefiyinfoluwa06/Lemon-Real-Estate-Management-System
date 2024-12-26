import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { images } from '../assets/constants';
import { getToken } from '../services/getToken';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const SplashScreen = () => {
    NavigationBar.setBackgroundColorAsync("#212A2B");

    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withTiming(1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        });

        opacity.value = withTiming(1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        });

        const checkIsLoggedIn = async () => {
            const token = await getToken();
            const role = await AsyncStorage.getItem('role');

            setTimeout(() => {
                if (token && role) {
                    return role === 'buyer' ? router.replace('/user/home') : router.replace('/agent/dashboard');
                }

                return router.replace('/login');
            }, 3000);
        };

        checkIsLoggedIn();
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <SafeAreaView className='flex items-center justify-center h-full bg-darkUmber-dark'>
            <Animated.Image
                source={images.logo}
                resizeMode='contain'
                style={[{ width: 100 }, animatedStyle]}
            />
            <StatusBar backgroundColor={'#212A2B'} />
        </SafeAreaView>
    );
}

export default SplashScreen;
