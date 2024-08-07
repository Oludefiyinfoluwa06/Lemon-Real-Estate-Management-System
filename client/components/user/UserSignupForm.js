import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { fetchCountries } from '../../services/countryApi';

const UserSignupForm = ({ userDetails, setUserDetails }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});

    useEffect(() => {
        const getCountries = async () => {
            try {
                const countriesData = await fetchCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        getCountries();
    }, []);

    const propertyOptions = [ 'Lands', 'Duplex', 'Bungalows', 'Shop Spaces', 'Mansions' ];

    const [selectedProperties, setSelectedProperties] = useState([]);

    const togglePropertySelection = (property) => {
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(property)
                ? prevSelected.filter((item) => item !== property)
                : [...prevSelected, property]
        );

        setUserDetails({ ...userDetails, propertiesOfInterest: selectedProperties });
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        const countryDetails = countries.find(c => c.name.common === country);
        const countryCode = countryDetails.idd.root + (countryDetails.idd.suffixes ? countryDetails.idd.suffixes[0] : '');
        setUserDetails({ ...userDetails, country: countryDetails.name.common, countryCode });
    };
    
    const handleSignup = async () => {
        
    }

    return (
        <View className="mb-6">
            {currentStep === 1 && (
                <>
                    <Text className="text-white text-lg mb-2 font-rbold">Properties of Interest:</Text>
                    <View className="flex-row flex-wrap mb-4">
                        {propertyOptions.map((property) => (
                            <TouchableOpacity
                                key={property}
                                className={`p-2 m-1 rounded-lg ${selectedProperties.includes(property) ? 'bg-chartreuse' : 'bg-frenchGray-light'}`}
                                onPress={() => togglePropertySelection(property)}
                            >
                                <Text className="text-center text-white font-rregular">{property}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        placeholder="Last Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.lastName}
                        onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
                    />

                    <TextInput
                        placeholder="First Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.firstName}
                        onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
                    />

                    <TextInput
                        placeholder="Middle Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.middleName}
                        onChangeText={(text) => setUserDetails({ ...userDetails, middleName: text })}
                    />

                    <TouchableOpacity onPress={nextStep} className="bg-chartreuse p-3 rounded-lg mt-4">
                        <Text className="text-center text-frenchGray-dark font-rbold">Next</Text>
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
                        onChangeText={(text) => setUserDetails({ ...userDetails, currentAddress: text })}
                    />

                    <View className="bg-frenchGray-light mb-4 rounded-lg w-full font-regular">
                        <Picker
                            selectedValue={selectedCountry}
                            onValueChange={(itemValue) => handleCountryChange(itemValue)}
                            style={{ color: '#FFFFFF' }}
                            dropdownIconColor={'#AFAFAF'}
                            selectionColor={'#FFFFFF'}
                        >
                            <Picker.Item key='select' label='Select country' value='' />
                            {countries.map((country) => (
                                <Picker.Item key={country.cca2} label={country.name.common} value={country.name.common} />
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
                            onChangeText={(text) => setUserDetails({ ...userDetails, mobileNumber: text })}
                        />
                    </View>

                    <TouchableOpacity onPress={prevStep} className="bg-frenchGray-dark p-3 rounded-lg mt-4">
                        <Text className="text-center text-white font-rbold">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextStep} className="bg-chartreuse p-3 rounded-lg mt-4">
                        <Text className="text-center text-frenchGray-dark font-rbold">Next</Text>
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
                        onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                    />

                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.password}
                        onChangeText={(text) => setUserDetails({ ...userDetails, password: text })}
                    />

                    <TouchableOpacity onPress={prevStep} className="bg-frenchGray-dark p-3 rounded-lg mt-4">
                        <Text className="text-center text-white font-rbold">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-chartreuse p-3 rounded-lg mt-4" onPress={handleSignup}>
                        <Text className="text-center text-frenchGray-dark font-rbold">Signup</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

export default UserSignupForm;