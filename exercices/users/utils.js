const fs = require('fs').promises;
const path = require('path');

const readUsers = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'users.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des utilisateurs:', error);
    return [];
  }
};

const writeUsers = async (users) => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'users.json'), 
      JSON.stringify(users, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture des utilisateurs:', error);
    return false;
  }
};

const generateHomePage = (users) => {
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
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #1a1a1a;
          color: #e0e0e0;
        }
        h1 { color: #ffffff; }
        ul { list-style-type: none; padding: 0; }
        li { margin-bottom: 10px; padding: 10px; background-color: #2a2a2a; border-radius: 4px; }
        li a { text-decoration: none; color: #e0e0e0; display: block; }
        li a:hover { background-color: #333333; }
        .button { 
          display: inline-block; 
          padding: 10px 15px; 
          background-color: #40E0D0; 
          color: #121212; 
          text-decoration: none; 
          border-radius: 4px; 
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover { background-color: #34c0b9; }
      </style>
    </head>
    <body>
      <h1>Liste des utilisateurs</h1>
      <ul>
        ${users.map(user => `
          <li><a href="/user/${encodeURIComponent(user.nom)}">${user.nom} (${user.role})</a></li>
        `).join('')}
      </ul>
      <a href="/form" class="button">Ajouter un utilisateur</a>
    </body>
    </html>
  `;
};

const generateUserDetailPage = (user) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Détails de ${user.nom}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #1a1a1a;
          color: #e0e0e0;
        }
        h1 { color: #ffffff; }
        .card { 
          border: 1px solid #444444; 
          border-radius: 4px; 
          padding: 20px; 
          margin-top: 20px;
          background-color: #2a2a2a;
        }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #40E0D0; }
        .button { 
          display: inline-block; 
          padding: 10px 15px; 
          background-color: #40E0D0; 
          color: #121212; 
          text-decoration: none; 
          border-radius: 4px; 
          margin-top: 20px;
          font-weight: bold;
        }
        .button:hover { background-color: #34c0b9; }
      </style>
    </head>
    <body>
      <h1>Détails de l'utilisateur</h1>
      <div class="card">
        <div class="field"><span class="label">Nom:</span> ${user.nom}</div>
        <div class="field"><span class="label">Email:</span> ${user.email}</div>
        <div class="field"><span class="label">Rôle:</span> ${user.role}</div>
      </div>
      <a href="/" class="button">Retour à l'accueil</a>
    </body>
    </html>
  `;
};

const generateFormPage = (error = '') => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ajouter un utilisateur</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #1a1a1a;
          color: #e0e0e0;
        }
        h1 { color: #ffffff; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: #e0e0e0; }
        input[type="text"], input[type="email"] { 
          width: 100%; 
          padding: 8px; 
          border: 1px solid #444; 
          border-radius: 4px;
          background-color: #2a2a2a;
          color: #e0e0e0;
        }
        input:focus {
          border-color: #40E0D0;
          outline: none;
          box-shadow: 0 0 5px rgba(64, 224, 208, 0.5);
        }
        button { 
          padding: 10px 15px; 
          background-color: #40E0D0; 
          color: #121212; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer;
          font-weight: bold;
        }
        button:hover { background-color: #34c0b9; }
        .error { color: #ff6b6b; margin-bottom: 15px; }
        .button { 
          display: inline-block; 
          padding: 10px 15px; 
          background-color: #ff6b6b; 
          color: #ffffff; 
          text-decoration: none; 
          border-radius: 4px; 
          margin-top: 20px; 
          margin-left: 10px;
          font-weight: bold;
        }
        .button:hover { background-color: #e25858; }
      </style>
    </head>
    <body>
      <h1>Ajouter un utilisateur</h1>
      ${error ? `<div class="error">${error}</div>` : ''}
      <form action="/add-user" method="post">
        <div class="form-group">
          <label for="nom">Nom:</label>
          <input type="text" id="nom" name="nom" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <button type="submit">Ajouter</button>
        <a href="/" class="button">Annuler</a>
      </form>
    </body>
    </html>
  `;
};

module.exports = {
  readUsers,
  writeUsers,
  generateHomePage,
  generateUserDetailPage,
  generateFormPage
};
