import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { images } from '../../assets/constants';

const NearbyProperties = () => {
    const nearbyProperties = [
        {
            id: 1,
            image: images.house1,
            name: 'Pent House',
            location: 'Maitama, Abuja'
        },
        {
            id: 2,
            image: images.house2,
            name: 'Luxury Villa',
            location: 'Maitama, Abuja'
        },
        {
            id: 3,
            image: images.house1,
            name: 'Bungalow',
            location: 'Maitama, Abuja'
        },
        {
            id: 4,
            image: images.house2,
            name: 'Duplex',
            location: 'Maitama, Abuja'
        },
    ];

    return (
        <View className='mt-[20px]'>
            <Text className='text-xl font-rbold text-white ml-[20px]'>Properties Nearby</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className='mt-[15px]'
            >
                {nearbyProperties.map(property => (
                    <TouchableOpacity
                        className='ml-[20px] flex-row item-center bg-transparentWhite rounded-xl h-[100px] p-2'
                        key={property.id}
                    >
                        <Image
                            source={property.image}
                            resizeMode='cover'
                            className='w-[80px] h-full rounded-lg'
                        />
                        <View className='flex-row items-center justify-between mx-3'>
                            <View>
                                <Text className='text-xl font-rbold text-white'>{property.name}</Text>
                                <Text className='text-lg font-rbold text-white'>{property.location}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

export default NearbyProperties;