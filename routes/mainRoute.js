const express = require('express');
const router = express.Router();
const controller = require('../controller/mainController')

// routes
router.get('/',controller.mainPage);
router.get('/warehouses',controller.getWhs);
router.get('/create-table/:id',controller.getTable);
router.post('/check/:id/:status/:counter',controller.changeStatus);
router.get('/report',controller.getReport);
router.post('/send/:date/:name/:note',controller.sendData);
router.post('/select-all/:status',controller.changeAllStatus);

module.exports = router