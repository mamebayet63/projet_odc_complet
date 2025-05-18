import { addToJsonServer, generateUniqueMatricule } from '../../utils/utils.js';

let matriculeGenerer = "";

document.getElementById('openAddProfBtn').addEventListener('click', function () {
  toggleModal(true);
});

function toggleModal(state) {
  const addProfModal = document.getElementById('addProfModal');
  if (state) {
    addProfModal.classList.remove('hidden');

    // Générer le matricule
    generateUniqueMatricule("PROF").then(matricule => {
      matriculeGenerer = matricule;
      document.getElementById("matricule").textContent = matricule;
    });

  } else {
    addProfModal.classList.add('hidden');
  }
}

document.getElementById('addProfForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Réinitialisation des messages d'erreur
  document.querySelectorAll(".error-message").forEach(err => err.textContent = "");

  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const specialite = document.getElementById('specialite').value.trim();
  const password = document.getElementById('password').value.trim(); // utilisé dans le formulaire ?
  const email = document.getElementById('email').value.trim();
  const photo = document.getElementById('photo').value.trim();

  let hasError = false;

  if (!prenom) {
    document.getElementById("prenomError").textContent = "Le prénom est obligatoire.";
    hasError = true;
  }
  if (!nom) {
    document.getElementById("nomError").textContent = "Le nom est obligatoire.";
    hasError = true;
  }
  if (!specialite) {
    document.getElementById("specialiteError").textContent = "La Spécialité est obligatoire.";
    hasError = true;
  }
  if (!password) {
    document.getElementById("passwordError").textContent = "Le mot de passe est obligatoire.";
    hasError = true;
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById("emailError").textContent = "Email invalide.";
    hasError = true;
  }
  if (!photo) {
    document.getElementById("photoError").textContent = "Lien de la photo requis.";
    hasError = true;
  }

  if (hasError) return;

  const submitBtn = this.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Ajout en cours...";

  try {
    // 1. Ajouter dans users
    const newUser = {
      email,
      password, // Mot de passe par défaut, tu peux le rendre dynamique
      matricule: matriculeGenerer,
      role: "prof"
    };

    const createdUser = await addToJsonServer("users", newUser);

    // 2. Ajouter dans prof avec le userId récupéré
    const newProf = {
      userId: createdUser.id,
      firstName: prenom,
      lastName: nom,
      avatar: photo,
      Spécialite: specialite,
      etat: "actif"
    };

    await addToJsonServer("prof", newProf);

    // Réinitialiser et fermer
    this.reset();
    toggleModal(false);

  } catch (error) {
    alert("Erreur lors de l'ajout du professeur : " + error.message);
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Ajouter le Professeur";
  }
});

document.getElementById('closeModal').addEventListener('click', function () {
  document.querySelectorAll(".error-message").forEach(err => err.textContent = "");
  toggleModal(false);
});
