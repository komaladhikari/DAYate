import jwt from "jsonwebtoken";
import userModel from "./user.model.js";
import pendingRegistrationModel from "./pendingRegistration.model.js";

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

export const findUserWithPasswordById = (id) => {
  return userModel.findById(id);
};

export const createUser = (userData) => {
  return new userModel(userData).save();
};

export const replacePendingRegistration = (email, registrationData) => {
  return pendingRegistrationModel.findOneAndUpdate(
    { email },
    registrationData,
    { upsert: true, returnDocument: "after", runValidators: true }
  );
};

export const findPendingRegistration = (email) => {
  return pendingRegistrationModel.findOne({ email });
};

export const incrementPendingAttempts = (id) => {
  return pendingRegistrationModel.findOneAndUpdate(
    {
      _id: id,
      attempts: { $lt: 5 },
      expiresAt: { $gt: new Date() },
    },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" }
  );
};

export const consumePendingRegistration = (id, codeHash) => {
  return pendingRegistrationModel.findOneAndDelete({
    _id: id,
    codeHash,
    attempts: { $lte: 5 },
    expiresAt: { $gt: new Date() },
  });
};

export const deletePendingRegistration = (id, codeHash) => {
  return pendingRegistrationModel.findOneAndDelete({
    _id: id,
    ...(codeHash ? { codeHash } : {}),
  });
};

export const updateUserById = (id, updateData) => {
  return userModel
    .findByIdAndUpdate(id, updateData, { returnDocument: "after" })
    .select("-password");
};

export const createToken = (id, role = "user") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || process.env.JWT_SECRET_KEY
  );
};
