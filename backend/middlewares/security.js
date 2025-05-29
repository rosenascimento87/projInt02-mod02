app.use((req, res, next) => {
    const blockedPaths = [
      '/wp-admin', 
      '/wp-content',
      '/wp-includes',
      '/wp-login.php',
      '/administrator',
      '/.env',
      '/config.php',
      '/xmlrpc.php'
    ];
    
    const userAgent = req.headers['user-agent'] || '';
    const path = req.path.toLowerCase();
    
    if (blockedPaths.some(blockedPath => path.includes(blockedPath))) {
      console.log(`Bloqueado acesso suspeito a: ${path}`);
      return res.status(403).send('Acesso não autorizado');
    }
    
    // Bloqueia user-agents suspeitos
    if (userAgent.includes('sqlmap') || 
        userAgent.includes('nikto') || 
        userAgent.includes('acunetix') ||
        userAgent.includes('wpscan')) {
      console.log(`Bloqueado user-agent suspeito: ${userAgent}`);
      return res.status(403).send('Acesso não autorizado');
    }
    
    next();
  });