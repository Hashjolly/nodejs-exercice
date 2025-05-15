const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];

const featuredProjects = [
    {
        title: 'Application Mobile',
        description: 'Application mobile cross-platform avec React Native',
        image: '/assets/img/project3.jpg',
        link: '/project/mobile-app'
    },
    {
        title: 'Projet E-commerce',
        description: 'Application e-commerce complète avec Node.js et React',
        image: '/assets/img/project1.jpg',
        link: '/project/ecommerce'
    },
    {
        title: 'Dashboard Analytics',
        description: 'Tableau de bord d\'analyse de données en temps réel',
        image: '/assets/img/project2.jpg',
        link: '/project/dashboard'
    }
];

app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Accueil',
        menuItems: updateActiveMenu('/'),
        featuredProjects
    });
});

app.get('/about-me', (req, res) => {
    res.render('about', { 
        pageTitle: 'À propos',
        menuItems: updateActiveMenu('/about-me')
    });
});

function updateActiveMenu(currentPath) {
    return menuItems.map(item => ({
        ...item,
        isActive: item.path === currentPath
    }));
}

if (require.main === module) {
    try {
        require.resolve('express');
        require.resolve('pug');
    } catch (e) {
        console.error("Dépendances manquantes. Veuillez exécuter 'npm install express pug'");
        process.exit(1);
    }

    const assetsDir = path.join(__dirname, 'assets', 'css');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    const cssPath = path.join(assetsDir, 'style.css');
    if (!fs.existsSync(cssPath)) {
        const basicCSS = `
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
            .header { background-color: #333; padding: 1rem 0; color: white; }
            .main-nav { display: flex; align-items: center; }
            .nav-list { list-style: none; display: flex; margin: 0; padding: 0; }
            .nav-item { margin-right: 20px; }
            .nav-link { color: white; text-decoration: none; }
            .nav-link.active { font-weight: bold; }
            .footer { background-color: #333; color: white; padding: 2rem 0; margin-top: 2rem; }
        `;
        fs.writeFileSync(cssPath, basicCSS);
    }

    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
} else {
    module.exports = app;
}
