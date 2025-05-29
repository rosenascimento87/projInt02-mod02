db.createUser({
    user: process.env.MONGO_USER, 
    pwd: process.env.MONGO_PASS,
    roles: [
      { role: 'root', db: 'admin' }
    ]
  });
  