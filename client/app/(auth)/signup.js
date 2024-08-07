import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/common/Button';
import AgentSignupForm from '../../components/agent/AgentSignupForm';
import UserSignupForm from '../../components/user/UserSignupForm';

const Signup = () => {
    const [selected, setSelected] = useState({
        agent: false,
        user: true,
    })
    const [agentDetails, setAgentDetails] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        currentAddress: '',
        country: '',
        countryCode: '',
        mobileNumber: '',
        email: '',
        password: ''
    });
    
    const [userDetails, setUserDetails] = useState({
        propertiesOfInterest: [],
        lastName: '',
        firstName: '',
        middleName: '',
        currentAddress: '',
        country: '',
        countryCode: '',
        mobileNumber: '',
        email: '',
        password: ''
    });

    const toggleSelection = (type) => {
        setSelected({
            agent: type === 'agent',
            user: type === 'user'
        });
    };

    return (
        <SafeAreaView className='h-full flex-1 items-center justify-center bg-darkUmber-dark'>
            <ScrollView className='w-full p-[20px]'>
                <View className='mx-auto w-full'>
                    <Text className="text-chartreuse text-2xl font-rbold mb-2 text-center">Create Account</Text>
                    <Text className="text-frenchGray-light mb-5 text-center font-rregular">Choose your signup method</Text>
                </View>

                <View className="flex-row items-center justify-center mb-6 w-full">
                    <Button
                        type='agent'
                        text='Sign Up as Proprietor'
                        bg={selected.agent}
                        onPress={() => toggleSelection('agent')}
                    />

                    <Button
                        type='user'
                        text='Sign Up as User'
                        bg={selected.user}
                        onPress={() => toggleSelection('user')} />
                </View>

                {selected.agent && <AgentSignupForm agentDetails={agentDetails} setAgentDetails={setAgentDetails} />}

                {selected.user && <UserSignupForm userDetails={userDetails} setUserDetails={setUserDetails} />}

                

                <TouchableOpacity className="mt-3" onPress={() => router.push('/login')}>
                    <Text className="text-frenchGray-light text-center font-rregular">Already have an account? Log In</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Signup;
