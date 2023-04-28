const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.format({
  dir: "./models",
  base: "contacts.json",
});

const listContacts = async (req, res, next) => {
  getContacts()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(404).json({ message: error.message }));
};

const getContacts = async () => {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    return JSON.parse(contactsBuffer.toString());
  } catch (error) {
    throw Error(error.message);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id === contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw Error("NotFound");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contacts = await getContacts();
    const contact = contacts.find((c) => c.id === contactId);
    const contactsFiltered = contacts.filter((c) => c.id !== contactId);
    if (!contact) {
      throw Error("NotFound");
    }
    await fs.writeFile(contactsPath, JSON.stringify(contactsFiltered));
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const body = { name, email, phone };
  if (!body.name || !body.email || !body.phone) {
    const fieldNames = Object.keys(body).filter((field) => !body[field]);
    const message =
      "missing required " +
      (fieldNames.length > 1
        ? fieldNames.join(", ") + " fields"
        : fieldNames.toString().concat(" field"));
    res.status(400).json({ message });
    return;
  }
  try {
    const contacts = await getContacts();
    const newContact = {
      id: uuid(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]));
    res.status(201).json(newContact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    res.status(400).json({ message: "missing fields" });
  }
  try {
    const contacts = await getContacts();
    if (contacts.every((c) => c.id !== contactId)) {
      throw Error("NotFound");
    }
    const updatedContacts = contacts.map((c) => {
      if (c.id !== contactId) {
        return c;
      }
      for (const prop in req.body) {
        if (req.body[prop]) {
          c[prop] = req.body[prop];
        }
      }
      return c;
    });
    fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    res.status(200).json({ message: "Contact updated" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
