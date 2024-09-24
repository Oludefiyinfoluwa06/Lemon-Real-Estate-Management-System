import { createContext, useContext, useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from "../config";
import { useRouter } from "expo-router";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [propertyError, setPropertyError] = useState('');
    const [propertyMessage, setPropertyMessage] = useState('');
    const [agentProperties, setAgentProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);
    const [property, setProperty] = useState({});
    const [numberOfProperties, setNumberOfProperties] = useState(0);
    const [propertiesForRent, setPropertiesForRent] = useState(0);
    const [propertiesForLease, setPropertiesForLease] = useState(0);
    const [propertiesForSale, setPropertiesForSale] = useState(0);
    const [rentProperties, setRentProperties] = useState([]);
    const [leaseProperties, setLeaseProperties] = useState([]);
    const [saleProperties, setSaleProperties] = useState([]);
    const [lands, setLands] = useState([]);
    const [houses, setHouses] = useState([]);
    const [shopSpaces, setShopSpaces] = useState([]);
    const [officeBuildings, setOfficeBuildings] = useState([]);
    const [industrialBuildings, setIndustrialBuildings] = useState([]);
    const [newListings, setNewListings] = useState([]);

    const router = useRouter();

    const uploadProperty = async (title, description, category, status, price, currency, location, images, video, document) => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            await axios.post(`${config.API_BASE_URL}/api/property/upload`, { title, description, category, status, price, currency, location, images, video, document }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setPropertyMessage('Property uploaded successfully');

            setTimeout(() => {
                setPropertyMessage('');

                router.replace('/agent/properties');
            }, 3000);
        } catch (error) {
            console.log(error.response.data);
            setPropertyError(error.response.data.message);
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
            setSavedProperties(response.data.savedProperties);
            setNumberOfProperties(response.data.numberOfProperties);
            setPropertiesForLease(response.data.propertiesForLease);
            setPropertiesForRent(response.data.propertiesForRent);
            setPropertiesForSale(response.data.propertiesForSale);
            setRentProperties(response.data.rentProperties);
            setLeaseProperties(response.data.leaseProperties);
            setSaleProperties(response.data.saleProperties);
            setLands(response.data.lands);
            setHouses(response.data.houses);
            setShopSpaces(response.data.shopSpaces);
            setOfficeBuildings(response.data.officeBuildings);
            setIndustrialBuildings(response.data.industrialBuildings);
            setNewListings(response.data.newListings);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setPropertyLoading(false);
        }
    }

    const getProperty = async (id) => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.get(`${config.API_BASE_URL}/api/property/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setProperty(response.data.property);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setPropertyLoading(false);
        }
    }

    const updateProperty = async (id, title, description, category, status, price, currency, location, images, video, document) => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.put(`${config.API_BASE_URL}/api/property/${id}`, { title, description, category, status, price, currency, location, images, video, document }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setPropertyMessage(response.data.message);

            setTimeout(() => {
                setPropertyMessage('');

                if (response.data.message === 'Property saved successfully') {
                    router.push('/user/properties/saved');
                }
            }, 3000);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setPropertyLoading(false);
        }
    }

    const searchProperty = async (title, country, category, status, minPrice, maxPrice) => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.get(`${config.API_BASE_URL}/api/property?title=${title}&country=${country}&category=${category}&status=${status}&minPrice=${minPrice}&maxPrice=${maxPrice}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setProperties(response.data.properties);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setPropertyLoading(false);
        }
    }

    const deleteProperty = async (id) => {
        setPropertyLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.delete(`${config.API_BASE_URL}/api/property/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log(response.data);
        } catch (error) {
            console.log(error.response.data);
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
                setPropertyError,
                setPropertyMessage,
                uploadProperty,
                getProperties,
                agentProperties,
                numberOfProperties,
                propertiesForRent,
                propertiesForLease,
                propertiesForSale,
                properties,
                savedProperties,
                rentProperties,
                leaseProperties,
                saleProperties,
                lands,
                houses,
                shopSpaces,
                officeBuildings,
                industrialBuildings,
                newListings,
                getProperty,
                property,
                updateProperty,
                searchProperty,
                deleteProperty
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
}

export const useProperty = () => useContext(PropertyContext);