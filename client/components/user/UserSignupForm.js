import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { fetchCountries } from "../../services/countryApi";
import { useAuth } from "../../contexts/AuthContext";

const UserSignupForm = ({ userDetails, setUserDetails }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [selectedProperties, setSelectedProperties] = useState([]);

  const { authLoading, setAuthError, register } = useAuth();

  useEffect(() => {
    const getCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        throw error;
      }
    };

    getCountries();
  }, []);

  const propertyOptions = [
    "Land",
    "Houses",
    "Shop Spaces",
    "Office Buildings",
    "Industrial Buildings",
  ];

  const togglePropertySelection = async (property) => {
    setSelectedProperties((prevSelected) => {
      if (prevSelected) {
        const updatedProperties = prevSelected.includes(property)
          ? prevSelected.filter((item) => item !== property)
          : [...prevSelected, property];

        setUserDetails({
          ...userDetails,
          propertiesOfInterest: updatedProperties,
        });

        return updatedProperties;
      }
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (email.match(emailRegex)) {
      return true;
    } else {
      return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (selectedProperties.length < 1) {
        return setAuthError("Choose at least, one property category");
      }

      if (userDetails.lastName === "" || userDetails.firstName === "") {
        return setAuthError("Input fields must not be empty");
      }

      setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    } else {
      if (
        userDetails.currentAddress === "" ||
        userDetails.country === "" ||
        userDetails.mobileNumber === ""
      ) {
        return setAuthError("Input fields must not be empty");
      }

      setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    const countryDetails = countries.find((c) => c.name.common === country);
    const countryCode = countryDetails?.idd?.root
      ? countryDetails.idd.root +
        (countryDetails.idd.suffixes ? countryDetails.idd.suffixes[0] : "")
      : "";

    setUserDetails({
      ...userDetails,
      country: countryDetails?.name.common,
      countryCode: countryCode || "",
    });
  };

  const handleSignup = async () => {
    if (userDetails.email === "" || userDetails.password === "") {
      return setAuthError("Input fields must not be empty");
    }

    if (!validateEmail(userDetails.email)) {
      return setAuthError("Enter a valid email");
    }

    if (userDetails.password.length < 8) {
      return setAuthError(
        "Password length must be equal to or greater than 8 characters",
      );
    }

    const fullMobileNumber = `${userDetails.countryCode}${userDetails.mobileNumber}`;

    const updatedUserDetails = {
      ...userDetails,
      mobileNumber: fullMobileNumber,
    };

    await register(updatedUserDetails);
  };

  return (
    <View className="mb-6">
      {currentStep === 1 && (
        <>
          <Text className="text-white text-lg mb-2 font-rbold">
            Properties of Interest:
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {propertyOptions.map((property) => (
              <TouchableOpacity
                key={property}
                className={`p-2 m-1 rounded-lg ${selectedProperties.includes(property) ? "bg-chartreuse" : "bg-frenchGray-light"}`}
                onPress={() => togglePropertySelection(property)}
              >
                <Text className="text-center text-white font-rregular">
                  {property}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Last Name"
            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
            placeholderTextColor="#AFAFAF"
            value={userDetails.lastName}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, lastName: text })
            }
          />

          <TextInput
            placeholder="First Name"
            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
            placeholderTextColor="#AFAFAF"
            value={userDetails.firstName}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, firstName: text })
            }
          />

          <TextInput
            placeholder="Middle Name"
            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
            placeholderTextColor="#AFAFAF"
            value={userDetails.middleName}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, middleName: text })
            }
          />

          <TouchableOpacity
            onPress={nextStep}
            className="bg-chartreuse p-3 rounded-lg mt-4"
          >
            <Text className="text-center text-frenchGray-dark font-rbold">
              Next
            </Text>
          </TouchableOpacity>
        </>
      )}

      {currentStep === 2 && (
        <>
          <TextInput
            placeholder="Current Address"
            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
            placeholderTextColor="#AFAFAF"
            value={userDetails.currentAddress}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, currentAddress: text })
            }
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

          <View className="flex-row items-center mb-4">
            <View className="bg-frenchGray-light text-white p-2 py-[14px] rounded-lg">
              <Text className="text-white">{`${userDetails.countryCode}`}</Text>
            </View>
            <TextInput
              placeholder="Mobile Number"
              className="bg-frenchGray-light text-white p-2 ml-2 rounded-lg flex-1 font-regular"
              placeholderTextColor="#AFAFAF"
              value={userDetails.mobileNumber}
              onChangeText={(text) =>
                setUserDetails({ ...userDetails, mobileNumber: text })
              }
            />
          </View>

          <TouchableOpacity
            onPress={prevStep}
            className="bg-frenchGray-dark p-3 rounded-lg mt-4"
          >
            <Text className="text-center text-white font-rbold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextStep}
            className="bg-chartreuse p-3 rounded-lg mt-4"
          >
            <Text className="text-center text-frenchGray-dark font-rbold">
              Next
            </Text>
          </TouchableOpacity>
        </>
      )}

      {currentStep === 3 && (
        <>
          <TextInput
            placeholder="Email"
            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
            placeholderTextColor="#AFAFAF"
            value={userDetails.email}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, email: text })
            }
          />

          <View className="relative w-full">
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
              placeholderTextColor="#AFAFAF"
              value={userDetails.password}
              onChangeText={(text) =>
                setUserDetails({ ...userDetails, password: text })
              }
            />
            <TouchableOpacity
              className="absolute top-[10px] right-[8px]"
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={"#AFAFAF"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={prevStep}
            className="bg-frenchGray-dark p-3 rounded-lg mt-4"
          >
            <Text className="text-center text-white font-rbold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-chartreuse p-3 rounded-lg mt-4"
            onPress={handleSignup}
          >
            <Text className="text-center text-frenchGray-dark font-rbold">
              {authLoading ? "Loading..." : "Signup"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default UserSignupForm;
