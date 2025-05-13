const fs = require('node:fs');
const readline = require('node:readline');
// Ajouter dotenv et le configurer
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
		name: 'add-grade',
		description: "Ajoute une note à un élève spécifique."
	},
	{
		name: 'add-mention',
		description: "Ajoute une mention à un élève selon sa moyenne."
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
    console.log(`Mention: ${student.mention || "Non définie"}`);
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

function addGradeToStudent() {
  rl.question('Nom de l\'élève: ', (studentName) => {
    if (!studentName) {
      console.log("Erreur: Veuillez spécifier un nom d'élève.");
      return rl.prompt();
    }
    
    const searchTerm = studentName.toLowerCase();
    const foundStudent = students.find(student => 
      student.name.toLowerCase().includes(searchTerm)
    );

    if (!foundStudent) {
      console.log(`Aucun élève trouvé avec le nom "${studentName}".`);
      return rl.prompt();
    }

    rl.question('Note à ajouter: ', (gradeInput) => {
      const grade = parseFloat(gradeInput);
      
      if (isNaN(grade)) {
        console.log("Erreur: Veuillez entrer un nombre valide pour la note.");
        return rl.prompt();
      }

      foundStudent.notes.push(grade);
      
      // Sauvegarde des modifications dans le fichier
      fs.writeFileSync('./student.json', JSON.stringify(students, null, 2), 'utf8');
      
      console.log(`La note ${grade} a bien été ajoutée à l'élève ${foundStudent.name}.`);
      rl.prompt();
    });
  });
}

function getMentionFromAverage(average) {
  const avgNum = parseFloat(average);
  
  if (avgNum >= 16 && avgNum <= 18) {
    return "Très bien";
  } else if (avgNum >= 14 && avgNum <= 16) {
    return "Bien";
  } else if (avgNum >= 12 && avgNum <= 14) {
    return "Assez bien";
  } else if (avgNum >= 10 && avgNum <= 12) {
    return "Passable";
  } else {
    return "Non définie";
  }
}

function addMentionToStudent() {
  rl.question('Nom de l\'élève: ', (studentName) => {
    if (!studentName) {
      console.log("Erreur: Veuillez spécifier un nom d'élève.");
      return rl.prompt();
    }
    
    const searchTerm = studentName.toLowerCase();
    const foundStudent = students.find(student => 
      student.name.toLowerCase().includes(searchTerm)
    );

    if (!foundStudent) {
      console.log(`Aucun élève trouvé avec le nom "${studentName}".`);
      return rl.prompt();
    }

    const average = calculateAverage(foundStudent.notes);
    const mention = getMentionFromAverage(average);
    
    // Ajouter la mention à l'étudiant
    foundStudent.mention = mention;
    
    // Sauvegarde des modifications dans le fichier
    fs.writeFileSync('./student.json', JSON.stringify(students, null, 2), 'utf8');
    
    console.log(`La mention "${mention}" a été attribuée à ${foundStudent.name} (moyenne: ${average}).`);
    rl.prompt();
  });
}

function showHelp() {
  console.log("\nCommandes disponibles:");
  commands.forEach(cmd => {
    console.log(`- ${cmd.name}: ${cmd.description}`);
  });
}

function processCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command.toLowerCase()) {
    case 'help':
      showHelp();
      rl.prompt();
      break;
    case 'list':
      listStudents();
      rl.prompt();
      break;
    case 'find':
      findStudent(args.join(' '));
      rl.prompt();
      break;
    case 'more':
      filterStudentsByGrade(args[0]);
      rl.prompt();
      break;
    case 'add-grade':
      addGradeToStudent();
      break;
    case 'add-mention':
      addMentionToStudent();
      break;
    case 'exit':
    case 'quit':
      console.log("Au revoir!");
      rl.close();
      break;
    default:
      console.log(`Commande inconnue: ${command}`);
      console.log("Tapez 'help' pour voir les commandes disponibles.");
      rl.prompt();
  }
}

// Remplacer la fonction promptUser par l'utilisation de rl.line
rl.on('line', (input) => {
  processCommand(input);
});

rl.on('close', () => {
  console.log("\nAu revoir!");
  process.exit(0);
});

console.log("=== Système de Gestion des Élèves ===");
console.log("Entrez une commande (tapez 'help' pour voir les commandes disponibles):");

// Définir l'invite une seule fois
rl.setPrompt('\nEntrez une commande: ');
rl.prompt();