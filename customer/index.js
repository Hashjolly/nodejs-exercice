// Import du module utils
const { calculateTTC } = require('./utils');

const priceHT = [
    { name : "Apple", priceHT : 1.0, priceTTC : null },
    { name : "Orange", priceHT : 1.2, priceTTC : null },
    { name : "Rasberry", priceHT : 2.5, priceTTC : null },
];

// Modifiez le tableau pour mettre les prix TTC
priceHT.forEach(item => {
  item.priceTTC = calculateTTC(item.priceHT);
});

// Affichage des résultats
console.log("Liste des produits avec prix TTC:");
console.table(priceHT);
