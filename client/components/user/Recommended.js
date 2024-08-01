import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { images } from '../../assets/constants';

const Recommended = () => {
    const recommendedProperties = [
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
        <View className='mt-[20px]'>
            <Text className='text-xl font-rbold text-white ml-[20px]'>Recommended Properties</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className='mt-[20px]'
            >
                {recommendedProperties.map(property => (
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
                            </View>
                        </ImageBackground>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default Recommended;