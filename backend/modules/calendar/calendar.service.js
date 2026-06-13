import { listImagesForPlans } from "../chat/index.js";
import { listAccessiblePlans } from "../plans/index.js";

export const getCalendarForUser = async (userId) => {
  const plans = await listAccessiblePlans(userId).sort({ date: -1 });
  const images = await listImagesForPlans(plans.map((plan) => plan._id));

  const imagesByPlan = images.reduce((grouped, image) => {
    const planId = image.plan.toString();
    grouped[planId] = grouped[planId] || [];
    grouped[planId].push(image);
    return grouped;
  }, {});

  return plans
    .map((plan) => ({
      ...plan.toObject(),
      images: imagesByPlan[plan._id.toString()] || [],
    }))
    .filter((plan) => plan.images.length > 0);
};
