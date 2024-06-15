import Message from "../db/models/Message";
import User from "../db/models/User";
import { io } from "../socket/socket";

const sendMessage = async (req, res) => {
  const { userId } = req.params;
  const { text } = req.body;
  const username = req.username;
  try {
    const recipient = await User.findOne({
      username: userId,
    }).exec();
    if (recipient) {
      const message = new Message({
        sender: username,
        recipient: recipient.username,
        text,
      });
      await message.save();
      io.to(recipient?.socketId).emit("message", message);
      res.status(201).send(message);
    } else {
      res.status(400);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    const recipient = await User.findOne({
      username: message.recipient,
    }).exec();
    const twoMinutesAgo = new Date(new Date().getTime() - 2 * 60 * 1000);
    console.log(
      id,
      { message, twoMinutesAgo },
      message.createdAt > twoMinutesAgo
    );
    if (message && message.createdAt > twoMinutesAgo) {
      await message.deleteOne();
      io.to(recipient?.socketId).emit("deleteMessage", id);
      res.status(200).json({ message: "Message deleted" });
    } else {
      return res
        .status(400)
        .json({
          message: "Message is older than 2 minutes and cannot be deleted.",
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const username = req.username;
  try {
    const msgs = await Message.find({
      $or: [
        { sender: userId, recipient: username },
        { sender: username, recipient: userId },
      ],
    }).exec();

    res.json([...msgs]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { sendMessage, deleteMessage, getMessages };
