import { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/agent/dashboard/Header';
import PropertiesOverview from '../../../components/agent/dashboard/PropertiesOverview';
import PropertiesAnalytics from '../../../components/agent/dashboard/PropertiesAnalytics';
import { useProperty } from '../../../contexts/PropertyContext';

const Dashboard = () => {
    const {
        getProperties,
        numberOfProperties,
        propertiesForRent,
        propertiesForLease,
        propertiesForSale
    } = useProperty();

    useEffect(() => {
        const getPropertiesDetails = async () => {
            await getProperties();
        }

        getPropertiesDetails();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView className='h-full bg-darkUmber-dark p-4'>
                <Header />

                <PropertiesOverview
                    numberOfProperties={numberOfProperties}
                    propertiesForRent={propertiesForRent}
                    propertiesForLease={propertiesForLease}
                    propertiesForSale={propertiesForSale}
                />

                <PropertiesAnalytics
                    propertiesForRent={propertiesForRent}
                    propertiesForLease={propertiesForLease}
                    propertiesForSale={propertiesForSale}
                />

                <View className='mt-[70px]' />
            </SafeAreaView>
        </ScrollView>
    );
}

export default Dashboard;