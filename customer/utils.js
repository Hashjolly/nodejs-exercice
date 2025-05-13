/**
 * Calcule le prix TTC à partir d'un prix HT (TVA 20%)
 * @param {number} priceHT - Prix hors taxe
 * @returns {number} - Prix TTC avec 2 décimales
 */
const calculateTTC = (priceHT) => {
  // Application de la TVA à 20% et arrondi à 2 décimales
  return Number((priceHT * 1.2).toFixed(2));
};

// Export des fonctions utilitaires
module.exports = {
  calculateTTC
};
