const service = require("../service");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await service.getContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await service.getContactById(contactId);
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
    const contact = await service.removeContact(contactId);
    if (!contact) {
      throw Error("NotFound");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await service.createContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    await service.updateContact(contactId, req.body);
    const updatedContact = await service.getContactById(contactId);
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const contact = await service.updateFavoriteContact(contactId, favorite);
    if (!contact) {
      throw Error("NotFound");
    }
    res.status(200).json(contact);
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
  updateFavorite,
};
