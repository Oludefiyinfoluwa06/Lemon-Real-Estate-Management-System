import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PropertiesOverviewCard = ({ icon, title, subTitle }) => {
    return (
        <View className="bg-frenchGray-dark rounded-xl p-4 mb-4 flex-row items-center">
            <Ionicons name={icon} size={30} color="#FFFFFF" />
            <View className="ml-4">
                <Text className="text-lg font-rregular text-white">{title}</Text>
                <Text className="text-4xl font-rbold text-white">{subTitle}</Text>
            </View>
        </View>
    )
}

const PropertiesOverview = () => {
    return (
        <View>
            <PropertiesOverviewCard icon='business-outline' title='Total properties' subTitle='0' />
            <PropertiesOverviewCard icon='home-outline' title='Properties for Rent' subTitle='0' />
            <PropertiesOverviewCard icon='pricetag-outline' title='Properties for Sale' subTitle='0' />
            {/* <PropertiesOverviewCard icon='cash-outline' title='Total Revenue' subTitle='0' /> */}
        </View>
    );
}

export default PropertiesOverview;