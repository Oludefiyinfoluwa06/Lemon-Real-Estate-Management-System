import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
    return (
        <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center justify-start'>
                <TouchableOpacity
                    className='bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full mr-3'
                    onPress={() => router.push('/agent/profile')}
                >
                    <Ionicons name='person-outline' size={23} color={'#FFFFFF'} />
                </TouchableOpacity>

                <Text className='text-white font-rbold text-xl'>Welcome, Agent</Text>
            </View>

            <TouchableOpacity
                className='bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full'
                onPress={() => router.push('/agent/notifications')}
            >
                <Ionicons name='notifications-outline' size={23} color={'#FFFFFF'} />
            </TouchableOpacity>
        </View>
    );
}

export default Header;