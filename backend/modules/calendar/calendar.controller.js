import { getCalendarForUser } from "./calendar.service.js";

const listCalendar = async (req, res) => {
  try {
    const calendar = await getCalendarForUser(req.userId);
    res.json({ success: true, data: calendar });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listCalendar };
