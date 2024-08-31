import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProperty } from '../../../contexts/PropertyContext';
import Header from '../../../components/agent/properties/Header';
import Listing from '../../../components/agent/properties/Listing';

const Properties = () => {
    const {
        getProperties,
        agentProperties,
    } = useProperty();

    useEffect(() => {
        const getPropertiesDetails = async () => {
            await getProperties();
        }

        getPropertiesDetails();
    }, []);

    return (
        <SafeAreaView className='h-full bg-darkUmber-dark'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='p-4'
            >
                <Header />

                <Listing properties={agentProperties} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default Properties;