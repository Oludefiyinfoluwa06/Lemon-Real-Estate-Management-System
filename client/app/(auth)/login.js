import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import ErrorOrMessageModal from '../../components/common/ErrorOrMessageModal';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

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

            <View className='relative w-full'>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                    placeholderTextColor="#AFAFAF"
                    value={credentials.password}
                    onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                />
                <TouchableOpacity
                    className='absolute top-[10px] right-[8px]'
                    onPress={() => setShowPassword(prev => !prev)}
                >
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={'#AFAFAF'} />
                </TouchableOpacity>
            </View>

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

            <TouchableOpacity className="mt-3" onPress={() => router.push('/signup')}>
                <Text className="text-frenchGray-light text-center font-rregular">Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Login;