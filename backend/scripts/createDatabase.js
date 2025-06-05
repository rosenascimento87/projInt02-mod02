const mongoose = require('mongoose');

async function createDatabase() {
  try {
    // Conectar ao MongoDB (o banco será criado automaticamente quando o primeiro documento for inserido)
    const conn = await mongoose.connect('mongodb://localhost:27017/alertpert', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database "alertpert" está pronto para uso (será criado quando o primeiro documento for inserido).');
    
    // Desconectar
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

createDatabase();