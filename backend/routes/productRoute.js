
import express from 'express';
import {addDates, listDates, removeDates} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add',upload.fields([{name: 'image1', maxCount: 1},{name: 'image2', maxCount: 1},{name: 'image3', maxCount: 1},{name: 'image4', maxCount: 1}]), addDates.products);
productRouter.get('/list', listDates.products);
productRouter.post('/remove', removeDates.products);

export default productRouter;