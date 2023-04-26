const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.format({
  dir: "./models",
  base: "contacts.json",
});

const listContacts = async () => {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    return JSON.parse(contactsBuffer.toString());
  } catch (error) {
    return { message: error.message };
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer.toString());
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      return contact;
    }
    throw Error("NotFound");
  } catch (error) {
    return { message: error.message };
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer.toString());
    const contact = contacts.find((c) => c.id === contactId);
    const contactsFiltered = contacts.filter((c) => c.id !== contactId);
    if (!contact) {
      throw Error("NotFound");
    }
    await fs.writeFile(contactsPath, JSON.stringify(contactsFiltered));
    return { message: "contact deleted" };
  } catch (error) {
    return { message: error.message };
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer.toString());
    const newContact = {
      id: uuid(),
      name,
      email,
      phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]));
    return newContact;
  } catch (error) {
    return { message: error.message };
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactsBuffer = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsBuffer.toString());
    if(contacts.every(c => c.id !== contactId)){
      throw Error('NotFound')
    }
    const updatedContacts = contacts.map(c => {
      if(c.id !== contactId){
        return c;
      }
      for(const prop in body){
        if(body[prop]){
          c[prop] = body[prop];
        }
      }
      return c;
    });
    fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return {message: 'Contact updated'}
  } catch (error) {
        return { message: error.message };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
