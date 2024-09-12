import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import { useProperty } from '../../../../contexts/PropertyContext';
import { Ionicons } from '@expo/vector-icons';

const PropertyDetails = () => {
    const params = useLocalSearchParams();
    const { getProperty, property, propertyLoading } = useProperty();

    useEffect(() => {
        const getPropertyDetails = async () => {
            await getProperty(params.id);
        };

        getPropertyDetails();
    }, []);

    if (propertyLoading) {
        return (
            <SafeAreaView className="flex-1 bg-darkUmber-dark justify-center items-center">
                <ActivityIndicator size="large" color="#BBCC13" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-darkUmber-dark">
            <ScrollView className="flex-1">
                <View className="p-4">
                    <View className="flex-row items-center mb-4">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='chevron-back-outline' size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white font-rbold text-2xl ml-2">Property details</Text>
                    </View>

                    <Text className="text-white text-3xl font-rbold mb-2">{property.title}</Text>
                    <Text className="text-white text-xl font-rmedium mb-6">Status: For {property.status}</Text>
                    <Text className="text-chartreuse text-xl font-rmedium mb-6">Price: {property.currency.split(' - ')[1]} {property.price} {property.status === 'Sale' ? '' : '/year'}</Text>

                    {property.video && (
                        <View className="mb-6">
                            <Text className="text-white font-rbold text-xl mb-3">Property Preview</Text>
                            <Video
                                source={{ uri: property.video }}
                                className="w-full h-[200px] rounded-lg"
                                useNativeControls
                                resizeMode="contain"
                            />
                        </View>
                    )}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6"
                    >
                        {property.images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                className="h-[170px] w-[250px] mr-4 rounded-lg"
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {property.document && (
                        <TouchableOpacity
                            className="mb-6 p-4 bg-frenchGray-dark rounded-lg flex-row items-center justify-between"
                            onPress={() => WebBrowser.openBrowserAsync(property.document)}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="document-text-outline" size={24} color="#BBCC13" />
                                <Text className="text-white text-lg font-rmedium ml-3">View Property Document</Text>
                            </View>
                            <Ionicons name="arrow-forward-outline" size={24} color="#BBCC13" />
                        </TouchableOpacity>
                    )}

                    <View className="flex-row items-center mb-6">
                        <Ionicons name="location-outline" size={24} color="#BBCC13" />
                        <Text className="text-white text-lg ml-2 mr-2 font-rregular">{property.location}</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-white font-rbold text-xl mb-2">Description</Text>
                        <Text className="text-frenchGray-light text-base leading-6 font-rregular">{property.description}</Text>
                    </View>

                    <View className="mb-6 bg-frenchGray-dark p-4 rounded-lg">
                        <Text className="text-white font-rbold text-xl mb-3">Proprietor Information</Text>
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="person-outline" size={20} color="#BBCC13" />
                            <Text className="text-white text-base ml-2 font-rregular">{property.agentName}</Text>
                        </View>
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="call-outline" size={20} color="#BBCC13" />
                            <Text className="text-white text-base ml-2 font-rregular">{property.agentContact}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="business-outline" size={20} color="#BBCC13" />
                            <Text className="text-white text-base ml-2 font-rregular">{property.companyName}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PropertyDetails;