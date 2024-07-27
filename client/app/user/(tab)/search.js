import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Search = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <Text className='text-2xl font-rbold text-white'>Search</Text>
        </SafeAreaView>
    );
}

export default Search;