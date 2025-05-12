const fs = require('node:fs')

const commands = [
	{
		name: "list",
		description: "Liste tout les élèves."
	},
	{
		name: 'find <string>',
		description: "Cherche puis affiche les infos d'un élève si il existe."
	},
	{
		name: 'more <number>',
		description: "Filtre les élèves en fonction de leur moyenne"
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

let students = [];
try {
  const rawData = fs.readFileSync('./student.json', 'utf8');
  students = JSON.parse(rawData);
  console.log("Données des élèves chargées avec succès.");
} catch (error) {
  console.error("Erreur lors du chargement des données:", error.message);
  process.exit(1);
}

function calculateAverage(notes) {
  if (!notes || notes.length === 0) return 0;
  const sum = notes.reduce((total, note) => total + note, 0);
  return (sum / notes.length).toFixed(2);
}

function listStudents() {
  console.log("\nListe des élèves:");
  students.forEach((student, index) => {
    console.log(`${index + 1}. ${student.name}`);
  });
}

function findStudent(name) {
  if (!name) {
    console.log("Erreur: Veuillez spécifier un nom d'élève à rechercher.");
    return;
  }

  const searchTerm = name.toLowerCase();
  const foundStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm)
  );

  if (foundStudents.length === 0) {
    console.log(`Aucun élève trouvé avec le nom contenant "${name}".`);
    return;
  }

  console.log(`\n${foundStudents.length} élève(s) trouvé(s):`);
  foundStudents.forEach(student => {
    const average = calculateAverage(student.notes);
    console.log(`\nNom: ${student.name}`);
    console.log(`Adresse: ${student.address}`);
    console.log(`Notes: ${student.notes.join(', ')}`);
    console.log(`Moyenne: ${average}`);
  });
}

function filterStudentsByGrade(minGrade) {
  const numGrade = parseFloat(minGrade);
  
  if (isNaN(numGrade)) {
    console.log("Erreur: Veuillez entrer un nombre valide.");
    return;
  }

  const filteredStudents = students.filter(student => {
    const average = calculateAverage(student.notes);
    return parseFloat(average) > numGrade;
  });

  if (filteredStudents.length === 0) {
    console.log(`Aucun élève n'a une moyenne supérieure à ${minGrade}.`);
    return;
  }

  console.log(`\nÉlèves ayant une moyenne supérieure à ${minGrade}:`);
  filteredStudents.forEach(student => {
    const average = calculateAverage(student.notes);
    console.log(`${student.name} - Moyenne: ${average}`);
  });
}

function showHelp() {
  console.log("\nCommandes disponibles:");
  commands.forEach(cmd => {
    console.log(`- ${cmd.name}: ${cmd.description}`);
  });
}

console.log("=== Système de Gestion des Élèves ===");
console.log("Entrez une commande (tapez 'help' pour voir les commandes disponibles):");

process.stdin.on("data", (chunk) => {
	const data = chunk.toString().trim();
	const [command, ...args] = data.split(' ');

	switch (command.toLowerCase()) {
		case 'help':
			showHelp();
			break;
		case 'list':
			listStudents();
			break;
		case 'find':
			findStudent(args.join(' '));
			break;
		case 'more':
			filterStudentsByGrade(args[0]);
			break;
		case 'exit':
		case 'quit':
			console.log("Au revoir!");
			process.exit(0);
			break;
		default:
			console.log(`Commande inconnue: ${command}`);
			console.log("Tapez 'help' pour voir les commandes disponibles.");
	}

	console.log("\nEntrez une commande:");
})

process.on('SIGINT', () => {
  console.log("\nAu revoir!");
  process.exit(0);
});