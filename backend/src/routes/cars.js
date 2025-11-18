const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');

router.get('/', carsController.listCars);

router.get('/:id', carsController.getCarById);

router.delete('/:id', carsController.deleteCar);

module.exports = router;
