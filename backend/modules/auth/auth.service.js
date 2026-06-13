import jwt from "jsonwebtoken";
import userModel from "./user.model.js";

export const findUserByEmail = (email) => {
  return userModel.findOne({ email });
};

export const findUserByEmailCaseInsensitive = (email) =>
  userModel
    .findOne({ email })
    .collation({ locale: "en", strength: 2 });

export const findUserById = (id) => {
  return userModel.findById(id).select("-password");
};

export const createUser = (userData) => {
  return new userModel(userData).save();
};

export const updateUserById = (id, updateData) => {
  return userModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .select("-password");
};

export const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || process.env.JWT_SECRET_KEY
  );
};
