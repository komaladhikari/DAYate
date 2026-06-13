import DatePlan from "./plan.model.js";

export const findAccessiblePlan = ({ planId, userId }) =>
  DatePlan.findOne({
    _id: planId,
    $or: [{ createdBy: userId }, { partner: userId }],
  });

export const findOwnedPlan = ({ planId, userId }) =>
  DatePlan.findOne({
    _id: planId,
    createdBy: userId,
  });

export const listAccessiblePlans = (userId) =>
  DatePlan.find({
    $or: [{ createdBy: userId }, { partner: userId }],
  });
