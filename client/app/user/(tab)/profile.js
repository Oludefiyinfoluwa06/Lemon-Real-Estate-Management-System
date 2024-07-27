import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <Text className='text-2xl font-rbold text-white'>Profile</Text>
        </SafeAreaView>
    );
}

export default Profile;