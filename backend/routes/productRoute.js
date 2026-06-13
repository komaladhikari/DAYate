
import express from 'express';
import {addDates, listDates, removeDates} from '../controllers/productController.js';
import upload from '../shared/middleware/multer.js';
import authUser from '../shared/middleware/authUser.js';

const productRouter = express.Router();

productRouter.post('/add',upload.fields([{name: 'image1', maxCount: 1},{name: 'image2', maxCount: 1}]), addDates.products);
productRouter.get('/list', listDates.products);
productRouter.post('/remove', authUser, removeDates.products);

export default productRouter;
