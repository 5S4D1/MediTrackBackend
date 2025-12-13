const remindersService = require("../services/reminders.service");

exports.createReminder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body;

    const reminderId = await remindersService.createReminder(uid, data);

    res.json({
      success: true,
      message: "Reminder created",
      reminderId
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create reminder" });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const uid = req.user.uid;
    const reminders = await remindersService.getReminders(uid);

    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ error: "Failed to load reminders" });
  }
};

exports.getReminderById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    const reminder = await remindersService.getReminder(uid, id);

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ success: true, reminder });

  } catch (error) {
    res.status(500).json({ error: "Failed to load reminder" });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;
    const data = req.body;

    await remindersService.updateReminder(uid, id, data);

    res.json({ success: true, message: "Reminder updated" });

  } catch (error) {
    res.status(500).json({ error: "Failed to update reminder" });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    await remindersService.deleteReminder(uid, id);

    res.json({ success: true, message: "Reminder deleted" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};
