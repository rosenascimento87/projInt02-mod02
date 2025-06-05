# AlertaPet 🐾

## 📝 Descrição do Projeto

O **AlertaPet** é uma plataforma web desenvolvida para ajudar na notificação de extravio, localização e doação de animais, oferecendo:

- **Cadastro de animais desaparecidos, localizados e colocados para doação** com fotos e informações detalhadas
- **Sistema de autenticação** para usuários, Ongs e protetores de animais

Tecnologias utilizadas:
- **Frontend**: Angular (SPA estática)
- **Backend**: Node.js + Express (API REST)
- **Banco de Dados**: MongoDB
- **Infraestrutura**: Docker + Docker Compose

---

## 🛠️ Infraestrutura

```text

alertapet/
├── backend/              # API Node.js
│   ├── controllers/      # Lógica das rotas
│   ├── models/           # Schemas do MongoDB
│   ├── routes/           # Definição de endpoints
│   └── app.js            # Ponto de entrada
│
├── frontend/             # Build Angular
│   └── browser/          # Arquivos estáticos (HTML/JS/CSS)
│
├── mongo_data/           # Volume persistente do MongoDB
├── docker-compose.yml    # Orquestração de containers
└── Dockerfile            # Configuração da aplicação


🚀 Como Executar

Pré-requisitos:

Docker 20+

Docker Compose 2.2+

Passo a Passo:

Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd alertapet
Configure as variáveis de ambiente
Crie um arquivo .env na raiz com:```


# MongoDB
MONGO_USER=admin
MONGO_PASS=senhaSegura123
MONGO_DATA=alertapet_db
MONGO_URL=mongodb://${MONGO_USER}:${MONGO_PASS}@mongodb:27017/${MONGO_DATA}?authSource=admin

# Node.js
NODE_ENV=production
JWT_SECRET=seuSegredoJWT
Inicie os containers

```bash
docker-compose up -d --build```



Acesse a aplicação

Frontend: http://localhost:4200

API: http://localhost:4501/api

🔧 Comandos Úteis

```bash #Comando	Descrição

docker-compose logs -f	Ver logs em tempo real
docker-compose down -v	Parar e remover volumes
docker-compose restart api	Reiniciar apenas o backend```



Portas expostas:

4200: Frontend Angular

4501: API Node.js

27017: MongoDB (apenas interno)

📦 Dependências Principais

Backend
Express
Mongoose
JWT
Bcrypt

Frontend

Angular (v15+)
Font Awesome

Leaflet (mapas)

📌 Observações

O frontend já inclui:

Build de produção otimizado
Assets pré-compilados

Configuração de proxy para a API

O MongoDB é persistido no volume mongo_data/

Para desenvolvimento local, modifique:

frontend/browser/config.json (URL da API)

backend/.env (credenciais locais)


👉 **Teste agora mesmo a aplicação:**  
🌐 [Clique aqui para acessar](http://rosepael.com)


Contribua com sugestões ou melhorias! 💡  
Juntos, podemos fazer a diferença na vida de muitos animais! ❤️