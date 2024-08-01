import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/user/Header';
import Categories from '../../../components/user/Categories';
import NearbyProperties from '../../../components/user/NearbyProperties';
import Recommended from '../../../components/user/Recommended';

const Home = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <Categories />
                <NearbyProperties />
                <Recommended />
                <View className='mt-[70px]' />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Home;