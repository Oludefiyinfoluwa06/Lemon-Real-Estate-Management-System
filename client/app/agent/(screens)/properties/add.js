import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';
import Button from '../../../../components/common/Button';
import { CustomSelect } from '../../../../components/agent/properties/CustomSelect';
import { fetchCountries } from '../../../../services/countryApi';
import { useProperty } from '../../../../contexts/PropertyContext';
import ErrorOrMessageModal from '../../../../components/common/ErrorOrMessageModal';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AddProperty = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('');
    const [location, setLocation] = useState('');
    const [propertyImages, setPropertyImages] = useState(Array(5).fill(null));
    const [video, setVideo] = useState('');
    const [document, setDocument] = useState('');
    const [uploading, setUploading] = useState(false);
    const [currencies, setCurrencies] = useState([]);

    const router = useRouter();

    const categories = [
        { name: 'Land' },
        { name: 'Houses' },
        { name: 'Shop Spaces' },
        { name: 'Office Building' },
        { name: 'Industrial Building' }
    ];
    const statusItems = [
        { name: 'Rent' },
        { name: 'Lease' },
        { name: 'Sale' }
    ];

    const { uploadProperty, propertyError, propertyMessage, setPropertyError, setPropertyMessage, propertyLoading } = useProperty();

    useEffect(() => {
        const getCurrency = async () => {
            try {
                const countries = await fetchCountries();
                const currencyMap = new Map();
                countries.forEach(country => {
                    if (country.currencies) {
                        Object.values(country.currencies).forEach(currency => {
                            currencyMap.set(currency.name, currency.symbol);
                        });
                    }
                });
                setCurrencies(Array.from(currencyMap.entries()).map(([name, symbol]) => ({ name, symbol })));
            } catch (error) {
                console.error('Error setting currencies:', error);
            }
        };
        getCurrency();
    }, []);

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (title === '' || description === '' || category === '' || status === '') {
                return setPropertyError('Input fields must not be empty');
            }
            setCurrentStep(currentStep + 1);
        } else {
            if (price === '' || currency === '' || location === '') {
                return setPropertyError('Input fields must not be empty');
            }
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleAddProperty = async () => {
        if (propertyImages.filter(Boolean).length === 0 || video === '' || document === '') {
            return setPropertyError('Select the necessary files');
        }
        await uploadProperty(title, description, category, status, price, currency, location, propertyImages, video, document);
    };

    const uploadFileToCloudinary = async (file, type, slot) => {
        const data = new FormData();
        data.append('file', {
            uri: file.uri,
            type: file.mimeType,
            name: file.fileName,
        });
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        setUploading(true);
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (type === 'image') {
                setPropertyImages((prevImages) => {
                    const updatedImages = [...prevImages];
                    updatedImages[slot] = response.data.secure_url;
                    return updatedImages;
                });
            } else if (type === 'video') {
                setVideo(response.data.secure_url);
            } else if (type === 'document') {
                setDocument(response.data.secure_url);
            }
        } catch (error) {
            console.log('Error uploading to Cloudinary:', error.message);
        } finally {
            setUploading(false);
        }
    };

    const uploadDocumentToCloudinary = async (file) => {
        const data = new FormData();
        data.append('file', {
            uri: file.assets[0].uri,
            type: file.assets[0].mimeType,
            name: file.assets[0].name,
        });
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        setUploading(true);
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            setDocument(response.data.secure_url);
        } catch (error) {
            console.log('Error uploading to Cloudinary:', error.message);
        } finally {
            setUploading(false);
        }
    }

    const handleImageUpload = async (slot) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            uploadFileToCloudinary(result.assets[0], 'image', slot);
        }
    };

    const handleVideoUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });

        if (!result.canceled) {
            uploadFileToCloudinary(result.assets[0], 'video');
        }
    };

    const handleDocumentUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
        });

        if (result.type !== 'cancel') {
            uploadDocumentToCloudinary(result);
        }
    };

    return (
        <SafeAreaView className="bg-darkUmber-dark h-full">
            <ScrollView showsVerticalScrollIndicator={false} className="p-4">
                {propertyError && (
                    <ErrorOrMessageModal
                        visible={propertyError !== ''}
                        modalType='error'
                        onClose={() => setPropertyError('')}
                        text={propertyError}
                    />
                )}

                {propertyMessage && (
                    <ErrorOrMessageModal
                        visible={propertyMessage !== ''}
                        modalType='success'
                        onClose={() => setPropertyMessage('')}
                        text={propertyMessage}
                    />
                )}
                <View className="flex-row items-center justify-start gap-3 mb-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back-outline" size={23} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white font-rbold text-2xl">Add New Property</Text>
                </View>

                {currentStep === 1 && (
                    <View>
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor="#FFFFFF"
                            value={title}
                            onChangeText={(text) => setTitle(text)}
                            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        />
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor="#FFFFFF"
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full h-[100px] font-rregular"
                            style={{ textAlignVertical: 'top' }}
                            multiline
                        />
                        <CustomSelect
                            placeholder="Choose a category"
                            selectedValue={category}
                            options={categories}
                            onSelect={(value) => setCategory(value.name)}
                        />
                        <CustomSelect
                            placeholder="Choose a status"
                            selectedValue={status}
                            options={statusItems}
                            onSelect={(value) => setStatus(value.name)}
                        />

                        <Button text="Next" bg={true} onPress={handleNextStep} />
                    </View>
                )}

                {currentStep === 2 && (
                    <View>
                        <TextInput
                            placeholder="Price"
                            placeholderTextColor="#FFFFFF"
                            value={price}
                            onChangeText={(text) => setPrice(text)}
                            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                            keyboardType="numeric"
                        />
                        <View className="flex-row items-center justify-start gap-3 mb-4">
                            <Ionicons name="information-circle-outline" size={18} color={"#BBCC13"} />
                            <Text className="font-rregular text-frenchGray-light text-[13px] leading-tight flex-shrink">
                                Please note, rental and lease property prices are quoted per annum (yearly).
                            </Text>
                        </View>

                        <CustomSelect
                            placeholder="Choose a currency"
                            selectedValue={currency}
                            options={currencies}
                            onSelect={(value) => setCurrency(`${value.name} - ${value.symbol}`)}
                        />

                        <TextInput
                            placeholder="Location"
                            placeholderTextColor="#FFFFFF"
                            value={location}
                            onChangeText={(text) => setLocation(text)}
                            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
                        />

                        <View className="flex flex-row justify-between mt-4">
                            <Button text="Back" bg={false} onPress={handlePreviousStep} />
                            <Button type="user" text="Next" bg={true} onPress={handleNextStep} />
                        </View>
                    </View>
                )}

                {currentStep === 3 && (
                    <View>
                        <Text className="font-rbold mb-2 text-xl text-white">Upload Images</Text>
                        <ScrollView
                            className="mb-4"
                            showsHorizontalScrollIndicator={false}
                            horizontal
                        >
                            {propertyImages.map((img, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="h-[150px] w-[150px] rounded mr-3 bg-frenchGray-dark items-center justify-center"
                                    onPress={() => handleImageUpload(index)}
                                >
                                    {img ? (
                                        <Image source={{ uri: img }} className="h-full w-full rounded" />
                                    ) : (
                                        <View>
                                            {uploading ? (
                                                <ActivityIndicator size={"large"} color={"#BBCC13"} />
                                            ) : (
                                                <Ionicons name="image" size={40} color="#FFFFFF" />
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text className="font-rbold mb-2 text-xl text-white">Upload Video</Text>
                        {video ? (
                            <Video
                                source={{ uri: video }}
                                className="w-full h-[200px] rounded mt-3"
                                useNativeControls
                                resizeMode="contain"
                            />
                        ) : (
                            <TouchableOpacity
                                className="h-[150px] w-full rounded bg-frenchGray-dark items-center justify-center mb-4"
                                onPress={handleVideoUpload}
                            >
                                {uploading ? (
                                    <ActivityIndicator size={"large"} color={"#BBCC13"} />
                                ) : (
                                    <Ionicons name="videocam" size={40} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        )}

                        <Text className="font-rbold mb-2 text-xl text-white">Upload Document</Text>
                        {document ? (
                            <TouchableOpacity
                                className="h-[50px] w-full rounded bg-frenchGray-dark items-center justify-center mb-4"
                                onPress={() => WebBrowser.openBrowserAsync(document)}
                            >
                                <Text className="text-white">Preview Document</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="h-[150px] w-full rounded bg-frenchGray-dark items-center justify-center mb-4"
                                onPress={handleDocumentUpload}
                            >
                                {uploading ? (
                                    <ActivityIndicator size={"large"} color={"#BBCC13"} />
                                ) : (
                                    <Ionicons name="document-text" size={40} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        )}

                        <View className="flex flex-row justify-between mt-4">
                            <Button text="Back" bg={false} onPress={handlePreviousStep} />
                            <Button
                                type="user"
                                text={propertyLoading ? "Loading..." : "Add Property"}
                                bg={true}
                                onPress={handleAddProperty}
                                loading={uploading || propertyLoading}
                            />
                        </View>
                    </View>
                )}

                <View className="mt-[50px]" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddProperty;
