import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    reaction: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Message = model("Message", MessageSchema);

export default Message;
