import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

const Header = () => {
    return (
        <View className='p-4'>
            <View className='flex-row items-center justify-between'>
                <TouchableOpacity
                    className='bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full'
                    onPress={() => router.push('/user/profile')}
                >
                    <Ionicons name='person-outline' size={23} color={'#FFFFFF'} />
                </TouchableOpacity>
                
                <View className='flex-row items-center justify-end'>
                    <TouchableOpacity
                        className='bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full mr-2'
                        onPress={() => router.push('/user/search')}
                    >
                        <Ionicons name='search-outline' size={23} color={'#FFFFFF'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full'
                        onPress={() => router.push('/user/notifications')}
                    >
                        <Ionicons name='notifications-outline' size={23} color={'#FFFFFF'} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text className='text-white font-rbold text-3xl mt-4'>Explore &</Text>
            <Text className='text-white font-rbold text-3xl'>Discover all kinds</Text>
            <Text className='text-white font-rbold text-3xl'>of properties</Text>
        </View>
    );
}

export default Header;