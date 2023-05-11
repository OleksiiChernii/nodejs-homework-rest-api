const express = require('express');
const {register, login, logout, current} = require('../../models/user');
const validate = require('../../validation/auth');
const validateToken = require('../../middleware/auth')

const router = express.Router();

router.post('/register', validate(), register);

router.post('/login', validate(), login);

router.post('/logout', validateToken, logout)

router.get('/current', validateToken, current)

module.exports = router;