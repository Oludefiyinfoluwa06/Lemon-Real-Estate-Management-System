import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const LocationSelector = ({ onLocationSelect }) => {
    const [mapRegion, setMapRegion] = useState(null);
    const [address, setAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const initialRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            setMapRegion(initialRegion);
            await updateAddressFromCoords(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            setErrorMsg('Error getting location');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateAddressFromCoords = async (latitude, longitude) => {
        try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode.length > 0) {
                const loc = geocode[0];
                const formattedAddress = [
                    loc.street,
                    loc.district,
                    loc.city,
                    loc.region,
                    loc.country
                ].filter(Boolean).join(', ');

                setAddress(formattedAddress);
                onLocationSelect({
                    coords: { latitude, longitude },
                    address: formattedAddress
                });
            }
        } catch (error) {
            console.error('Error getting address:', error);
        }
    };

    const searchLocation = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const results = await Location.geocodeAsync(searchQuery);
            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };
                setMapRegion(newRegion);
                await updateAddressFromCoords(latitude, longitude);
            }
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegionChange = async (region) => {
        setMapRegion(region);
        await updateAddressFromCoords(region.latitude, region.longitude);
    };

    return (
        <View className="w-full">
            <View className="flex-row items-center mb-4 bg-frenchGray-dark rounded-lg p-2">
                <TextInput
                    className="flex-1 text-white px-2"
                    placeholder="Search location..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchLocation}
                />
                <TouchableOpacity
                    onPress={searchLocation}
                    className="p-2"
                >
                    <Ionicons name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={getUserLocation}
                className="absolute top-16 right-4 z-10 bg-white p-2 rounded-full shadow-lg"
            >
                <Ionicons name="locate" size={24} color="#352C1F" />
            </TouchableOpacity>

            <View className="w-full h-[300px] rounded-lg overflow-hidden">
                {loading ? (
                    <View className="flex-1 items-center justify-center bg-frenchGray-dark">
                        <ActivityIndicator size="large" color="#BBCC13" />
                    </View>
                ) : errorMsg ? (
                    <View className="flex-1 items-center justify-center bg-frenchGray-dark">
                        <Text className="text-white">{errorMsg}</Text>
                    </View>
                ) : (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        initialRegion={mapRegion}
                        onRegionChangeComplete={handleRegionChange}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
                        {mapRegion && (
                            <Marker
                                coordinate={{
                                    latitude: mapRegion.latitude,
                                    longitude: mapRegion.longitude
                                }}
                                title="Selected Location"
                            />
                        )}
                    </MapView>
                )}
            </View>

            <View className="mt-2 p-2 bg-frenchGray-dark rounded-lg">
                <Text className="text-white font-medium">Selected Location:</Text>
                <Text className="text-white">{address || 'No location selected'}</Text>
            </View>
        </View>
    );
};

export default LocationSelector;
