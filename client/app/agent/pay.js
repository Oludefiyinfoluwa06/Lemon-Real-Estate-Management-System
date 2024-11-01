import { useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getCountryCurrencyData } from '../../services/currencyConverter';
import { getToken } from '../../services/getToken';
import { config } from '../../config';
import { FLUTTERWAVE_SECRET_KEY } from '@env';
import { getExpirationDate } from '../../services/getExpirationDate';

const Payment = () => {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState('');

    const params = useLocalSearchParams();

    const convertPriceToNumber = (formattedPrice) => {
        return Number(formattedPrice.replace(/[^0-9.]/g, ''));
    };

    const PAYMENT_ENDPOINT = `${config.API_BASE_URL}/api/payment/initialize`;

    useEffect(() => {
        const setupPayment = async () => {
            if (!user?.country || !user?.email) {
                setError('User details not available');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const countryData = await getCountryCurrencyData(user.country);

                if (!countryData) {
                    throw new Error('Unable to get currency data for your country');
                }

                const tx_ref = `PRE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

                const paymentData = {
                    tx_ref,
                    amount: convertPriceToNumber(params.amount),
                    currency: countryData.code,
                    customer: {
                        email: user.email,
                        name: user.companyName || 'Customer',
                        phonenumber: user.mobileNumber || '',
                    },
                    customizations: {
                        title: 'Premium Subscription',
                        description: '6 Months Premium Access',
                    }
                };

                setPaymentDetails(paymentData);

            } catch (err) {
                console.error('Error setting up payment:', err);
                setError('Failed to setup payment. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        setupPayment();
    }, [user]);

    const initiatePayment = async () => {
        if (!paymentDetails) return;
        const token = await getToken();

        try {
            setIsLoading(true);

            const response = await fetch(PAYMENT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentDetails),
            });

            const data = await response.json();

            if (data.status === 'success' && data.data.link) {
                await Linking.openURL(data.data.link);

                await startVerificationPolling(paymentDetails.tx_ref);
            } else {
                throw new Error('Failed to initialize payment');
            }
        } catch (err) {
            console.error('Payment initialization error:', err);
            Alert.alert(
                'Payment Error',
                'Unable to start payment process. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const startVerificationPolling = async (txRef) => {
        let attempts = 0;
        const maxAttempts = 10;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    }
                });

                const verificationData = await response.json();

                if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
                    await updateProfile({ hasPaid: true, durationLeft: getExpirationDate() });
                    clearInterval(pollInterval);
                    Alert.alert(
                        'Payment Successful',
                        'Your premium subscription has been activated!',
                        [{
                            text: 'OK',
                            onPress: () => router.push("/agent/dashboard")
                        }]
                    );
                } else if (attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    Alert.alert(
                        'Verification Timeout',
                        'Please contact support if payment was made.',
                        [{ text: 'OK' }]
                    );
                }

                attempts++;
            } catch (err) {
                console.error('Verification error:', err);
                clearInterval(pollInterval);
                Alert.alert(
                    'Verification Error',
                    'An error occurred during verification. Please try again or contact support.',
                    [{ text: 'OK' }]
                );
            }
        }, 5000);
    };

    return (
        <SafeAreaView className='flex-1 bg-darkUmber-dark p-4'>
            <ScrollView>
                <View className="flex-row items-center justify-start gap-3 mb-4">
                    <TouchableOpacity
                        className='bg-transparentWhite items-center justify-center w-[50px] h-[50px] rounded-full'
                        onPress={() => router.back()}
                    >
                        <Ionicons name='chevron-back-outline' size={23} color={'#FFFFFF'} />
                    </TouchableOpacity>
                    <Text className="text-white font-rbold text-2xl">Payment</Text>
                </View>

                <View className='bg-transparentWhite w-full rounded-lg p-4 mb-4'>
                    <Text className="text-white font-rbold text-xl text-center mb-4">
                        Complete Your Payment
                    </Text>

                    {error ? (
                        <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
                    ) : null}

                    {paymentDetails && (
                        <View className="space-y-4">
                            <View className="border-b border-gray-600 pb-2">
                                <Text className="text-white text-lg">Amount:</Text>
                                <Text className="text-white font-rbold text-xl">
                                    {paymentDetails.currency} {paymentDetails.amount}
                                </Text>
                            </View>

                            <TouchableOpacity
                                className="bg-[#BBCC13] p-4 rounded-lg items-center"
                                onPress={initiatePayment}
                                disabled={isLoading}
                            >
                                <Text className="text-white font-rbold text-lg">
                                    {isLoading ? 'Processing...' : 'Pay Now'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <StatusBar backgroundColor={"#212A2B"} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Payment;