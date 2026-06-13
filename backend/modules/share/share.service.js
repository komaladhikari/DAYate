import {
  findUserByEmailCaseInsensitive,
  findUserById,
} from "../auth/index.js";
import { createSystemMessage } from "../chat/index.js";
import { findOwnedPlan } from "../plans/index.js";
import sendEmail from "../../shared/utils/sendEmail.js";

const buildInvitationHtml = (plan) => {
  const activitiesHtml = plan.activities
    .map(
      (activity) => `
        <div style="margin-bottom:16px;">
          <h3>${activity.title}</h3>
          <p><strong>Type:</strong> ${activity.type}</p>
          <p><strong>Time:</strong> ${activity.time}</p>
          <p><strong>Location:</strong> ${activity.location}</p>
          <p><strong>Booking Status:</strong> ${activity.bookingStatus}</p>
        </div>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color:#333;">
      <h2>You have a DAYate planned 💛</h2>
      <p>Someone special has planned something for you using DAYate.</p>
      <h3>${plan.name}</h3>
      <p><strong>Date:</strong> ${new Date(plan.date).toDateString()}</p>
      <hr />
      ${activitiesHtml}
      <p style="margin-top:24px;">
        Sign in to DAYate to chat and receive every update to this date.
      </p>
      <p>— DAYate</p>
    </div>
  `;
};

export const sharePlanWithPartner = async ({
  planId,
  lovedOneEmail,
  userId,
}) => {
  const normalizedEmail = lovedOneEmail?.trim().toLowerCase();
  const plan = await findOwnedPlan({ planId, userId });

  if (!plan) {
    throw new Error("Plan not found");
  }

  const [partner, creator] = await Promise.all([
    findUserByEmailCaseInsensitive(normalizedEmail),
    findUserById(userId),
  ]);

  if (!partner) {
    throw new Error(
      "Your loved one needs a DAYate account before they can join the private chat"
    );
  }

  if (partner._id.equals(userId)) {
    throw new Error("Invite your loved one's account, not your own");
  }

  if (plan.partner && !plan.partner.equals(partner._id)) {
    throw new Error("This date is already shared with another partner");
  }

  plan.partner = partner._id;
  plan.sharedWithEmail = partner.email;
  plan.sharedAt = new Date();
  await plan.save();

  await sendEmail({
    to: partner.email,
    subject: `${plan.name} 💛`,
    html: buildInvitationHtml(plan),
  });

  await createSystemMessage(
    plan._id,
    `${creator?.name || "Your partner"} shared this date with ${partner.name}.`
  );

  return plan;
};
