const fs = require('node:fs');
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

const commands = [
	{
		name: "play",
    description: "Joue une manche."
	},
	{
		name: 'history',
    description: "Affiche l'historique des parties."
	},
  {
		name: 'help',
		description: "Affiche les commandes disponibles."
	},
	{
		name: 'exit',
		description: "Quitte l'application."
	}
]

let historyArray = [];

try {
  const rawData = fs.readFileSync('./chifoumi_log.json', 'utf8');
  historyArray = JSON.parse(rawData);
  console.log("Données de l'historique chargées avec succès.");
} catch (error) {
  console.error("Erreur lors du chargement des données:", error.message);
  process.exit(1);
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
  
  saveInHistory(winner, player1, player2);

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
      rl.prompt();
    }
  });
}

function showHelp() {
  console.log("\nCommandes disponibles:");
  commands.forEach(cmd => {
    console.log(`- ${cmd.name}: ${cmd.description}`);
  });
}

function saveInHistory(winner, player1, player2) {
  const date = new Date();
  const formattedDate = date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const entry = {
    date: formattedDate,
    winner: winner === 'égalité' ? 'Égalité' : winner.name,
    score: `${player1.name} (${player1.score}) - ${player2.name} (${player2.score})`
  };
  
  fs.readFile('./chifoumi_log.json', 'utf8', (err, data) => {
    
    if (!err) {
      try {
        historyArray = JSON.parse(data);
        if (!Array.isArray(historyArray)) {
          historyArray = [];
        }
      } catch (parseErr) {
        console.error("Erreur de parsing du fichier d'historique, création d'un nouveau fichier.");
        historyArray = [];
      }
    }
    
    historyArray.push(entry);
    
    fs.writeFile('./chifoumi_log.json', JSON.stringify(historyArray, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error("Erreur lors de l'enregistrement dans l'historique:", writeErr.message);
      } else {
        console.log("\nHistorique mis à jour avec succès.");
      }
    });
  });
}

function processCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command.toLowerCase()) {
    case 'help':
      showHelp();
      rl.prompt();
      break;
    case 'play':
      playRound();
      break;
    case 'history':
      console.log("\n=== Historique des parties ===");
      if (historyArray.length === 0) {
        console.log("Aucune partie n'a été enregistrée.");
      } else {
        historyArray.forEach((entry, index) => {
          console.log(`${index + 1}. Date: ${entry.date} | Gagnant: ${entry.winner} | Score: ${entry.score}`);
        });
      }
      rl.prompt();
      break;
    case 'exit':
    case 'quit':
      rl.close();
      break;
    default:
      console.log(`Commande inconnue: ${command}`);
      console.log("Tapez 'help' pour voir les commandes disponibles.");
      rl.prompt();
  }
}

rl.on('line', (input) => {
  processCommand(input);
});

rl.on('close', () => {
  console.log("\nAu revoir!");
  process.exit(0);
});

console.log('=== Bienvenue au jeu de Chifoumi ===');
console.log(`Le jeu se déroule en ${MANCHES} manches.`);
console.log("Entrez une commande (tapez 'help' pour voir les commandes disponibles):");

rl.setPrompt('\nEntrez une commande: ');
rl.prompt();
