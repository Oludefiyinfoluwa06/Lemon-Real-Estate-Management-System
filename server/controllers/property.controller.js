const { isValidObjectId } = require("mongoose");
const User = require("../models/user.model");
const Property = require("../models/property.model");

const uploadProperty = async (req, res) => {
    try {
        const { title, description, category, status, price, currency, location, images, video, document } = req.body;

        const agentId = req.user._id;

        const isValidId = isValidObjectId(agentId);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const agent = await User.findById(agentId);

        if (!agent) {
            return res.status(404).json({ message: 'Agent Details not found' });
        }

        const property = await Property.create({
            title,
            description,
            category,
            status,
            price,
            currency,
            location,
            images,
            video,
            agentId,
            agentName: `${agent.lastName} ${agent.firstName}`,
            agentContact: agent.mobileNumber,
            companyName: agent.companyName,
            document
        });

        return res.status(201).json({ message: 'Property upload successful', property });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const getProperties = async (req, res) => {
    try {
        const id = req.user._id;

        const agentProperties = await Property.find({ agentId: id });

        const properties = await Property.find();

        const propertiesForRent = await Property.find({ agentId: id, status: 'rent' });

        const propertiesForLease = await Property.find({ agentId: id, status: 'lease' });

        const propertiesForSale = await Property.find({ agentId: id, status: 'sale' });

        return res.status(200).json({
            agentProperties,
            properties,
            numberOfProperties: properties.length,
            propertiesForRent: propertiesForRent.length,
            propertiesForLease: propertiesForLease.length,
            propertiesForSale: propertiesForSale.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const getProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;

        const isValidId = isValidObjectId(propertyId);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        return res.status(200).json({ property });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const updateProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const { title, description, category, status, price, currency, longitude, latitude, images, video, companyName, document } = req.body;

        const isValidId = isValidObjectId(propertyId);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const property = await Property.findByIdAndUpdate(propertyId, {
            title, 
            description, 
            category, 
            status, 
            price, 
            currency, 
            longitude, 
            latitude, 
            images, 
            video, 
            companyName, 
            document
        }, { new: true });

        return res.status(200).json({ message: 'Property updated successful', property });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const deleteProperty = async (req, res) => {
    const propertyId = req.params.id;

    const isValidId = isValidObjectId(propertyId);

    if (!isValidId) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const property = await Property.findByIdAndDelete(propertyId);

    return res.status(200).json({ message: 'Property deleted successfully', property });
}

module.exports = {
    uploadProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty,
}