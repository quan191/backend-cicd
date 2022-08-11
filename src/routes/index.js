const express = require('express');
const checkRoute = require('./check.route');

const router = express.Router();

router.use('/', checkRoute );

module.exports = router;
