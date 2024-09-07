import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
// import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';
import Button from '../../../../components/common/Button';
import { CustomSelect } from '../../../../components/agent/properties/CustomSelect';
import { fetchCountries } from '../../../../services/countryApi';
import { useProperty } from '../../../../contexts/PropertyContext';
import ErrorOrMessageModal from '../../../../components/common/ErrorOrMessageModal';
import { useRouter } from 'expo-router';

const AddProperty = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState('');
    const [document, setDocument] = useState('');
    const [uploading, setUploading] = useState(false);
    const [currencies, setCurrencies] = useState([]);

    const router = useRouter();

    // const [localImages, setLocalImages] = useState(null);
    // const [localVideo, setLocalVideo] = useState(null);
    // const [isPlaying, setIsPlaying] = useState(true);
    // const ref = useRef(null);

    const categories = [
        { name: 'Land' }, { name: 'Houses' }, { name: 'Shop Spaces' }, { name: 'Office Building' }, { name: 'Industrial Building' }
    ];
    const statusItems = [
        { name: 'Rent' }, { name: 'Lease' }, { name: 'Sale' }
    ];

    const { uploadProperty, propertyError, propertyMessage, setPropertyError, setPropertyMessage, propertyLoading } = useProperty();

    // const player = useVideoPlayer(localVideo, player => {
    //     player.loop = true;
    //     player.play();
    // });

    // useEffect(() => {
    //     const subscription = player.addListener('playingChange', isPlaying => {
    //         setIsPlaying(isPlaying);
    //     });

    //     return () => {
    //         subscription.remove();
    //     };
    // }, [player]);

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
        }

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
        if (images.length === 0 || video === '' || document === '') {
            return setPropertyError('Select the necessary files');
        }

        await uploadProperty(title, description, category, status, price, currency, location, images, video, document);
    };

    const uploadFileToCloudinary = async (file, type) => {
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
                });

            if (type === 'image') {
                setImages((prevImages) => [...prevImages, response.data.secure_url]);
            } else {
                setVideo(response.data.secure_url);
            }
        } catch (error) {
            console.log('Error uploading to Cloudinary:', error.message);
        } finally {
            setUploading(false);
        }
    }

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

    const handleImageUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // setLocalImages(result.assets);
            result.assets.forEach((asset) => uploadFileToCloudinary(asset, 'image'));
        }
    };

    const handleVideoUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        if (!result.canceled) {
            // setLocalVideo(result.assets[0]);
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
            <ScrollView className="p-4">
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
                            className="bg-frenchGray-light text-white p-2 mb-4 rounded-lg w-full font-rregular"
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
                        <Button text={uploading ? "Uploading..." : "Upload Images"} bg={false} onPress={handleImageUpload} />
                        {/* <ScrollView
                            className={`${images.length > 0 ? 'mb-4' : ''}`}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                        >
                            {images.length > 0 && images.map((image, index) => (
                                <View className="w-full h-[100px]" key={index}>
                                    <Image
                                        source={{ uri: image }}
                                        className="w-full h-[100px]"
                                        resizeMode='cover'
                                    />
                                    <Text className="text-white text-center my-2">Image uploaded successfully</Text>
                                </View>
                            ))}
                        </ScrollView> */}

                        <Button text={uploading ? "Uploading..." : "Upload Video"} bg={false} onPress={handleVideoUpload} />
                        {video ? (
                            <View className="w-full">
                                {/* <View className="w-full h-full relative">
                                    <VideoView
                                        ref={ref}
                                        className="w-full h-ful"
                                        player={player}
                                        allowsFullscreen={false}
                                        allowsPictureInPicture
                                    />
                                    <TouchableOpacity
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                        onPress={() => {
                                            if (isPlaying) {
                                                player.pause();
                                            } else {
                                                player.play();
                                            }
                                            setIsPlaying(prev => !prev);
                                        }}
                                    >
                                        <Ionicons name={isPlaying ? "play" : "pause"} size={18} color={"#FFFFFF"} />
                                    </TouchableOpacity>
                                </View> */}
                                <Text className="text-white text-center my-2">Video uploaded successfully</Text>
                            </View>
                        ) : null}

                        <Button text={uploading ? "Uploading..." : "Upload Document"} bg={false} onPress={handleDocumentUpload} />
                        {document ? (
                            <Text className="text-white text-center">Document uploaded successfully</Text>
                        ) : null}

                        <View className="flex flex-row justify-between mt-4">
                            <Button text="Back" bg={false} onPress={handlePreviousStep} />
                            <Button type="user" text={propertyLoading ? "Loading..." : "Submit"} bg={true} onPress={handleAddProperty} disabled={uploading} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddProperty;
