const express = require('express');
const auth = require('../middlewares/auth');
const animalController = require('../controllers/animalController');

const router = express.Router();

router.use(auth);

router.post('/', animalController.createAnimal);
router.get('/', animalController.getAnimals);
router.get('/:id', animalController.getAnimal);
router.put('/:id', animalController.updateAnimal);
router.delete('/:id', animalController.deleteAnimal);

module.exports = router;