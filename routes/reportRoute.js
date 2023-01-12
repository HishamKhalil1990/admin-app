const express = require('express');
const router = express.Router();
const controller = require('../controller/reportController')

router.get('/',controller.salesChooseWhs);
router.get('/report',controller.salesReportPage);
router.post('/data/:start/:end/:whs',controller.salesReportData);

module.exports = router