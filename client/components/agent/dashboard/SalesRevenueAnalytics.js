import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const SalesRevenueAnalytics = () => {
    const [propertyData, setPropertyData] = useState({
        totalForSale: 150,
        totalForRent: 85,
    });

    const chartData = [
        {
            name: 'For Sale',
            population: propertyData.totalForSale,
            color: '#BBCC13',
            legendFontColor: '#FFFFFF',
            legendFontSize: 15,
        },
        {
            name: 'For Rent',
            population: propertyData.totalForRent,
            color: '#212A2B',
            legendFontColor: '#FFFFFF',
            legendFontSize: 15,
        },
    ];

    return (
        <View className="bg-frenchGray-dark rounded-xl p-3">
            <Text className="font-rbold text-white text-xl">Total Properties</Text>
            <PieChart
                data={chartData}
                width={300}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForLabels: {
                        fontFamily: 'Raleway-Bold'
                    }
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                absolute
                hasLegend={true}
            />
        </View>
    );
};

export default SalesRevenueAnalytics;
