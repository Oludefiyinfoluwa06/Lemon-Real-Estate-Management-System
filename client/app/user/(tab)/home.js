import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/user/Header';
import Categories from '../../../components/user/Categories';
import NewListings from '../../../components/user/NewListings';
import Status from '../../../components/user/Status';
import { useProperty } from '../../../contexts/PropertyContext';
import NoProperties from '../../../components/user/NoProperties';

const Home = () => {
    const { getProperties, properties } = useProperty();

    useEffect(() => {
        const fetchProperties = async () => {
            await getProperties();
        };

        fetchProperties();
    }, []);

    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                {properties.length === 0 ? (
                    <NoProperties type='none' />
                ) : (
                    <>
                        <Categories />
                        <Status />
                        <NewListings />
                    </>
                )}
                <View className='mt-[70px]' />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Home;