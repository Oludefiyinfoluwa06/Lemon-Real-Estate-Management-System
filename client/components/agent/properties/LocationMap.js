import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const LocationMap = ({ onLocationSelect }) => {
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'Please enable location services to use this feature.',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const newRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };

                setRegion(newRegion);

                setSelectedLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                Alert.alert('Error', 'Could not fetch location.');
            }
        };

        getLocation();
    }, []);

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;

        setRegion({
            ...region,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        });

        setSelectedLocation(coordinate);

        if (onLocationSelect) {
            onLocationSelect(coordinate);
        }
    };

    return (
        <MapView
            className="w-full h-[450px]"
            provider={PROVIDER_GOOGLE}
            region={region}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
        >
            {selectedLocation && (
                <Marker
                    coordinate={selectedLocation}
                    title="Selected Location"
                    description="This is the location you selected"
                    draggable
                    onDragEnd={(e) => {
                        setSelectedLocation(e.nativeEvent.coordinate);
                        onLocationSelect?.(e.nativeEvent.coordinate);
                    }}
                />
            )}
        </MapView>
    );
}

export default LocationMap;
