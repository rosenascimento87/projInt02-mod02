const Animal = require('../models/animalModel');

const createAnimal = async (animalData, userId) => {
  const animal = new Animal({
    ...animalData,
    createdBy: userId
  });
  await animal.save();
  return animal;
};

const getAnimals = async (userId) => {
  return await Animal.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getAnimalById = async (id, userId) => {
  const animal = await Animal.findOne({ _id: id, createdBy: userId });
  if (!animal) {
    throw new Error('Animal não encontrado');	
  }
  return animal;
};

const updateAnimal = async (id, updates, userId) => {
  const animal = await Animal.findOneAndUpdate(
    { _id: id, createdBy: userId },
    updates,
    { new: true, runValidators: true }
  );
  
  if (!animal) {
    throw new Error('Animal não encontrado');
  }
  
  return animal;
};

const deleteAnimal = async (id, userId) => {
  const animal = await Animal.findOneAndDelete({ _id: id, createdBy: userId });
  if (!animal) {
    throw new Error('Animal não encontrado');
  }
  return animal;
};

module.exports = {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal
};