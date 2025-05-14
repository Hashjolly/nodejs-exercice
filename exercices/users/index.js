const http = require('http');
const url = require('url');
const querystring = require('querystring');
const readline = require('readline');
require('dotenv').config();

const { 
  readUsers, 
  writeUsers, 
  generateHomePage, 
  generateUserDetailPage, 
  generateFormPage 
} = require('./utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PORT = process.env.PORT || 3000;

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsedBody = querystring.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    if (pathname === '/' && req.method === 'GET') {
      const users = await readUsers();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateHomePage(users));
    }
    
    else if (pathname.startsWith('/user/') && req.method === 'GET') {
      const userName = decodeURIComponent(pathname.replace('/user/', ''));
      const users = await readUsers();
      const user = users.find(u => u.nom === userName);

      if (user) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateUserDetailPage(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Utilisateur non trouvé</h1><a href="/">Retour à l\'accueil</a>');
      }
    }
    
    else if (pathname === '/form' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateFormPage());
    }
    
    else if (pathname === '/add-user' && req.method === 'POST') {
      const formData = await parseBody(req);
      
      if (!formData.nom || !formData.email) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateFormPage('Tous les champs sont obligatoires'));
        return;
      }
      
      const newUser = {
        nom: formData.nom,
        email: formData.email,
        role: "utilisateur"
      };
      
      const users = await readUsers();
      
      if (users.some(user => user.email === newUser.email)) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(generateFormPage('Cet email est déjà utilisé'));
        return;
      }
      
      users.push(newUser);
      await writeUsers(users);
      
      res.writeHead(302, { 'Location': '/' });
      res.end();
    }
    
    else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Page non trouvée</h1><a href="/">Retour à l\'accueil</a>');
    }
  } catch (error) {
    console.error('Erreur:', error);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Erreur interne du serveur</h1><a href="/">Retour à l\'accueil</a>');
  }
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}/`);
  
  rl.question('Appuyez sur "q" puis Entrée pour arrêter le serveur: ', (answer) => {
    if (answer.toLowerCase() === 'q') {
      console.log('Arrêt du serveur...');
      server.close(() => {
        console.log('Serveur arrêté');
        rl.close();
        process.exit(0);
      });
    }
  });
});

process.on('SIGINT', () => {
  console.log('\nArrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    rl.close();
    process.exit(0);
  });
});
