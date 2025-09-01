import { useEffect } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/agent/dashboard/Header";
import PropertiesOverview from "../../../components/agent/dashboard/PropertiesOverview";
import PropertiesAnalytics from "../../../components/agent/dashboard/PropertiesAnalytics";
import MetricsPanel from "../../../components/agent/dashboard/MetricsPanel";
import { useProperty } from "../../../contexts/PropertyContext";
import { useAuth } from "../../../contexts/AuthContext";

const Dashboard = () => {
  const {
    getProperties,
    numberOfProperties,
    agentRentProperties,
    agentLeaseProperties,
    agentSaleProperties,
  } = useProperty();
  const { user } = useAuth();

  useEffect(() => {
    const getPropertiesDetails = async () => {
      await getProperties();
    };

    getPropertiesDetails();
  }, []);

  return (
    <View className="flex-1 bg-darkUmber-dark">
      <StatusBar backgroundColor="#212A2B" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-darkUmber-dark"
      >
        <SafeAreaView className="flex-1">
          <View className="px-4 py-2 space-y-6">
            <Header />

            <PropertiesOverview
              numberOfProperties={numberOfProperties}
              propertiesForRent={agentRentProperties.length}
              propertiesForLease={agentLeaseProperties.length}
              propertiesForSale={agentSaleProperties.length}
            />

            <View className="h-2" />

            <PropertiesAnalytics
              propertiesForRent={agentRentProperties.length}
              propertiesForLease={agentLeaseProperties.length}
              propertiesForSale={agentSaleProperties.length}
            />

            <MetricsPanel agentId={user?._id} />

            <View className="h-20" />
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
