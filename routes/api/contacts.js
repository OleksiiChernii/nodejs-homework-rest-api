const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  listContacts()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(404).json(error));
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  getContactById(contactId)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(404).json(error));
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.query;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "missing required name field" });
    return;
  }
  addContact({ name, email, phone })
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(404).json(error));
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  removeContact(contactId)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(404).json(error));
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.query;
  if (!name && !email && !phone) {
    res.status(400).json({ message: "missing fields" });
  }
  updateContact(contactId, { name, email, phone })
    .then(data => res.status(200).json(data))
    .catch((error) => res.status(404).json(error));
});

module.exports = router;
