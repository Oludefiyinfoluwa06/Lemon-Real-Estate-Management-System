import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../../config";
import { getToken } from "../../../services/getToken";

const MetricsPanel = ({ agentId }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [agentId]);

  const fetchMetrics = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${config.API_BASE_URL}/api/property/metrics/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMetrics(response.data.properties || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="p-4">
        <Text className="text-white font-rregular">Loading metrics...</Text>
      </View>
    );
  }

  return (
    <View className="bg-darkUmber-dark p-4 rounded-lg">
      <Text className="text-chartreuse font-rbold text-xl mb-4">
        Property Metrics
      </Text>

      <ScrollView>
        {metrics.map((property) => (
          <View
            key={property._id}
            className="bg-frenchGray-light p-3 rounded-lg mb-3"
          >
            <Text className="text-white font-rbold mb-2">{property.title}</Text>

            <View className="flex-row justify-start gap-3 items-center">
              <View className="flex-row items-center">
                <Ionicons name="heart" size={20} color="#BBCC13" />
                <Text className="text-white font-rregular ml-2">
                  {property.savedBy.length || 0} likes
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="eye" size={20} color="#BBCC13" />
                <Text className="text-white font-rregular ml-2">
                  {property.views || 0} views
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="videocam" size={20} color="#BBCC13" />
                <Text className="text-white font-rregular ml-2">
                  {property.videoViews || 0} video views
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        className="mt-4 bg-chartreuse p-3 rounded-lg items-center"
        onPress={fetchMetrics}
      >
        <Text className="text-darkUmber-dark font-rbold">Refresh Metrics</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MetricsPanel;
