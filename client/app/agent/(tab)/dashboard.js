import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/agent/dashboard/Header';
import PropertiesOverview from '../../../components/agent/dashboard/PropertiesOverview';
import SalesRevenueAnalytics from '../../../components/agent/dashboard/SalesRevenueAnalytics';

const Dashboard = () => {    
    return (
        <SafeAreaView className='h-full bg-darkUmber-dark p-4'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <PropertiesOverview />
                <SalesRevenueAnalytics />

                <View className='mt-[70px]' />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Dashboard;