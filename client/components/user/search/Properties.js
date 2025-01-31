import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatPrice } from "../../../services/formatPrice";
import { router } from "expo-router";
import ErrorOrMessageModal from "../../common/ErrorOrMessageModal";
import Button from "../../common/Button";
import NoProperties from "../NoProperties";

const Properties = ({
  properties,
  updateProperty,
  propertyMessage,
  setPropertyMessage,
  userId,
  setPage,
  currentPage,
  totalPages,
}) => {
  if (properties.length === 0) {
    return <NoProperties type="none" />;
  }

  return (
    <View>
      <View className="flex-row flex-wrap justify-between gap-y-[16px] mt-2">
        {properties.map((property) => (
          <View
            key={property._id}
            className="relative w-[48%] bg-frenchGray-light rounded-lg overflow-hidden"
          >
            <Image
              source={{ uri: property.images[0] }}
              resizeMode="cover"
              className="h-[150px] w-full rounded-s-md"
            />

            <TouchableOpacity
              className="absolute top-2 right-2 p-2 rounded-full bg-transparentBlack items-center justify-center"
              onPress={async () => await updateProperty(property._id)}
            >
              <Ionicons
                name={
                  property.savedBy.includes(userId) ? "heart" : "heart-outline"
                }
                color={"#BBCC13"}
                size={19}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push(`/user/properties/${property._id}`)}
            >
              <Text className="text-white font-rbold text-lg">
                {property.title}
              </Text>
              <View className="flex-row items-center justify-start flex-1 mt-1">
                <Ionicons name="location-outline" color={"#BBCC13"} size={18} />
                <Text className="font-rregular text-[14px] text-white ml-1">
                  {property.country}
                </Text>
              </View>
              <View className="flex-row items-center justify-start flex-1 mt-1">
                <Ionicons name="pricetag-outline" color={"#BBCC13"} size={18} />
                <Text className="text-sm font-rbold text-white ml-1">
                  {property.currency ? property.currency.split(" - ")[1] : ""}{" "}
                  {formatPrice(property?.price)}{" "}
                  {property.status === "Sale" ? "" : "/year"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        <ErrorOrMessageModal
          visible={propertyMessage !== ""}
          modalType="message"
          onClose={() => setPropertyMessage("")}
          text={propertyMessage}
        />
      </View>

      <View className="flex-row items-center justify-between mt-4">
        <Button
          text="Previous"
          bg={currentPage > 1}
          onPress={() => {
            setPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        />

        <Text className="text-sm font-rregular mx-3 text-white">
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          text="Next"
          bg={currentPage < totalPages}
          onPress={() => {
            setPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
};

export default Properties;
