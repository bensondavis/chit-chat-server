import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const ContactSchema = new Schema({
  contactId: { type: String },
});

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  socketId: { type: String, default: null },
  contactList: {type: [ContactSchema], default: []},
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

export default User;
