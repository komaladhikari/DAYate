// fucntion for adding restraunts and cafes
import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

 const addDates = {products: async (req, res) => {
        try{
                const {name, location, description} = req.body;

                // safe access to uploaded files
                const image1 = req.files?.image1?.[0] ?? null;
                const image2 = req.files?.image2?.[0] ?? null;

                const images = [image1, image2].filter(Boolean);

                let imagesUrl = [];
                if (images.length > 0) {
                    imagesUrl = await Promise.all(
                        images.map(async(item) => {
                            const result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                            return result.secure_url;
                        })
                    );
                }

                console.log(name, location, description)
                console.log (imagesUrl)

                const productData = {
                    name, location, description,
                    images: imagesUrl,
                    date: Date.now()
                }
                console.log(productData)

                const product = new productModel(productData);
                await product.save();

                res.json({sucess: true, message: "Date plan added successfully"})
        }
        catch(error) {
                console.log(error);
                res.json({success: false, message: error.message})

        }
}}; 


// function for listing cafes and restaurants
const listDates = {
    products: async (req, res) => {
        try {
            const products = await productModel.find({});
            res.json({ success: true, data: products });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
};

// function for removing restaurants and cafes
const removeDates = {
    products: (req, res) => {
        res.json({ success: true, message: 'remove endpoint' });
    },
};

export { addDates, listDates, removeDates };