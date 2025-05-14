const http = require('node:http');
const { shuffle } = require('./src/utils');

let users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
];

const generateHTML = (usersList) => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des utilisateurs</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #1C1F33;
      }
      h1 {
        color: #fff;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        padding: 10px;
        margin-bottom: 5px;
        background-color: #f5f5f5;
        border-radius: 4px;
      }
      a {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 15px;
        background-color: #7699D4;
        color: black;
        text-decoration: none;
        border-radius: 4px;
      }
      a:hover {
        background-color: #6488C6;
      }
    </style>
  </head>
  <body>
    <h1>Liste des utilisateurs</h1>
    <ul>
      ${usersList.map(user => `<li>${user}</li>`).join('')}
    </ul>
    <a href="/shuffle">Mélanger les utilisateurs</a>
  </body>
  </html>
  `;
};

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(generateHTML(users));
  } else if (url === '/shuffle') {
    users = shuffle(users);
    res.writeHead(302, { 'Location': '/' });
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Page non trouvée</h1>');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}/`);
});
