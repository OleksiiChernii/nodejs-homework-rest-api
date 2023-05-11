const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
} = require("../../models/contacts");
const validateToken = require("../../middleware/auth");

const router = express.Router();

const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("../../validation/validation");

router.get("/", validateToken, listContacts);

router.get("/:contactId", validateToken, getContactById);

router.post("/", validateToken, validateCreateContact(), addContact);

router.delete("/:contactId", validateToken, removeContact);

router.put(
  "/:contactId",
  validateToken,
  validateUpdateContact(),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  validateToken,
  validateUpdateFavorite(),
  updateFavorite
);

module.exports = router;
