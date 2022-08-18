const express = require('express');
const router = express.Router();
const controller = require('../controller/mainController')

// routes
router.get('/',controller.loginPage);
router.post('/validate',controller.validate);
router.get('/choose',controller.choosePage);
router.get('/count',controller.countPage);
router.get('/open-request',controller.openReqPage);
router.get('/warehouses',controller.getWhs);
router.get('/warehouses-info',controller.getWhsOnfo);
router.get('/create-table/:id',controller.getTable);
router.post('/check/:id/:status/:counter',controller.changeStatus);
router.get('/report',controller.getReport);
router.post('/send/:date/:name/:note',controller.sendData);
router.post('/select-all/:status',controller.changeAllStatus);
router.post('/change-allow/:type/:id',controller.changeAllow);
router.get('/logout',controller.logOut);

module.exports = router