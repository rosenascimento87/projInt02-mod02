const mongoose = require('mongoose');
const Animal = require('./models/Animal');
const Species = require('./models/Species');
const Gender = require('./models/Gender');
const Size = require('./models/Size');
const Status = require('./models/Status');

async function createCollections() {
  try {
    await mongoose.connect('mongodb://localhost:27017/alertpert', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Criar coleções (isso acontecerá automaticamente quando os primeiros documentos forem inseridos)
    console.log('Coleções serão criadas automaticamente quando os primeiros documentos forem inseridos.');
    
    // Podemos forçar a criação chamando createCollection()
    await Animal.createCollection();
    await Species.createCollection();
    await Gender.createCollection();
    await Size.createCollection();
    await Status.createCollection();
    
    console.log('Coleções criadas com sucesso!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao criar coleções:', error);
    process.exit(1);
  }
}

createCollections();