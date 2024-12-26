import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const About = ({
    description,
    proprietorName,
    proprietorContact,
    companyName,
    proprietorProfilePic,
    document,
    proprietorId,
    coordinates,
}) => {
    const mapRegion = coordinates ? {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    } : null;

    return (
        <View className="p-4">
            <View className="mb-4">
                <Text className="font-rbold text-2xl text-white">Overview</Text>
                <Text className="text-white font-rregular mt-2">{description}</Text>
            </View>

            {document && (
                <TouchableOpacity
                    className="mb-6 p-4 bg-chartreuse rounded-lg flex-row items-center justify-between"
                    onPress={() => WebBrowser.openBrowserAsync(document)}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="document-text-outline" size={24} color="#352C1F" />
                        <Text className="text-darkUmber-dark text-lg font-rbold ml-3">View Property Document</Text>
                    </View>
                    <Ionicons name="arrow-forward-outline" size={24} color="#352C1F" />
                </TouchableOpacity>
            )}

            <View className="mb-6">
                <Text className="font-rbold text-2xl text-white">Proprietor Info</Text>
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center justify-start gap-4">
                        <View>
                            {proprietorProfilePic ? (
                                <Image
                                    source={{ uri: proprietorProfilePic }}
                                    style={{ width: 45, height: 45, borderRadius: 36 }}
                                    resizeMode='cover'
                                />
                            ) : (
                                <Ionicons name='person-outline' size={30} color={"#BBCC13"} />
                            )}
                        </View>
                        <View>
                            <Text className="text-white font-rbold text-lg">{proprietorName}</Text>
                            <Text className="text-white font-rregular text-md">{companyName}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-end gap-4">
                        <TouchableOpacity
                            className="rounded-full p-3 items-center justify-center bg-frenchGray-dark"
                            onPress={() => router.push(`/user/chat/${proprietorId}?name=${proprietorName}&profilePicture=${proprietorProfilePic}`)}
                        >
                            <Ionicons name='chatbubble-ellipses-outline' size={20} color={"#BBCC13"} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="rounded-full p-3 items-center justify-center bg-frenchGray-dark"
                            onPress={() => {
                                const phoneNumber = `tel:${proprietorContact}`;
                                Linking.openURL(phoneNumber)
                                    .catch((err) => console.log('Error opening phone dialer:', err));
                            }}
                        >
                            <Ionicons name='call-outline' size={20} color={"#BBCC13"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {coordinates && (
                <View className="mb-4">
                    <Text className="font-rbold text-2xl text-white mb-3">Location</Text>
                    <View className="rounded-lg overflow-hidden">
                        <MapView
                            className="w-full h-[200px]"
                            provider={PROVIDER_GOOGLE}
                            initialRegion={mapRegion}
                            scrollEnabled={true}
                            zoomEnabled={true}
                            rotateEnabled={false}
                            pitchEnabled={false}
                            showsUserLocation={false}
                            showsBuildings={true}
                            showsTraffic={false}
                            showsPointsOfInterest={true}
                        >
                            <Marker
                                coordinate={coordinates}
                                title="Property Location"
                            >
                                <View className="bg-chartreuse p-2 rounded-full">
                                    <Ionicons name="location" size={24} color="#352C1F" />
                                </View>
                            </Marker>
                        </MapView>
                        <TouchableOpacity
                            className="absolute bottom-3 right-3 bg-chartreuse p-2 rounded-lg flex-row items-center"
                            onPress={() => {
                                const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
                                Linking.openURL(url);
                            }}
                        >
                            <Ionicons name="navigate" size={20} color="#352C1F" />
                            <Text className="text-darkUmber-dark font-rbold ml-2">Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

export default About;
