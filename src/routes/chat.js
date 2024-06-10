import express from "express";
import Message from "../db/models/Message";
const router = express.Router();

// router.post('/message', async (req, res) => {
//   const { sender, content } = req.body;
//   try {
//     const message = new Message({ sender, content });
//     await message.save();
//     res.status(201).json({ message });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.delete('/message/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Message.findByIdAndDelete(id);
//     res.json({ message: 'Message deleted' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;