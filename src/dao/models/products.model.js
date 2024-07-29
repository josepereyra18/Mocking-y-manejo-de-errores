import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String},
    description: { type: String},
    price: { type: Number},
    code: { type: String, max: 100 },
    stock: { type: Number,},
    status: { type: Boolean},
    category: { type: String},
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;