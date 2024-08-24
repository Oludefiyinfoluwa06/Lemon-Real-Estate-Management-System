import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/agent/dashboard/Header';
import PropertiesOverview from '../../../components/agent/dashboard/PropertiesOverview';
import SalesRevenueAnalytics from '../../../components/agent/dashboard/SalesRevenueAnalytics';

const Dashboard = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView className='h-full bg-darkUmber-dark p-4'>
                <Header />
                <PropertiesOverview />
                <SalesRevenueAnalytics />

                <View className='mt-[70px]' />
            </SafeAreaView>
        </ScrollView>
    );
}

export default Dashboard;