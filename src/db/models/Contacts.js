import { model, Schema } from "mongoose";

const ContactsSchema = new Schema({
  user: { type: String, unique: true, required: true },
  contactList: [String],
});
