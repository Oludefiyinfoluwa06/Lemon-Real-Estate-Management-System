import { Stack } from 'expo-router';

const AgentLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='(drawer)'
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default AgentLayout;