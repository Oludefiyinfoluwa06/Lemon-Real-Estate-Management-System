import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import { useProperty } from '../../../../contexts/PropertyContext';
import { Ionicons } from '@expo/vector-icons';
import About from '../../../../components/agent/properties/tabs/About';
import Gallery from '../../../../components/agent/properties/tabs/Gallery';
import Review from '../../../../components/agent/properties/tabs/Review';

const PropertyDetails = () => {
    const params = useLocalSearchParams();
    const { getProperty, property, propertyLoading } = useProperty();
    const [activeTab, setActiveTab] = useState("about");

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
                <View className="relative h-[350px]">
                    {property?.images && <Image
                        source={{ uri: property?.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />}
                    <TouchableOpacity
                        className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-full p-2"
                        onPress={() => router.back()}
                    >
                        <Ionicons name='chevron-back-outline' size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex-row justify-between items-center">
                        <View className="flex-1 items-start">
                            <Text className="text-white text-xl font-rbold">{property?.title}</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={20} color="#BBCC13" />
                                <Text className="text-white text-base ml-2 font-rregular">{property?.location}</Text>
                            </View>
                        </View>

                        <View className="items-end">
                            <Text className="text-chartreuse text-xl font-rmedium">
                                {property?.currency ? property?.currency.split(' - ')[1] : ''} {property?.price}
                                {property?.status === 'Sale' ? '' : '/year'}
                            </Text>
                            <View className="bg-chartreuse px-3 py-1 rounded-full mt-2">
                                <Text className="text-darkUmber-dark font-rbold">For {property?.status}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center justify-between p-4">
                    <TouchableOpacity
                        className={`px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-b-chartreuse' : ''}`}
                        onPress={() => setActiveTab("about")}
                    >
                        <Text className="text-xl text-white font-rregular">About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 ${activeTab === 'gallery' ? 'border-b-2 border-b-chartreuse' : ''}`}
                        onPress={() => setActiveTab("gallery")}
                    >
                        <Text className="text-xl text-white font-rregular">Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 ${activeTab === 'review' ? 'border-b-2 border-b-chartreuse' : ''}`}
                        onPress={() => setActiveTab("review")}
                    >
                        <Text className="text-xl text-white font-rregular">Reviews</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'about' && (
                    <About
                        description={property?.description}
                        document={property?.document}
                    />
                )}

                {activeTab === 'gallery' && (
                    <Gallery
                        photos={property?.images}
                        video={property?.video}
                    />
                )}

                {activeTab === 'review' && (
                    <Review />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default PropertyDetails;