const mongoose = require('mongoose');
const Animal = require('./models/Animal');
const Species = require('./models/Species');
const Gender = require('./models/Gender');
const Size = require('./models/Size');
const Status = require('./models/Status');
const User = require('./models/User');

// Dados de exemplo
const sampleUsers = [
  {
    username: 'joaosilva',
    email: 'joao@example.com',
    password: 'senhaSegura123' 
  },
  {
    username: 'mariasouza',
    email: 'maria@example.com',
    password: 'outraSenha456'
  }
];

const sampleSpecies = [
  { value: 'dog', descricao: 'Cachorro', icon: '🐕' },
  { value: 'cat', descricao: 'Gato', icon: '🐈' },
  { value: 'bird', descricao: 'Pássaro', icon: '🐦' }
];

const sampleGenders = [
  { value: 'male', descricao: 'Macho', icon: '♂' },
  { value: 'female', descricao: 'Fêmea', icon: '♀' },
  { value: 'unknown', descricao: 'Desconhecido', icon: '?' }
];

const sampleSizes = [
  { value: 'small', descricao: 'Pequeno', icon: 'S' },
  { value: 'medium', descricao: 'Médio', icon: 'M' },
  { value: 'large', descricao: 'Grande', icon: 'L' }
];

const sampleStatuses = [
  { value: 'lost', descricao: 'Perdido', icon: '🔍' },
  { value: 'found', descricao: 'Encontrado', icon: '🏠' },
  { value: 'adoption', descricao: 'Para adoção', icon: '❤️' }
];

const sampleAnimals = [
  {
    name: 'Rex',
    age: 3,
    color: 'Marrom',
    weight: 15,
    description: 'Cachorro muito brincalhão, desapareceu perto do parque central.',
    location: 'Parque Central, São Paulo',
    images: [{ url: 'http://example.com/rex1.jpg', isPrimary: true }]
  },
  {
    name: 'Mimi',
    age: 2,
    color: 'Branco e preto',
    weight: 4,
    description: 'Gata dócil, encontrada na rua das Flores.',
    location: 'Rua das Flores, Rio de Janeiro',
    images: [{ url: 'http://example.com/mimi1.jpg', isPrimary: true }]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/alertpert', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Limpar coleções existentes
    await User.deleteMany({});
    await Species.deleteMany({});
    await Gender.deleteMany({});
    await Size.deleteMany({});
    await Status.deleteMany({});
    await Animal.deleteMany({});

    // Inserir usuários
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`${insertedUsers.length} usuários inseridos`);

    // Inserir dados de espécies, gêneros, tamanhos e status
    const insertedSpecies = await Species.insertMany(sampleSpecies);
    const insertedGenders = await Gender.insertMany(sampleGenders);
    const insertedSizes = await Size.insertMany(sampleSizes);
    const insertedStatuses = await Status.insertMany(sampleStatuses);

    // Preparar animais com referências aos outros modelos
    const preparedAnimals = sampleAnimals.map((animal, index) => ({
      ...animal,
      species: insertedSpecies[index % insertedSpecies.length]._id,
      gender: insertedGenders[index % insertedGenders.length]._id,
      size: insertedSizes[index % insertedSizes.length]._id,
      status: insertedStatuses[index % insertedStatuses.length]._id,
      breed: index === 0 ? 'Labrador' : 'SRD',
      createdBy: insertedUsers[index % insertedUsers.length]._id
    }));

    // Inserir animais
    const insertedAnimals = await Animal.insertMany(preparedAnimals);
    console.log(`${insertedAnimals.length} animais inseridos`);

    console.log('Banco de dados populado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();