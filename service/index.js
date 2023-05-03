const Contact = require("./schemas/contact");

const createContact = (body) => {
  return Contact.create(body);
};

const getContacts = () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateFavoriteContact = (id, favorite) => {
  return Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  removeContact,
  updateFavoriteContact,
};
