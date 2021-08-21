
var express = require('express');
var router = express.Router();
const nearmeController = require('../controllers/nearmeController');

router.get('/',nearmeController.show_NearMe)

router.get('/testing',nearmeController.show_Testing_NearMe)

router.get('/vaccine',nearmeController.show_Vaccine_NearMe)

router.get('/hospital',nearmeController.show_Hospital_NearMe)

router.post('/',nearmeController.change_Address)

module.exports = router;
