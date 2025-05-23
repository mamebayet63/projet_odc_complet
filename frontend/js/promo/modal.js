import { fetchData, softDelete , updateData  } from '../utils/utils.js'; // Assure-toi que le chemin est correct
document.getElementById("openModal").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("hidden");
  });
  
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });
  

  // Fonction pour récupérer et injecter les options
async function populateSelect(resource, selectId, labelField = 'libelle', valueField = 'id') {
    try {
      const response = await fetch(`http://localhost:3000/${resource}`);
      const data = await response.json();
      const select = document.getElementById(selectId);
  
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = item[labelField];
        select.appendChild(option);
      });
    } catch (error) {
      console.error(`Erreur de chargement des ${resource}`, error);
    }
  }

    async function chargerReferentiels() {
  try {
    const referentiels = await fetchData('referentiels'); // Ex : http://localhost:3000/referentiels
    const selectRef = document.getElementById('referentiels');
    selectRef.innerHTML = ''; // Vide le select si besoin

    referentiels.forEach(ref => {
      const option = document.createElement('option');
      option.value = ref.id;
      option.textContent = ref.nom;
      selectRef.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des référentiels :', error);
  }
}
chargerReferentiels();
      