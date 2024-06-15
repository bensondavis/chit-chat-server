import User from "../db/models/User";

const getContacts = async (req, res) => {
  const username = req.username;

  try {
    const user = await User.findOne({ username: username }).exec();

    const contacts = [];

    user.contactList.forEach((contact) => contacts.push(contact.contactId));

    res.status(200).send(contacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addContacts = async (req, res) => {
  const { id } = req.params;
  const username = req.username;

  if(username === id) {
    return res.status(418).json({message: "Cannot add same user"});
  }

  try {
    const currentUser = await User.findOne({ username: username }).exec();
    const user = await User.findOne({ username: id }).exec();
    if (user) {
      const UserAlreadyInContact = currentUser.contactList.some(
        (contact) => contact.contactId === id
      );
      if (!UserAlreadyInContact) {
        currentUser.contactList.push({ contactId: id });
        currentUser.save();
      } else {
        return res.status(409).json({message: "User already added"});
      }

      const UserAlreadyInRecipientsContact = user.contactList.some(
        (contact) => contact.contactId === username
      );
      if (!UserAlreadyInRecipientsContact) {
        user.contactList.push({ contactId: username });
        user.save();
      }
      return res.json({ message: "User added successfully" });
    } else {
      console.log("no user found");
      return res.status(400).json({ error: "no user found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getContacts, addContacts };
