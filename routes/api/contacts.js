const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
} = require("../../models/contacts");

const router = express.Router();

const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("../../validation/validation");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", validateCreateContact(), addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", validateUpdateContact(), updateContact);

router.patch("/:contactId/favorite", validateUpdateFavorite(), updateFavorite);

module.exports = router;
