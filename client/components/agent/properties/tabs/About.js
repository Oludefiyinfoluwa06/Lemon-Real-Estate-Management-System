import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, TouchableOpacity } from 'react-native';

const About = ({ description, document }) => {
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
        </View>
    );
}

export default About;