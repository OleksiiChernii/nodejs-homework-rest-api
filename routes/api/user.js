const express = require('express');
const {register, login, logout, current} = require('../../models/user');
const validate = require('../../validation/auth')

const router = express.Router();

router.post('/register', validate(), register);

router.post('/login', validate(), login);

router.post('/logout', validate(), logout)

router.get('/current', validate(), current)

module.exports = router;