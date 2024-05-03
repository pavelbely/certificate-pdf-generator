import mongoose from 'mongoose';

const BuyerSchema = new mongoose.Schema({
    nameRu:{type:String, required:true, min:2},
    nameHe:{type:String, required:false, min:2},
})

const Buyer = mongoose.model("Buyer",BuyerSchema,'buyers');

export default Buyer;