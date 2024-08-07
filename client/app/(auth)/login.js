import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/common/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView className='h-full flex-1 items-center justify-center bg-darkUmber-dark p-[20px]'>
            <View className='mx-auto w-full'>
                <Text className="text-chartreuse text-2xl font-rbold mb-2 text-center">Welcome Back</Text>
                <Text className="text-frenchGray-light mb-5 text-center font-rregular">Please log in to continue</Text>
            </View>

            <TextInput
                placeholder="Email"
                className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                placeholderTextColor="#AFAFAF"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
        
            <TextInput
                placeholder="Password"
                secureTextEntry
                className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                placeholderTextColor="#AFAFAF"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <View className="flex-row items-center justify-center my-4 w-full">
                <Button
                    type='agent'
                    text='Proprietor Login'
                    bg={true}
                    onPress={() => { }}
                />
                
                <Button
                    type='user'
                    text='User Login'
                    bg={false}
                    onPress={() => { }}
                />
            </View>

            <TouchableOpacity className="mt-4">
                <Text className="text-frenchGray-light text-center font-rregular">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-3" onPress={() => router.push('/signup')}>
                <Text className="text-frenchGray-light text-center font-rregular">Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Login;