import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chats = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <Text className='text-2xl font-rbold text-white'>Chats</Text>
        </SafeAreaView>
    );
}

export default Chats;