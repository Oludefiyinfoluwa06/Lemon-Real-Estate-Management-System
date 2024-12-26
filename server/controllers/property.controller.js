const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Property = require("../models/property.model");

const uploadProperty = async (req, res) => {
    try {
        const { title, description, category, status, price, currency, country, images, video, document, coordinates } = req.body;

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
            country,
            images,
            video,
            agentId,
            agentName: `${agent.lastName} ${agent.firstName}`,
            agentContact: agent.mobileNumber,
            companyName: agent.companyName,
            agentProfilePicture: agent.profilePicture,
            document,
            coordinates,
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

        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;

        const agentProperties = await Property.find({ agentId: id }).sort({ createdAt: -1 });
        let agentRentProperties = await Property.find({ agentId: id, status: 'Rent' });
        let agentLeaseProperties = await Property.find({ agentId: id, status: 'Lease' });
        let agentSaleProperties = await Property.find({ agentId: id, status: 'Sale' });

        const totalPropertiesCount = await Property.countDocuments();

        const properties = await Property.find().skip(skip).limit(10);
        let rentProperties = await Property.find({ status: 'Rent' });
        let leaseProperties = await Property.find({ status: 'Lease' });
        let saleProperties = await Property.find({ status: 'Sale' });

        let lands = await Property.find({ category: 'Land' });
        let houses = await Property.find({ category: 'Houses' });
        let shopSpaces = await Property.find({ category: 'Shop Spaces' });
        let officeBuildings = await Property.find({ category: 'Office Building' });
        let industrialBuildings = await Property.find({ category: 'Industrial Building' });

        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

        rentProperties = shuffleArray(rentProperties);
        leaseProperties = shuffleArray(leaseProperties);
        saleProperties = shuffleArray(saleProperties);
        lands = shuffleArray(lands);
        houses = shuffleArray(houses);
        shopSpaces = shuffleArray(shopSpaces);
        officeBuildings = shuffleArray(officeBuildings);
        industrialBuildings = shuffleArray(industrialBuildings);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const newListings = await Property.find({ createdAt: { $gte: oneMonthAgo } });

        return res.status(200).json({
            agentProperties,
            numberOfProperties: agentProperties.length,
            propertiesForRent: rentProperties.length,
            propertiesForLease: leaseProperties.length,
            propertiesForSale: saleProperties.length,
            properties,
            agentRentProperties,
            agentLeaseProperties,
            agentSaleProperties,
            rentProperties,
            leaseProperties,
            saleProperties,
            lands,
            houses,
            shopSpaces,
            officeBuildings,
            industrialBuildings,
            newListings,
            currentPage: page,
            totalPages: Math.ceil(totalPropertiesCount / 10),
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
        const { title, description, category, status, price, currency, location, images, video, document } = req.body;

        const isValidId = isValidObjectId(propertyId);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        if (!title || !description || !category || !status || !price || !currency || !location || images.length === 0 || !video || !document) {
            const property = await Property.findByIdAndUpdate(propertyId, {
                $push: { savedBy: req.user._id }
            }, { new: true });

            return res.status(200).json({ message: 'Property saved successfully', property });
        }

        const property = await Property.findByIdAndUpdate(propertyId, {
            title,
            description,
            category,
            status,
            price,
            currency,
            location,
            images,
            video,
            document
        }, { new: true });

        return res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}

const searchProperty = async (req, res) => {
    try {
        const { title, country, category, status, minPrice, maxPrice } = req.query;

        if (!country || !category || !status || !minPrice || !maxPrice) {
            const properties = await Property.find({ title: { $regex: title, $options: 'i' } });
            return res.status(200).json({
                count: properties.length,
                properties,
            });
        }

        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (country) {
            query.country = { $regex: country, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        const minPriceNumber = parseFloat(minPrice);
        const maxPriceNumber = parseFloat(maxPrice);

        if (!isNaN(minPriceNumber) || !isNaN(maxPriceNumber)) {
            query.price = {};
            if (!isNaN(minPriceNumber)) {
                query.price.$gte = minPriceNumber;
            }
            if (!isNaN(maxPriceNumber)) {
                query.price.$lte = maxPriceNumber;
            }
        }

        if (status) {
            query.status = status;
        }

        const properties = await Property.find(query);

        return res.status(200).json({
            count: properties.length,
            properties,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};


const deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;

        const isValidId = isValidObjectId(propertyId);

        if (!isValidId) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const property = await Property.findByIdAndDelete(propertyId);

        return res.status(200).json({ message: 'Property deleted successfully', property });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

module.exports = {
    uploadProperty,
    getProperties,
    getProperty,
    updateProperty,
    searchProperty,
    deleteProperty,
}