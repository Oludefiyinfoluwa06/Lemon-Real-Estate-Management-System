import { Stack } from 'expo-router';

const ScreenLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='properties/[id]'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='properties/add'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='properties/update/[id]'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default ScreenLayout;