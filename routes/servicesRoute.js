const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cors = require('cors')
//router.use(cors)
//const serviceController = require('../controllers/servicecontroller');
const { createService, getServices, getServicesByService, getServiceImage, getServicesById} = require('../controllers/servicecontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/', upload.single('image') ,protect, adminOnly, createService);
router.get('/',protect, getServices);
router.get('/service', protect, getServicesByService);
router.get('/:id/image', getServiceImage);
router.get('/:id', protect, getServicesById);

module.exports = router;
