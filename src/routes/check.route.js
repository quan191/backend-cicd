const express = require('express');
const {body, validationResult, param} = require("express-validator");
const checkController = require("../controllers/check.controller");
const router = express.Router();

router.get('/v0/getData', checkController.getData);
module.exports = router;

