import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';

const About = ({
    description,
    proprietorName,
    proprietorContact,
    companyName,
    proprietorProfilePic,
    document,
    proprietorId
}) => {
    return (
        <View className="p-4">
            <View className="mb-4">
                <Text className="font-rbold text-2xl text-white">Overview</Text>
                <Text className="text-white font-rregular mt-2">{description}</Text>
            </View>

            {document && (
                <TouchableOpacity
                    className="mb-6 p-4 bg-chartreuse rounded-lg flex-row items-center justify-between"
                    onPress={() => WebBrowser.openBrowserAsync(document)}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="document-text-outline" size={24} color="#352C1F" />
                        <Text className="text-darkUmber-dark text-lg font-rbold ml-3">View Property Document</Text>
                    </View>
                    <Ionicons name="arrow-forward-outline" size={24} color="#352C1F" />
                </TouchableOpacity>
            )}

            <View>
                <Text className="font-rbold text-2xl text-white">Proprietor Info</Text>
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center justify-start gap-4">
                        <View>
                            {proprietorProfilePic ? (
                                <Image
                                    source={{ uri: proprietorProfilePic }}
                                    style={{ width: 45, height: 45, borderRadius: 36 }}
                                    resizeMode='cover'
                                />
                            ) : (
                                <Ionicons name='person-outline' size={30} color={"#BBCC13"} />
                            )}
                        </View>
                        <View>
                            <Text className="text-white font-rbold text-lg">{proprietorName}</Text>
                            <Text className="text-white font-rregular text-md">{companyName}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-end gap-4">
                        <TouchableOpacity
                            className="rounded-full p-3 items-center justify-center bg-frenchGray-dark"
                            onPress={() => router.push(`/user/chat/${proprietorId}?name=${proprietorName}&profilePicture=${proprietorProfilePic}`)}
                        >
                            <Ionicons name='chatbubble-ellipses-outline' size={20} color={"#BBCC13"} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="rounded-full p-3 items-center justify-center bg-frenchGray-dark"
                            onPress={() => {
                                const phoneNumber = `tel:${proprietorContact}`;
                                Linking.openURL(phoneNumber)
                                    .catch((err) => console.log('Error opening phone dialer:', err));
                            }}
                        >
                            <Ionicons name='call-outline' size={20} color={"#BBCC13"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default About;