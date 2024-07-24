import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [loaded] = useFonts({
        "Raleway-Black": require("../assets/fonts/Raleway-Black.ttf"),
        "Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
        "Raleway-ExtraBold": require("../assets/fonts/Raleway-ExtraBold.ttf"),
        "Raleway-ExtraLight": require("../assets/fonts/Raleway-ExtraLight.ttf"),
        "Raleway-Light": require("../assets/fonts/Raleway-Light.ttf"),
        "Raleway-Medium": require("../assets/fonts/Raleway-Medium.ttf"),
        "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf"),
        "Raleway-SemiBold": require("../assets/fonts/Raleway-SemiBold.ttf"),
        "Raleway-Thin": require("../assets/fonts/Raleway-Thin.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default RootLayout;