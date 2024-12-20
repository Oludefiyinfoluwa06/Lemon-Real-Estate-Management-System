import { Stack } from 'expo-router';

const AgentLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='(tab)'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='(screens)'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='profile'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='subscription'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='pay'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AgentLayout;