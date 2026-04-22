const { generateTripPlanAI } = require("../services/aiTripService");

const generateTripController = async (req, res, next) => {
  try {
    const { from, to, travelDate, date, budget } = req.body;
    const resolvedDate = travelDate || date;

    if (!from || !to || !resolvedDate) {
      return res.status(400).json({ message: "From, To and Travel Date are required" });
    }

    const result = await generateTripPlanAI({
      from: String(from).trim(),
      to: String(to).trim(),
      travelDate: String(resolvedDate).trim(),
      budget: budget ? Number(budget) : null,
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateTripController,
};
