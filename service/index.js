const Contact = require("./schemas/contact");

const createContact = (body) => {
  return Contact.create(body);
};

const getContacts = (id) => {
  return Contact.find({ owner: id });
};

const getContactById = (id, owner) => {
  return Contact.findOne({ _id: id, owner });
};

const updateContact = (id, owner, body) => {
  return Contact.findOneAndUpdate({ _id: id, owner }, body, { new: true });
};

const removeContact = (id, owner) => {
  return Contact.findByIdAndRemove({ _id: id, owner });
};

const updateFavoriteContact = (id, owner, favorite) => {
  return Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    { new: true }
  );
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  removeContact,
  updateFavoriteContact,
};
