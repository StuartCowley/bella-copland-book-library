const express = require('express');

const router = express.Router();

const readerController = require('../controllers/reader');

router 
    .route('/')
    .post(readerController.create);

module.exports = router;