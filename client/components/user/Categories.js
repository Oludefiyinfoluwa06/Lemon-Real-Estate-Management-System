import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { images } from '../../assets/constants';

const Categories = () => {
    const categories = ['Lands', 'Duplex', 'Bungalows', 'Shop Spaces', 'Mansions'];

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    
    const toggleCategorySelection = (property) => {
        setSelectedCategory(property);
    };
    
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={category}
                        className={`p-2 m-1 rounded-md ${index === 0 ? 'ml-4' : ''} ${index === categories.length - 1 ? 'mr-4' : ''} ${selectedCategory === category ? 'bg-chartreuse' : 'bg-frenchGray-light'}`}
                        onPress={() => toggleCategorySelection(category)}
                    >
                        <Text className={`text-center font-rbold text-lg ${selectedCategory === category ? 'text-frenchGray-light' : 'text-white'}`}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='mt-[20px]'
            >
                <View className='ml-[20px]'>
                    <ImageBackground
                        source={images.house1}
                        style={{ width: 150, height: 150, borderRadius: 18, overflow: 'hidden' }}
                    >
                        <View className='bg-transparentBlack absolute top-0 left-0 w-full h-full' />
                        <View className='absolute bottom-0 left-0 p-2 flex-row items-center justify-between w-full'>
                            <TouchableOpacity>
                                <Text className='text-md font-rbold text-white'>Hello Avenue</Text>
                                <Text className='text-sm font-rbold text-gray-400'>Abuja</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Ionicons name='heart-outline' size={20} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                <View className='ml-[20px]'>
                    <ImageBackground
                        source={images.house2}
                        style={{ width: 150, height: 150, borderRadius: 18, overflow: 'hidden' }}
                    >
                        <View className='bg-transparentBlack absolute top-0 left-0 w-full h-full' />
                        <View className='absolute bottom-0 left-0 p-2 flex-row items-center justify-between w-full'>
                            <TouchableOpacity>
                                <Text className='text-md font-rbold text-white'>Hello Avenue</Text>
                                <Text className='text-sm font-rbold text-gray-400'>Abuja</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Ionicons name='heart-outline' size={20} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                <View className='ml-[20px]'>
                    <ImageBackground
                        source={images.house1}
                        style={{ width: 150, height: 150, borderRadius: 18, overflow: 'hidden' }}
                    >
                        <View className='bg-transparentBlack absolute top-0 left-0 w-full h-full' />
                        <View className='absolute bottom-0 left-0 p-2 flex-row items-center justify-between w-full'>
                            <TouchableOpacity>
                                <Text className='text-md font-rbold text-white'>Hello Avenue</Text>
                                <Text className='text-sm font-rbold text-gray-400'>Abuja</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Ionicons name='heart-outline' size={20} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                <View className='mx-[20px]'>
                    <ImageBackground
                        source={images.house2}
                        style={{ width: 150, height: 150, borderRadius: 18, overflow: 'hidden' }}
                    >
                        <View className='bg-transparentBlack absolute top-0 left-0 w-full h-full' />
                        <View className='absolute bottom-0 left-0 p-2 flex-row items-center justify-between w-full'>
                            <TouchableOpacity>
                                <Text className='text-md font-rbold text-white'>Hello Avenue</Text>
                                <Text className='text-sm font-rbold text-gray-400'>Abuja</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Ionicons name='heart-outline' size={20} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
        </View>
    );
}

export default Categories;