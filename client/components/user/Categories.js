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

    const categoryProperties = [
        {
            id: 1,
            image: images.house1,
            name: 'Pent House',
            price: '$1,200,000'
        },
        {
            id: 2,
            image: images.house2,
            name: 'Luxury Villa',
            price: '$2,500,000'
        },
        {
            id: 3,
            image: images.house1,
            name: 'Bungalow',
            price: '$2,500,000'
        },
        {
            id: 4,
            image: images.house2,
            name: 'Duplex',
            price: '$2,500,000'
        },
    ];
    
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
                contentContainerStyle={{ paddingRight: 20 }}
                className='mt-[20px]'
            >
                {categoryProperties.map(property => (
                    <View
                        className='ml-[20px]'
                        key={property.id}
                    >
                        <ImageBackground
                            source={property.image}
                            resizeMode='cover'
                            style={{ width: 200, height: 180, borderRadius: 18, overflow: 'hidden' }}
                        >
                            <View className='bg-transparentBlack absolute top-0 left-0 w-full h-full' />
                            <View className='absolute bottom-0 left-0 p-2 flex-row items-center justify-between w-full'>
                                <TouchableOpacity>
                                    <Text className='text-xl font-rbold text-white'>{property.name}</Text>
                                    <Text className='text-lg font-rbold text-gray-400'>{property.price}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name='heart-outline' size={22} color={'#FFFFFF'} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default Categories;