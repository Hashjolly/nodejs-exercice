const pug = require('pug');
const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.pug');
const templateContent = `if user.isAdmin
    h1 Access granted
else
    h1 You must be logged as an administrator!`;

fs.writeFileSync(templatePath, templateContent);

console.log('=== Rendu avec isAdmin: true ===');
const renderedTrue = pug.renderFile(templatePath, {
  user: { isAdmin: true }
});
console.log(renderedTrue);
console.log('\n');

console.log('=== Rendu avec isAdmin: false ===');
const renderedFalse = pug.renderFile(templatePath, {
  user: { isAdmin: false }
});
console.log(renderedFalse);

console.log('\n== Analyse du résultat ==');
console.log('Quand isAdmin est true: "<h1>Access granted</h1>"');
console.log('Quand isAdmin est false: "<h1>You must be logged as an administrator!</h1>"');
