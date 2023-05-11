const service = require("../service");

const listContacts = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const contacts = await service.getContacts(ownerId);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: ownerId } = req.user;
  try {
    const contact = await service.getContactById(contactId, ownerId);
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
  const { id: ownerId } = req.user;
  try {
    const contact = await service.removeContact(contactId, ownerId);
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
    const { id: ownerId } = req.user;
    const contact = req.body;
    contact.owner = ownerId;
    const createdContact = await service.createContact(req.body);
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: ownerId } = req.user;
  try {
    const contact = await service.updateContact(contactId, ownerId, req.body);
    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { id: ownerId } = req.user;
  try {
    const contact = await service.updateFavoriteContact(contactId, ownerId, favorite);
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
