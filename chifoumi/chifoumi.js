const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const choices = ['pierre', 'papier', 'ciseaux'];

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }
  
  play() {
    return getRandomChoice();
  }
  
  addPoint() {
    this.score++;
  }
  
  resetScore() {
    this.score = 0;
  }
}

const player1 = new Player('Joueur 1');
const player2 = new Player('Joueur 2');

const MANCHES = 3;
let mancheActuelle = 0;

function getRandomChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(choicePlayer1, choicePlayer2) {
  if (choicePlayer1 === choicePlayer2) return 'égalité';
  
  if (
    (choicePlayer1 === 'pierre' && choicePlayer2 === 'ciseaux') ||
    (choicePlayer1 === 'papier' && choicePlayer2 === 'pierre') ||
    (choicePlayer1 === 'ciseaux' && choicePlayer2 === 'papier')
  ) {
    return player1;
  } else {
    return player2;
  }
}

function playRound() {
  mancheActuelle++;
  console.log(`\n--- Manche ${mancheActuelle} ---`);
  
  const choicePlayer1 = player1.play();
  const choicePlayer2 = player2.play();
  
  console.log(`${player1.name} choisit: ${choicePlayer1}`);
  console.log(`${player2.name} choisit: ${choicePlayer2}`);
  
  const winner = determineWinner(choicePlayer1, choicePlayer2);
  
  if (winner === 'égalité') {
    console.log('Égalité !');
  } else {
    console.log(`${winner.name} gagne la manche !`);
    winner.addPoint();
  }
  
  console.log(`Score: ${player1.name} (${player1.score}) - ${player2.name} (${player2.score})`);
  
  if (mancheActuelle < MANCHES) {
    askToContinue();
  } else {
    endGame();
  }
}

function askToContinue() {
  rl.question('Appuyez sur Entrée pour continuer...', () => {
    playRound();
  });
}

function endGame() {
  console.log('\n--- Fin du jeu ---');
  console.log(`Score final: ${player1.name} (${player1.score}) - ${player2.name} (${player2.score})`);
  
  if (player1.score > player2.score) {
    console.log(`${player1.name} remporte la partie !`);
  } else if (player2.score > player1.score) {
    console.log(`${player2.name} remporte la partie !`);
  } else {
    console.log('Match nul !');
  }
  
  askToPlayAgain();
}

function askToPlayAgain() {
  rl.question('Voulez-vous rejouer ? (oui/non): ', (answer) => {
    if (answer.toLowerCase() === 'oui') {
      player1.resetScore();
      player2.resetScore();
      mancheActuelle = 0;
      console.log('\n=== Nouvelle partie ===');
      playRound();
    } else {
      console.log('Merci d\'avoir joué !');
      rl.close();
    }
  });
}

console.log('=== Bienvenue au jeu de Chifoumi ===');
console.log(`Le jeu se déroule en ${MANCHES} manches.`);
playRound();

rl.on('close', () => {
  process.exit(0);
});
