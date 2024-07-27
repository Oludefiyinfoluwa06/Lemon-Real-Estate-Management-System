import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/user/Header';
import Categories from '../../../components/user/Categories';

const Home = () => {
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <ScrollView>
                <Header />
                <Categories />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Home;