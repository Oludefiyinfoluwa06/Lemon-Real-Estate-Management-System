import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { config, DOCUMENT_TYPE_DESCRIPTIONS } from "../../config";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCountries } from "../../services/countryApi";
import axios from "axios";
import { getToken } from "../../services/getToken";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CustomButton = ({
  onPress,
  text,
  variant = "primary",
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`
      w-full py-4 px-6 rounded-xl my-2
      ${variant === "primary" ? "bg-chartreuse" : "bg-darkUmber"}
      ${disabled ? "opacity-50" : "active:opacity-80"}
    `}
  >
    <Text
      className={`
        text-center font-rsemibold text-lg
        ${variant === "primary" ? "text-darkUmber" : "text-chartreuse"}
      `}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

const VerifyId = () => {
  const [idImage, setIdImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [countryCode, setCountryCode] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [idDocument, setIdDocument] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, getUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const getCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.log("Error fetching countries:", error);
      }
    };

    getCountries();
  }, []);

  const getAllDocumentTypes = (descriptions) => {
    const documentTypes = [];
    Object.entries(descriptions).forEach(([key, value]) => {
      if (typeof value === "string") {
        documentTypes.push({ code: key, label: value });
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          documentTypes.push({ code: subKey, label: subValue });
        });
      }
    });
    return documentTypes;
  };

  useEffect(() => {
    const getDocumentTypes = () => {
      const allDocuments = getAllDocumentTypes(DOCUMENT_TYPE_DESCRIPTIONS);
      setDocumentTypes(allDocuments);
    };

    getDocumentTypes();
  }, []);

  const handleIdDocumentChange = (type) => {
    setIdDocument(type);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    const countryDetails = countries.find((c) => c.name.common === country);

    setCountryCode(countryDetails?.cca2);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!idImage) {
      setLoading(false);
      Alert.alert("Error", "Please upload an ID document.");
      return;
    }

    const formData = new FormData();
    formData.append("idImage", {
      uri: idImage,
      name: "id-document.jpg",
      type: "image/jpeg",
    });

    formData.append("countryCode", countryCode);
    formData.append("documentType", idDocument);

    try {
      const token = await getToken();

      const response = await axios.post(
        `${config.API_BASE_URL}/api/user/id/verify`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        Alert.alert(
          "ID Verification",
          "Your ID has been verified successfully",
        );
        getUser();
      } else {
        Alert.alert(
          "Extraction Failed",
          result.error || "Unable to process ID.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response.data.message ||
          "An error occurred while verifying the ID.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-darkUmber-dark p-6">
      <View className="flex-row items-center justify-start gap-3 mb-4">
        <TouchableOpacity
          className="bg-transparentWhite items-center justify-center w-[50px] h-[50px] rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={23} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text className="text-white font-rbold text-2xl">ID Verification</Text>
      </View>

      {user.isIdVerified ? (
        <View className="flex-1 flex-col items-center justify-center">
          <Ionicons
            name="checkmark-circle-outline"
            color={"#BBCC13"}
            size={70}
          />
          <Text className="text-white font-rregular text-xl">
            Your ID has been verified successfully
          </Text>
        </View>
      ) : (
        <View>
          <View className="mb-8 rounded-xl overflow-hidden bg-darkUmber h-64">
            {idImage ? (
              <Image
                source={{ uri: idImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center p-6">
                <Text className="text-frenchGray-light text-lg mb-2 text-center">
                  No image selected
                </Text>
                <Text className="text-frenchGray-light text-sm opacity-70 text-center">
                  Tap the button below to choose an ID document
                </Text>
              </View>
            )}
          </View>

          <View>
            <CustomButton
              text="Select ID Document"
              onPress={pickDocument}
              variant="primary"
            />

            <View className="bg-frenchGray-light mb-4 rounded-lg w-full font-regular">
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(itemValue) => handleCountryChange(itemValue)}
                style={{ color: "#FFFFFF" }}
                dropdownIconColor={"#AFAFAF"}
                selectionColor={"#FFFFFF"}
              >
                <Picker.Item key="select" label="Select country" value="" />
                {countries.map((country) => (
                  <Picker.Item
                    key={country?.name.common}
                    label={country?.name.common}
                    value={country?.name.common}
                  />
                ))}
              </Picker>
            </View>

            <View className="bg-frenchGray-light mb-4 rounded-lg w-full font-regular">
              <Picker
                selectedValue={idDocument}
                onValueChange={(itemValue) => handleIdDocumentChange(itemValue)}
                style={{ color: "#FFFFFF" }}
                dropdownIconColor={"#AFAFAF"}
                selectionColor={"#FFFFFF"}
              >
                <Picker.Item key="select" label="Select ID Type" value="" />
                {documentTypes.map((doc) => (
                  <Picker.Item
                    key={doc.code}
                    label={doc.label}
                    value={doc.code}
                  />
                ))}
              </Picker>
            </View>

            <CustomButton
              text={loading ? "Loading" : "Submit for Verification"}
              onPress={handleSubmit}
              variant="primary"
              disabled={!idImage || loading}
            />
          </View>
        </View>
      )}

      <StatusBar backgroundColor={"#212A2B"} />
    </SafeAreaView>
  );
};

export default VerifyId;
