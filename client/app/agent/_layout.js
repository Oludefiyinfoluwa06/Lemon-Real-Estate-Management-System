import { Stack } from 'expo-router';

const AgentLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='(tab)'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AgentLayout;