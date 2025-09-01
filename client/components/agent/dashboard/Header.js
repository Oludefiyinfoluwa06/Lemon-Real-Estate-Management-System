import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../../contexts/AuthContext";
import RatingsSummary from "../../common/RatingsSummary";

const Header = () => {
  const { getUser, user } = useAuth();

  useEffect(() => {
    const getUserDetails = async () => {
      await getUser();
    };

    getUserDetails();
  }, []);

  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center justify-start">
        <TouchableOpacity
          className="bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full mr-3"
          onPress={() => router.push("/agent/profile")}
        >
          {!user.profilePicture ? (
            <Ionicons name="person-outline" size={23} color={"#FFFFFF"} />
          ) : (
            <Image
              source={{ uri: user.profilePicture }}
              resizeMode="cover"
              className="rounded-full w-full h-full"
            />
          )}
        </TouchableOpacity>

        <View>
          <Text className="text-white font-rbold text-xl">
            {user.firstName
              ? `Welcome, ${user.firstName}`
              : `${user.companyName}`}
          </Text>
          {user.rating > 0 && (
            <View className="mt-1">
              <RatingsSummary
                avgRating={user.rating}
                ratingsCount={user.ratingsCount || 0}
                size="sm"
              />
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full"
        onPress={() => router.push("/agent/properties")}
      >
        <Ionicons name="key-outline" size={23} color={"#FFFFFF"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
