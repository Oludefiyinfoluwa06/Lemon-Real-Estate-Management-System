import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { images } from '../assets/constants';
import { getToken } from '../services/getToken';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const SplashScreen = () => {
    const scale = useSharedValue(0.8);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#212A2B");

        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, {
                    duration: 1000,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }),
                withTiming(0.8, {
                    duration: 1000,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                })
            ),
            -1,
            true
        );

        let timeoutId;

        const checkIsLoggedIn = async () => {
            try {
                const token = await getToken();
                const role = await AsyncStorage.getItem('role');

                timeoutId = setTimeout(() => {
                    if (token && role) {
                        return role === 'buyer'
                            ? router.replace('/user/home')
                            : router.replace('/agent/dashboard');
                    }
                    return router.replace('/login');
                }, 2500);
            } catch (error) {
                console.error('Error checking login status:', error);
                router.replace('/login');
            }
        };

        checkIsLoggedIn();

        return () => clearTimeout(timeoutId);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-darkUmber-dark">
            <Animated.Image
                source={images.logo}
                resizeMode="contain"
                className="w-32 h-32"
                style={animatedStyle}
            />
            <StatusBar backgroundColor="#212A2B" barStyle="light-content" />
        </SafeAreaView>
    );
};

export default SplashScreen;
