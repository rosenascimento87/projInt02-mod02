const mongoose = require('mongoose');
const Animal = require('./models/Animal');
const Species = require('./models/Species');

async function getAnimalsBySpecies(speciesValue) {
  try {
    await mongoose.connect('mongodb://localhost:27017/alertpert', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Encontrar a espécie pelo valor
    const species = await Species.findOne({ value: speciesValue });
    if (!species) {
      console.log('Espécie não encontrada');
      return [];
    }

    // Encontrar animais dessa espécie
    const animals = await Animal.find({ species: species._id })
      .populate('species', 'value descricao icon')
      .populate('gender', 'value descricao icon')
      .populate('size', 'value descricao icon')
      .populate('status', 'value descricao icon');

    console.log(`Animais da espécie ${species.descricao}:`, animals);
    return animals;
  } catch (error) {
    console.error('Erro ao buscar animais por espécie:', error);
    return [];
  } finally {
    await mongoose.disconnect();
  }
}

// Exemplo de uso: buscar todos os cachorros
getAnimalsBySpecies('dog');