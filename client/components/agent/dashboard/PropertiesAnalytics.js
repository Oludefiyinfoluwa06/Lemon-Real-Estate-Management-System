import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";

const PropertiesAnalytics = ({
  propertiesForRent,
  propertiesForLease,
  propertiesForSale,
}) => {
  const propertyData = {
    totalForSale: propertiesForSale,
    totalForRent: propertiesForRent,
    totalForLease: propertiesForLease,
  };

  const totalProperties =
    propertyData.totalForSale +
    propertyData.totalForRent +
    propertyData.totalForLease;

  const chartData = [
    {
      name: "For Sale",
      population: propertyData.totalForSale,
      color: "#BBCC13",
      legendFontColor: "#FFFFFF",
      legendFontSize: 15,
    },
    {
      name: "For Rent",
      population: propertyData.totalForRent,
      color: "#212A2B",
      legendFontColor: "#FFFFFF",
      legendFontSize: 15,
    },
    {
      name: "For Lease",
      population: propertyData.totalForLease,
      color: "#616A60",
      legendFontColor: "#FFFFFF",
      legendFontSize: 15,
    },
  ];

  return (
    <View className="bg-frenchGray-dark rounded-xl p-3">
      <Text className="font-rbold text-white text-xl mb-3">Analytics</Text>
      {totalProperties > 0 ? (
        <PieChart
          data={chartData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForLabels: {
              fontFamily: "Raleway-Bold",
            },
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
          hasLegend={true}
        />
      ) : (
        <Text className="font-rbold text-white text-left">
          No properties available for sale, rent, or lease.
        </Text>
      )}
    </View>
  );
};

export default PropertiesAnalytics;
