import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useProperty } from '../../../../contexts/PropertyContext';
import { router } from 'expo-router';
import NoProperties from '../../../../components/user/NoProperties';
import { formatPrice } from '../../../../services/formatPrice';

const SavedProperties = () => {
    const { propertyLoading, savedProperties } = useProperty();

    return (
        <SafeAreaView className="h-full p-4 bg-darkUmber-dark">
            <View className="flex-row items-center justify-start gap-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='chevron-back-outline' color={"#FFFFFF"} size={30} />
                </TouchableOpacity>
                <Text className="font-rbold text-2xl text-white">Saved Properties</Text>
            </View>

            <View className="mt-[30px]">
                {propertyLoading ? (
                    <View className="mt-[100px]">
                        <ActivityIndicator size="large" color="#BBCC13" />
                    </View>
                ) : savedProperties.length !== 0 ?
                    savedProperties.map(property => (
                    <TouchableOpacity
                        key={property._id}
                        onPress={() => router.push(`/user/properties/${property._id}`)}
                        className="flex-row items-center justify-start w-full my-3 gap-3"
                    >
                        <View className="w-[100px] h-[100px]">
                            <Image
                                source={{ uri: property.images[0] }}
                                resizeMode='cover'
                                className="w-full h-full rounded-lg"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-rbold text-xl">{property.title}</Text>
                            <View className="flex-row items-center justify-start">
                                <Ionicons name='location-outline' size={18} color={'#BBCC13'} />
                                <Text className="text-frenchGray-light font-rregular text-lg">{property.location}</Text>
                            </View>
                            <Text className="text-frenchGray-light font-rregular text-lg">
                                {property.currency.split(' - ')[1]} {formatPrice(property.price)} {property?.status === 'Sale' ? '' : '/year'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )) : <NoProperties />}
            </View>

            <StatusBar backgroundColor={"#212A2B"} />
        </SafeAreaView>
    );
}

export default SavedProperties;