import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    role: {type: String, enum: ["user", "business"], default: "user"},
    businessName: {type: String},
    businessType: {type: String, enum: ["restaurant", "cafe"]},
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: function () {
            return this.role === "business" ? "pending" : undefined;
        },
    },
    approvalReviewedAt: {type: Date},
    profilePicture : {type: String},
    bio : {type: String},
    phone : {type: String},
    address: {type: String},
    timezone: {type: String},
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
