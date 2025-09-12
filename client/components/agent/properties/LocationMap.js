import React, { useState, useEffect, useRef } from "react";
import { Alert, View, StyleSheet, TextInput } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

const LocationMap = ({ onLocationSelect }) => {
  // Initial region state (this may be updated once we get the user's location)
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const webviewRef = useRef(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please enable location services to use this feature.",
            [{ text: "OK" }],
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });

        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Error", "Could not fetch location.");
      }
    };

    getLocation();
  }, []);

  // Update state and trigger the callback when the user interacts with the map
  const handleMapClick = (event) => {
    const { latlng } = event;
    const newRegion = {
      latitude: latlng.lat,
      longitude: latlng.lng,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };

    setRegion(newRegion);
    setSelectedLocation(latlng);

    if (onLocationSelect) {
      onLocationSelect(latlng);
    }
  };

  // Handle messages coming from the WebView (when the user clicks or drags the marker)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      handleMapClick(data);
    } catch (error) {
      console.warn("Error parsing WebView message:", error);
    }
  };

  // Called when the user submits a location in the input field
  const handleLocationSearch = async () => {
    if (!searchQuery) return;
    try {
      const geocodeResults = await Location.geocodeAsync(searchQuery);
      if (geocodeResults.length > 0) {
        const { latitude, longitude } = geocodeResults[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        };
        setRegion(newRegion);
        setSelectedLocation({ latitude, longitude });
        // Use injected JavaScript to update the marker on the map
        if (webviewRef.current) {
          const jsCode = `
            if (window.setMarkerPosition) {
              window.setMarkerPosition(${latitude}, ${longitude});
            }
            true;
          `;
          webviewRef.current.injectJavaScript(jsCode);
        }
        if (onLocationSelect) {
          onLocationSelect({ lat: latitude, lng: longitude });
        }
      } else {
        Alert.alert(
          "Location Not Found",
          "Could not find the specified location.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Error searching for location.");
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            #map {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
            }
            .custom-marker {
                background-color: #DFFF00;
                border: 2px solid #352C1F;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            setTimeout(() => {
                const map = L.map('map', {
                    zoomControl: true,
                    attributionControl: true
                }).setView([${region.latitude}, ${region.longitude}], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" fill="#352C1F" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 12 7 12s7-6.75 7-12c0-3.866-3.134-7-7-7zm0 10.5c-1.933 0-3.5-1.567-3.5-3.5S10.067 5.5 12 5.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/></svg>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                });

                const marker = L.marker([${region.latitude}, ${region.longitude}], { 
                    draggable: true,
                    icon: customIcon
                }).addTo(map);

                marker.on('dragend', function(event) {
                    const position = event.target.getLatLng();
                    window.ReactNativeWebView.postMessage(JSON.stringify({ latlng: position }));
                });

                map.on('click', function(e) {
                    const latlng = e.latlng;
                    marker.setLatLng(latlng);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ latlng }));
                });

                // Expose a function to update the marker's position from React Native
                window.setMarkerPosition = function(lat, lng) {
                  marker.setLatLng([lat, lng]);
                  map.setView([lat, lng], map.getZoom());
                };

                map.invalidateSize();
            }, 100);
        </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Enter location"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleLocationSearch}
        placeholderTextColor="#FFFFFF"
        className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
      />
      <View style={styles.container}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    width: "100%",
    height: "100%",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
  },
});

export default LocationMap;
