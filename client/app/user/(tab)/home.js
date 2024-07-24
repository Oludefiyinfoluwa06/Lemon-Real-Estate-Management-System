import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
    return (
        <SafeAreaView className='bg-charcoal h-screen'>
            <Text className='text-2xl font-rbold text-white'>Home</Text>
        </SafeAreaView>
    );
}

export default Home;