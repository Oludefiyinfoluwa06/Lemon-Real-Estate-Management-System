import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const UserSignupForm = ({ userDetails, setUserDetails }) => {
    const [currentStep, setCurrentStep] = useState(1);

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
    
    const handleSignup = async () => {
        router.push('/user/home');
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

                    <TextInput
                        placeholder="Country"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.country}
                        onChangeText={(text) => setUserDetails({ ...userDetails, country: text })}
                    />

                    <TextInput
                        placeholder="State"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.state}
                        onChangeText={(text) => setUserDetails({ ...userDetails, state: text })}
                    />

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
                        placeholder="Identification Number"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.idNumber}
                        onChangeText={(text) => setUserDetails({ ...userDetails, idNumber: text })}
                    />

                    <TextInput
                        placeholder="Bank Verification Number (BVN)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.bvn}
                        onChangeText={(text) => setUserDetails({ ...userDetails, bvn: text })}
                    />

                    <TextInput
                        placeholder="Date of Birth (YYYY-MM-DD)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.dateOfBirth}
                        onChangeText={(text) => setUserDetails({ ...userDetails, dateOfBirth: text })}
                    />

                    <TextInput
                        placeholder="Gender"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.gender}
                        onChangeText={(text) => setUserDetails({ ...userDetails, gender: text })}
                    />

                    <TouchableOpacity onPress={prevStep} className="bg-frenchGray-dark p-3 rounded-lg mt-4">
                        <Text className="text-center text-white font-rbold">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextStep} className="bg-chartreuse p-3 rounded-lg mt-4">
                        <Text className="text-center text-frenchGray-dark font-rbold">Next</Text>
                    </TouchableOpacity>
                </>
            )}

            {currentStep === 4 && (
                <>
                    <TextInput
                        placeholder="Mobile Number (e.g. +234 801 234 5678)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={userDetails.mobileNumber}
                        onChangeText={(text) => setUserDetails({ ...userDetails, mobileNumber: text })}
                    />

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