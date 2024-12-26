import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const About = ({ description, document, coordinates }) => {
    const mapRegion = coordinates ? {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
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

            {coordinates && (
                <View className="mb-6">
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
                            showsUserLocation={true}
                            showsBuildings={true}
                            showsTraffic={true}
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
                    </View>
                </View>
            )}
        </View>
    );
}

export default About;
