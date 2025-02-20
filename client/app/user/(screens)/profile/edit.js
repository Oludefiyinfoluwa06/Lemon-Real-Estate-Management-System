import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";
import { useAuth } from "../../../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../../components/common/Button";
import ErrorOrMessageModal from "../../../../components/common/ErrorOrMessageModal";

const EditProfile = () => {
  const {
    authLoading,
    authMessage,
    setAuthMessage,
    authError,
    setAuthError,
    getUser,
    user,
    setUser,
    updateProfile,
  } = useAuth();

  useEffect(() => {
    const getUserDetails = async () => {
      await getUser();
    };

    getUserDetails();
  }, []);

  const handleUploadProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const data = new FormData();
        data.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "upload.jpg",
        });
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: data,
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const jsonResponse = await response.json();

        if (jsonResponse.secure_url) {
          setUser({ ...user, profilePicture: jsonResponse.secure_url });
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleEditProfile = async () => {
    await updateProfile(user);
  };

  return (
    <SafeAreaView className="flex-1 bg-darkUmber-dark">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="p-4"
      >
        {authError && (
          <ErrorOrMessageModal
            visible={authError !== ""}
            modalType="error"
            onClose={() => setAuthError("")}
            text={authError}
          />
        )}

        {authMessage && (
          <ErrorOrMessageModal
            visible={authMessage !== ""}
            modalType="success"
            onClose={() => setAuthMessage("")}
            text={authMessage}
          />
        )}

        <View className="flex-row items-center justify-start gap-3">
          <TouchableOpacity
            className="bg-frenchGray-dark items-center justify-center w-[50px] h-[50px] rounded-full"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back-outline" size={23} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white font-rbold text-2xl">My Account</Text>
        </View>

        <View className="mt-4">
          <View className="items-center justify-center my-4">
            {user?.profilePicture && user?.profilePicture !== "" ? (
              <TouchableOpacity
                className="relative w-24 h-24"
                onPress={handleUploadProfileImage}
              >
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-full h-full rounded-full mb-2"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 right-0">
                  <Ionicons name="camera-outline" size={20} color={"#BBCC13"} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="relative"
                onPress={handleUploadProfileImage}
              >
                <View className="bg-white rounded-full p-[20px]">
                  <Ionicons name="person-outline" color={"#2B3B3C"} size={70} />
                </View>
                <View className="absolute bottom-0 right-0">
                  <Ionicons name="camera-outline" size={20} color={"#BBCC13"} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View className="relative w-full">
            <TextInput
              placeholder="First Name"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.firstName}
              onChangeText={(text) => setUser({ ...user, firstName: text })}
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="person-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>
          <View className="relative w-full">
            <TextInput
              placeholder="Last Name"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.lastName}
              onChangeText={(text) => setUser({ ...user, lastName: text })}
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="person-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>

          <View className="relative w-full">
            <TextInput
              placeholder="Current Address"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.currentAddress}
              onChangeText={(text) =>
                setUser({ ...user, currentAddress: text })
              }
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="location-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>
          <View className="relative w-full">
            <TextInput
              placeholder="Country"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.country}
              onChangeText={(text) => setUser({ ...user, country: text })}
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="globe-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>
          <View className="relative w-full">
            <TextInput
              placeholder="Mobile Number"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.mobileNumber}
              onChangeText={(text) => setUser({ ...user, mobileNumber: text })}
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="call-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>
          <View className="relative w-full">
            <TextInput
              placeholder="Email Address"
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular pl-[35px]"
              placeholderTextColor="#AFAFAF"
              value={user?.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
            />
            <TouchableOpacity className="absolute top-[10px] left-[8px]">
              <Ionicons name="mail-outline" size={20} color={"#AFAFAF"} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          text={authLoading ? "Loading..." : "Save Changes"}
          bg={true}
          onPress={handleEditProfile}
          disabled={authLoading}
        />

        <StatusBar backgroundColor={"#212A2B"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
