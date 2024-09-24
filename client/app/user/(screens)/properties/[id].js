import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProperty } from '../../../../contexts/PropertyContext';
import About from '../../../../components/user/properties/tabs/About';
import Gallery from '../../../../components/user/properties/tabs/Gallery';
import Review from '../../../../components/user/properties/tabs/Review';
import { formatPrice } from '../../../../services/formatPrice';

const PropertyDetails = () => {
    const params = useLocalSearchParams();
    const { getProperty, property, propertyLoading, updateProperty } = useProperty();
    const [activeTab, setActiveTab] = useState("about");

    const [userId, setUserId] = useState("");

    const getUserId = async () => {
        return await AsyncStorage.getItem('userId');
    }

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getUserId();
            setUserId(userId);
        }

        fetchUserId();
    }, []);

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
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="relative h-[350px]">
                    {property?.images && <Image
                        source={{ uri: property?.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />}
                    <TouchableOpacity
                        className="absolute top-4 left-4 bg-transparentBlack rounded-full p-2"
                        onPress={() => router.back()}
                    >
                        <Ionicons name='chevron-back-outline' size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="absolute top-4 right-4 bg-transparentBlack rounded-full p-3"
                        onPress={async () => await updateProperty(property._id)}
                    >
                        <Ionicons name={property.savedBy && property.savedBy.includes(userId) ? "heart" : "heart-outline"} color={"#BBCC13"} size={25} />
                    </TouchableOpacity>

                    <View className="absolute bottom-0 left-0 right-0 bg-darkUmber-light p-4 flex-row justify-between items-center">
                        <View className="flex-1 items-start">
                            <Text className="text-white text-xl font-rbold">{property?.title}</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={20} color="#BBCC13" />
                                <Text className="text-white text-base ml-2 font-rregular">{property?.location}</Text>
                            </View>
                        </View>

                        <View className="items-end">
                            <Text className="text-chartreuse text-xl font-rmedium">
                                {property?.currency ? property?.currency.split(' - ')[1] : ''} {formatPrice(property?.price)}
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
                        proprietorName={property?.agentName}
                        proprietorContact={property?.agentContact}
                        companyName={property?.companyName}
                        proprietorProfilePic={property?.agentProfilePicture}
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