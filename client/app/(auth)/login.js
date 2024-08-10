import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import ErrorOrMessageModal from '../../components/common/ErrorOrMessageModal';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const { authLoading, authError, setAuthError, authMessage, setAuthMessage, login } = useAuth();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAuthError('');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [authError]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAuthMessage('');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [authMessage]);

    return (
        <SafeAreaView className='h-full flex-1 items-center justify-center bg-darkUmber-dark p-[20px]'>
            {authError && (
                <ErrorOrMessageModal
                    visible={authError !== ''}
                    modalType='error'
                    onClose={() => setAuthError('')}
                    text={authError}
                />
            )}

            {authMessage && (
                <ErrorOrMessageModal
                    visible={authMessage !== ''}
                    modalType='success'
                    onClose={() => setAuthMessage('')}
                    text={authMessage}
                />
            )}

            <View className='mx-auto w-full'>
                <Text className="text-chartreuse text-2xl font-rbold mb-2 text-center">Welcome Back</Text>
                <Text className="text-frenchGray-light mb-5 text-center font-rregular">Please log in to continue</Text>
            </View>

            <TextInput
                placeholder="Email"
                className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                placeholderTextColor="#AFAFAF"
                value={credentials.email}
                onChangeText={(text) => setCredentials({ ...credentials, email: text })}
            />
        
            <TextInput
                placeholder="Password"
                secureTextEntry
                className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                placeholderTextColor="#AFAFAF"
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            />

            <View className="flex-row items-center justify-center my-4 w-full">
                <Button
                    text={authLoading ? 'Loading...' : 'Login'}
                    bg={true}
                    onPress={async () => {
                        if (credentials.email === '' || credentials.password === '') {
                            return setAuthError('Input fields must not be empty');
                        }
                        
                        await login(credentials);
                    }}
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