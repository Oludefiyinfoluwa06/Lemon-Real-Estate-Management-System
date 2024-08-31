import { createContext, useContext, useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from "../config";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [propertyError, setPropertyError] = useState('');
    const [propertyMessage, setPropertyMessage] = useState('');
    const [agentProperties, setAgentProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [numberOfProperties, setNumberOfProperties] = useState(0);
    const [propertiesForRent, setPropertiesForRent] = useState(0);
    const [propertiesForLease, setPropertiesForLease] = useState(0);
    const [propertiesForSale, setPropertiesForSale] = useState(0);

    const uploadProperty = async () => {
        setPropertyLoading(true);

        try {
            
        } catch (error) {
            
        } finally {
            setPropertyLoading(false);
        }
    }

    const getProperties = async () => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.get(`${config.API_BASE_URL}/api/property/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setAgentProperties(response.data.agentProperties);
            setProperties(response.data.properties);
            setNumberOfProperties(response.data.numberOfProperties);
            setPropertiesForLease(response.data.propertiesForLease);
            setPropertiesForRent(response.data.propertiesForRent);
            setPropertiesForSale(response.data.propertiesForSale);
        } catch (error) {
            console.log(error);
        } finally {
            setPropertyLoading(false);
        }
    }

    const getProperty = async (id) => {
        setPropertyLoading(true);

        try {
            
        } catch (error) {
            
        } finally {
            setPropertyLoading(false);
        }
    }

    const updateProperty = async (id) => {
        setPropertyLoading(true);

        try {
            
        } catch (error) {
            
        } finally {
            setPropertyLoading(false);
        }
    }

    const deleteProperty = async (id) => {
        setPropertyLoading(true);

        try {
            
        } catch (error) {
            
        } finally {
            setPropertyLoading(false);
        }
    }

    return (
        <PropertyContext.Provider
            value={{
                propertyLoading,
                propertyError,
                propertyMessage,
                uploadProperty,
                getProperties,
                agentProperties,
                properties,
                numberOfProperties,
                propertiesForRent,
                propertiesForLease,
                propertiesForSale,
                getProperty,
                updateProperty,
                deleteProperty
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
}

export const useProperty = () => useContext(PropertyContext);