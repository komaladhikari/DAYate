// fucntion for adding restraunts and cafes
import {v2 as cloudinary} from 'cloudinary';
import productModel from '../modules/plans/plan.model.js';
import Message from "../models/messageModel.js";

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

                res.json({success: true, message: "Date plan added successfully"})
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
    products: async (req, res) => {
        try {
            const plan = await productModel.findOne({
                _id: req.body.id,
                createdBy: req.userId,
            });

            if (!plan) {
                return res.json({ success: false, message: "Date plan not found" });
            }

            await Promise.all([
                Message.deleteMany({ plan: plan._id }),
                plan.deleteOne(),
            ]);

            res.json({ success: true, message: "Date plan deleted" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    },
};

export { addDates, listDates, removeDates };
