import { useEffect } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const Profile = () => {
    const { getUser, user, logout } = useAuth();

    NavigationBar.setBackgroundColorAsync("#212A2B");

    useEffect(() => {
        const getUserDetails = async () => {
            await getUser();
        }

        getUserDetails();
    }, []);

    return (
        <SafeAreaView className='flex-1 bg-darkUmber-dark'>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className='relative bg-darkUmber-light h-[300px] items-center justify-center rounded-b-3xl'>
                    {user?.profilePicture ? (
                        <Image
                            source={{ uri: user.profilePicture }}
                            className='w-24 h-24 rounded-full mb-2'
                            resizeMode='cover'
                        />
                    ) : (
                        <View className='bg-white rounded-full p-[20px]'>
                            <Ionicons name='person-outline' color={'#2B3B3C'} size={70} />
                        </View>
                    )}

                    {/* <Text className='text-white text-2xl font-rbold'>{user.lastName} {user.firstName}</Text> */}
                    <Text className='text-white text-2xl font-rbold'>{user.companyName}</Text>
                    <Text className='text-white text-base font-rregular'>{user.email}</Text>

                    <TouchableOpacity
                        className='absolute top-[10px] right-[20px] bg-transparentWhite items-center justify-center w-[50px] h-[50px] rounded-full'
                        onPress={async () => await logout()}
                    >
                        <Ionicons name='log-out-outline' size={23} color={'#FFFFFF'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='absolute top-[10px] left-[20px] bg-transparentWhite items-center justify-center w-[50px] h-[50px] rounded-full'
                        onPress={() => router.back()}
                    >
                        <Ionicons name='chevron-back-outline' size={23} color={'#FFFFFF'} />
                    </TouchableOpacity>
                </View>

                <View className='p-5'>
                    <Text className='text-2xl font-rbold mb-4 text-white'>Account Info</Text>

                    <View className='flex-row items-center gap-3 mb-4'>
                        <Ionicons name='person-outline' size={23} color={'#FFFFFF'} className='w-6 h-6 mr-3' />
                        <View>
                            <Text className='text-xl text-white font-rbold'>Name</Text>
                            <Text className='text-lg text-white font-rregular'>{user.firstName} {user.lastName}</Text>
                        </View>
                    </View>

                    <View className='flex-row items-center gap-3 mb-4'>
                        <Ionicons name='call-outline' size={23} color={'#FFFFFF'} className='w-6 h-6 mr-3' />
                        <View>
                            <Text className='text-xl text-white font-rbold'>Phone</Text>
                            <Text className='text-lg text-white font-rregular'>{user.mobileNumber}</Text>
                        </View>
                    </View>

                    <View className='flex-row items-center gap-3 mb-4'>
                        <Ionicons name='mail-outline' size={23} color={'#FFFFFF'} className='w-6 h-6 mr-3' />
                        <View>
                            <Text className='text-xl text-white font-rbold'>Email</Text>
                            <Text className='text-lg text-white font-rregular'>{user.email}</Text>
                        </View>
                    </View>

                    <View className='flex-row items-center gap-3 mb-4'>
                        <Ionicons name='location-outline' size={23} color={'#FFFFFF'} className='w-6 h-6 mr-3' />
                        <View>
                            <Text className='text-xl text-white font-rbold'>Address</Text>
                            <Text className='text-lg text-white font-rregular'>{user.currentAddress}</Text>
                        </View>
                    </View>
                </View>

                <View className='px-[20px]'>
                    <Button text='Edit Profile' bg={true} onPress={() => router.push('/agent/edit-profile')}  />
                </View>
            </ScrollView>

            <StatusBar backgroundColor={'#2B3B3C'} />
        </SafeAreaView>
    );
}

export default Profile;