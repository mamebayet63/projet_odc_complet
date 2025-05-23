import { addToJsonServer } from '../utils/utils.js';

const form = document.getElementById("addClassForm");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

// Soumission du formulaire (ajout ou modification)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Traitement...";

  const idPromo = form.idPromo.value;

  // Récupération des valeurs
  const fields = {
    libelle: form.libelle.value.trim(),
    apprenants: parseInt(form.apprenants.value.trim(), 10),
    referentiels: [...form.referentiels.selectedOptions].map(opt => parseInt(opt.value)),
    date_debut: form.date_debut.value,
    date_fin: form.date_fin.value,
    coverPhoto: form.coverPhoto.value.trim()
  };

  // Réinitialisation des erreurs
  ["libelle", "apprenants", "referentiels", "date_debut", "date_fin", "coverPhoto"]
    .forEach(id => document.getElementById(`${id}Error`).textContent = "");

  let hasError = false;
  const setError = (field, message) => {
    document.getElementById(`${field}Error`).textContent = message;
    hasError = true;
  };

  // Validation
  if (!fields.libelle) setError("libelle", "Veuillez saisir le libellé.");
  if (isNaN(fields.apprenants) || fields.apprenants <= 0) setError("apprenants", "Veuillez indiquer un nombre d'apprenants valide.");
  if (fields.referentiels.length === 0) setError("referentiels", "Veuillez sélectionner au moins un référentiel.");
  if (!fields.date_debut || !fields.date_fin) {
    setError("date_debut", "Veuillez saisir les 2 dates");
  } else if (new Date(fields.date_fin) < new Date(fields.date_debut)) {
    setError("date_fin", "La date de fin doit être supérieure à la date de début.");
  }
  if (!fields.coverPhoto || !fields.coverPhoto.startsWith("http")) {
    setError("coverPhoto", "Veuillez saisir une URL valide pour la photo");
  }

  if (hasError) {
    submitButton.disabled = false;
    submitButton.textContent = "Enregistrer";
    return;
  }

  const newPromo = {
    nom: fields.libelle,
    apprenants: fields.apprenants,
    referentiels: fields.referentiels,
    date_debut: fields.date_debut,
    date_fin: fields.date_fin,
    coverPhoto: fields.coverPhoto,
    statut: "desactif"
  };

  const url = idPromo ? `promotions/${idPromo}` : "promotions";
  const method = idPromo ? "PUT" : "POST";

  const success = await addToJsonServer(url, newPromo, method);
  submitButton.disabled = false;
  submitButton.textContent = "Enregistrer";

  const message = document.createElement("div");
  message.className = `text-sm mt-2 ${success ? "text-green-500" : "text-red-500"}`;
  message.textContent = success
    ? (idPromo ? "Promotion modifiée avec succès !" : "Promotion ajoutée avec succès !")
    : "Erreur lors de l'enregistrement. Veuillez réessayer.";
  form.appendChild(message);

  setTimeout(() => {
    if (success) {
      modal.classList.add("hidden");
      form.reset();
      form.idPromo.value = "";
      // Tu peux rafraîchir la liste ici si nécessaire
    }
    message.remove();
  }, success ? 1500 : 2000);
});

// Gestion ouverture en mode "modifier"
document.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".delete-btn");
  if (!editBtn) return;

  const id = editBtn.dataset.id;
  try {
    const res = await fetch(`http://localhost:3000/promotions/${id}`);
    const promo = await res.json();

    form.libelle.value = promo.nom;
    form.apprenants.value = promo.apprenants;
    form.date_debut.value = promo.date_debut;
    form.date_fin.value = promo.date_fin;
    form.coverPhoto.value = promo.coverPhoto;
    form.idPromo.value = promo.id;

    [...form.referentiels.options].forEach(opt => {
      opt.selected = promo.referentiels.includes(parseInt(opt.value));
    });

    modal.classList.remove("hidden");
  } catch (err) {
    alert("Erreur lors du chargement de la promotion.");
  }
});

// Fermeture du modal
closeModalBtn.addEventListener("click", () => {
  form.reset();
  form.idPromo.value = "";
  modal.classList.add("hidden");

  ["libelle", "apprenants", "referentiels", "date_debut", "date_fin", "coverPhoto"]
    .forEach(id => document.getElementById(`${id}Error`).textContent = "");
});
