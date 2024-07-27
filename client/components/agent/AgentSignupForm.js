import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const AgentSignupForm = ({ agentDetails, setAgentDetails }) => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleSignup = async () => {

    }

    return (
        <View className="mb-6">
            {currentStep === 1 && (
                <>
                    <TextInput
                        placeholder="Last Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.lastName}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, lastName: text })}
                    />

                    <TextInput
                        placeholder="First Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.firstName}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, firstName: text })}
                    />

                    <TextInput
                        placeholder="Middle Name"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.middleName}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, middleName: text })}
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
                        value={agentDetails.currentAddress}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, currentAddress: text })}
                    />

                    <TextInput
                        placeholder="Country"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.country}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, country: text })}
                    />

                    <TextInput
                        placeholder="State"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.state}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, state: text })}
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
                        value={agentDetails.idNumber}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, idNumber: text })}
                    />

                    <TextInput
                        placeholder="Bank Verification Number (BVN)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.bvn}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, bvn: text })}
                    />

                    <TextInput
                        placeholder="Date of Birth (YYYY-MM-DD)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.dateOfBirth}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, dateOfBirth: text })}
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
                        placeholder="Gender"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.gender}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, gender: text })}
                    />

                    <TextInput
                        placeholder="Mobile Number (e.g. +234 801 234 5678)"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.mobileNumber}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, mobileNumber: text })}
                    />

                    <TextInput
                        placeholder="Email"
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.email}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, email: text })}
                    />

                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        placeholderTextColor="#AFAFAF"
                        value={agentDetails.password}
                        onChangeText={(text) => setAgentDetails({ ...agentDetails, password: text })}
                    />

                    <TouchableOpacity onPress={prevStep} className="bg-frenchGray-dark p-3 rounded-lg mt-4">
                        <Text className="text-center text-white font-rbold">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-chartreuse p-3 rounded-lg mt-4" onPress={handleSignup}>
                        <Text className="text-center text-white">Signup</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

export default AgentSignupForm;