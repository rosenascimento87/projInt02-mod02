const animalService = require('../services/animalService');

const createAnimal = async (req, res) => {
  try {
    const animal = await animalService.createAnimal(req.body, req.user._id);
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAnimals = async (req, res) => {
  try {
    const animals = await animalService.getAnimals(req.user._id);
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnimal = async (req, res) => {
  try {
    const animal = await animalService.getAnimalById(req.params.id, req.user._id);
    res.json(animal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const animal = await animalService.updateAnimal(
      req.params.id,
      req.body,
      req.user._id
    );
    res.json(animal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAnimal = async (req, res) => {
  try {
    await animalService.deleteAnimal(req.params.id, req.user._id);
    res.json({ message: 'Animal removido' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  deleteAnimal
};