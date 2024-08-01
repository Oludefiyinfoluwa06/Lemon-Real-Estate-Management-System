import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <Text className='text-white font-rbold text-3xl mt-4'>Profile</Text>
        </SafeAreaView>
    );
}

export default Profile;