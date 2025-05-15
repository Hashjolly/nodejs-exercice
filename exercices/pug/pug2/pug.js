const pug = require('pug');
const fs = require('fs');
const path = require('path');

const loggedUser = {
    name: {
        first: 'Jean',
        last: 'Dupont',
    },
    age: 36,
    birthdate: new Date('1986-04-18'),
    location: {
        zipcode: '77420',
        city: 'Champs-sur-Marne',
    },
    isAdmin: true
};

const templatePath = path.join(__dirname, 'user-card.pug');

const templateContent = `
.user-card
    h4 #{name.first} #{name.last.toUpperCase()} 
        small (#{age} ans)
    p Né le #{birthdate.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
    p Vit à 
        strong #{location.city}, #{location.zipcode}
    if isAdmin
        span.badge-admin Est administrateur
`;

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

fs.writeFileSync(templatePath, templateContent);

const renderTemplate = pug.compileFile(templatePath, { 
    pretty: true,
    filters: {
        formatDate: (date) => formatDate(date)
    }
});

const html = renderTemplate(loggedUser);

console.log('HTML généré:');
console.log(html);

console.log('\nUtilisation de renderFile:');
const htmlFromRenderFile = pug.renderFile(templatePath, {
    ...loggedUser,
    pretty: true,
    formatDate: formatDate
});

console.log(htmlFromRenderFile);

const outputPath = path.join(__dirname, 'output.html');
fs.writeFileSync(outputPath, html);
console.log(`\nLe résultat a également été écrit dans: ${outputPath}`);
