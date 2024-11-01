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
        agentRentProperties,
        agentLeaseProperties,
        agentSaleProperties
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
                    propertiesForRent={agentRentProperties.length}
                    propertiesForLease={agentLeaseProperties.length}
                    propertiesForSale={agentSaleProperties.length}
                />

                <PropertiesAnalytics
                    propertiesForRent={agentRentProperties.length}
                    propertiesForLease={agentLeaseProperties.length}
                    propertiesForSale={agentSaleProperties.length}
                />

                <View className='mt-[70px]' />
            </SafeAreaView>
        </ScrollView>
    );
}

export default Dashboard;