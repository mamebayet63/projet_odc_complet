import { fetchData, softDelete , updateData  } from '../utils/utils.js'; // Assure-toi que le chemin est correct

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("cardContainer");
    const tableContainer = document.getElementById("tableContainer");
    const tableBody = document.getElementById("tableBody");
    const cardViewBtn = document.getElementById("cardViewBtn");
    const tableViewBtn = document.getElementById("tableViewBtn");

    let currentPage = 1;
const itemsPerPage = 6; // Par exemple
let allPromotions = [];

    
    // Vérifie si une vue est stockée, sinon "cards" par défaut
    let currentView = localStorage.getItem("currentView") || "cards";
    
    // Appliquer la vue au chargement
    switchView(currentView);
    
    cardViewBtn.addEventListener("click", () => {
      if (currentView !== "cards") switchView("cards");
    });
    
    tableViewBtn.addEventListener("click", () => {
      if (currentView !== "table") switchView("table");
    });
    
    function switchView(view) {
      currentView = view;
      localStorage.setItem("currentView", view); // Enregistre le choix
    
      if (view === "cards") {
        cardContainer.classList.remove("hidden");
        tableContainer.classList.add("hidden");
        cardViewBtn.classList.add("bg-red-500", "text-white");
        cardViewBtn.classList.remove("bg-gray-200", "hover:bg-gray-300");
        tableViewBtn.classList.remove("bg-red-500", "text-white");
        tableViewBtn.classList.add("bg-gray-200", "hover:bg-gray-300");
      } else {
        cardContainer.classList.add("hidden");
        tableContainer.classList.remove("hidden");
        tableViewBtn.classList.add("bg-red-500", "text-white");
        tableViewBtn.classList.remove("bg-gray-200", "hover:bg-gray-300");
        cardViewBtn.classList.remove("bg-red-500", "text-white");
        cardViewBtn.classList.add("bg-gray-200", "hover:bg-gray-300");
      }
    }
    
  
    function calculateDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const years = end.getFullYear() - start.getFullYear();
      const months = end.getMonth() - start.getMonth() + (years * 12);
      if (months < 12) {
        return `${months} mois`;
      } else {
        const fullYears = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths === 0
          ? `${fullYears} an${fullYears > 1 ? 's' : ''}`
          : `${fullYears} an${fullYears > 1 ? 's' : ''} et ${remainingMonths} mois`;
      }
    }
  
    function loadPromotions() {
        Promise.all([
            fetchData("promotions"),
            fetchData("referentiels")
          ])
      .then(([promotions, referentiels]) => {
        const referentielMap = {};
        referentiels.forEach(ref => {
          referentielMap[ref.id] = ref.nom;
        });
  
        cardContainer.innerHTML = "";
        tableBody.innerHTML = "";
  
        promotions.forEach(promo => {
          // --- CARTE ---
          const card = document.createElement("div");
          card.className = "h-full";
          card.innerHTML = `
          <div class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 border border-gray-100 hover:border-orange-100">
            <!-- Photo de couverture -->
            <div class="h-32 w-full rounded-t-xl overflow-hidden">
              <img src="${promo.coverPhoto}" 
                   alt="${promo.nom}" 
                   class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            </div>
        
            <!-- Contenu -->
            <div class="p-5 flex flex-col h-full">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-md font-bold text-gray-800">${promo.nom}</h3>

                <!-- Badge statut -->
                <span class="flex items-center gap-1 text-xs
                    ${promo.statut === 'Terminée' ? 'text-emerald-600 bg-emerald-50'
                    : promo.statut === 'En cours' ? 'text-yellow-600 bg-yellow-50'
                    : 'text-red-600 bg-red-50'}
                    px-2 py-1 rounded-full">

                    <i class="ri-${
                    promo.statut === 'Terminée' ? 'checkbox-circle-line' :
                    promo.statut === 'En cours' ? 'time-line' :
                    'close-circle-line'
                    } text-xs"></i>

                    ${promo.statut}
                </span>

                <!-- Icône action -->
                ${
                    promo.statut === 'Annulée' ? `
                    <button href="#" class="delete-class-btn flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-red-600" data-id="${promo.id}">
                        <i class="ri-archive-line"></i>
                        Archiver
                        </button>` :
                    promo.statut === 'En cours' ? `
                   <button href="#" class="delete-class-btn flex items-center gap-2  hover:bg-gray-50 text-red-600" data-id="${promo.id}">
                    <i class="ri-shut-down-line"></i>
                    </button>` : ''
                }
                </div>

              <div class="flex items-center gap-3 mb-5 text-gray-600">
                <i class="ri-calendar-2-line text-red-500"></i>
                <div>
                  <p class="text-xs font-medium">${promo.date_debut} → ${promo.date_fin}</p>
                  <p class="text-xs text-gray-400">Durée (${calculateDuration(promo.date_debut, promo.date_fin)})</p>
                </div>
              </div>
              <div class="mt-auto pt-4 border-t border-dashed border-gray-100">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <i class="ri-user-line text-red-500"></i>
                    <span class="text-sm font-medium">${promo.apprenants} apprentis</span>
                  </div>
                  <a href="#" class="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm font-medium">
                    Voir détails
                    <i class="ri-arrow-right-s-line transition-transform group-hover:translate-x-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>`;
          cardContainer.appendChild(card);
  
          // --- TABLEAU ---
          const row = document.createElement("tr");
  
          const refLabels = Array.isArray(promo.referentiels)
            ? promo.referentiels.map(id => referentielMap[id] || "Inconnu")
            : [];
  
            row.innerHTML = `
            <!-- Colonne Photo -->
            <td class="sticky left-0 px-2 py-2 bg-white group-hover:bg-gray-50">
              <div class="w-12 h-12 rounded-md overflow-hidden">
                <img src="${promo.coverPhoto}" 
                     alt="${promo.nom}" 
                     class="w-full h-full object-cover transition-transform group-hover:scale-110">
              </div>
            </td>
          
            <!-- Colonne Nom -->
            <td class="sticky left-16 px-2 py-4 bg-white group-hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="font-semibold text-sm text-gray-900 truncate max-w-[130px] hover:max-w-none transition-all duration-200">
                  ${promo.nom}
                </div>
              </div>
            </td>
          
           
            <!-- Dates -->
            <td class="px-2 py-4">
              <span class="text-sm text-gray-700">${promo.date_debut}</span>
            </td>
            <td class="px-2 py-4">
              <span class="text-sm text-gray-700">${promo.date_fin}</span>
            </td>
          
            <!-- Référentiels en ligne -->
            <td class="px-2 py-4">
              <div class="flex items-center gap-2 overflow-x-auto max-w-[260px] no-scrollbar">
                ${refLabels.map(nom => `
                  <span class="whitespace-nowrap px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    ${nom}
                  </span>`).join('')}
              </div>
            </td>
          
            <!-- Statut -->
            <td class="px-2 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm ${
                promo.statut === 'Actif' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }">
                <i class="ri-${promo.statut === 'Terminée' ? 'check' : 'close'}-circle-line mr-2"></i>
                ${promo.statut}
              </span>
            </td>
          
            <!-- Actions -->
            <td class="sticky right-0  py-4 bg-white group-hover:bg-gray-50">
              <div class="flex items-center gap-3">
                
                <button class="delete-btn p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="modifier" data-id="${promo.id}">
                  <i class="ri-pencil-line"></i>
                </button>

               
              </div>
            </td>`;
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Erreur:", error);
        cardContainer.innerHTML = "<p class='text-red-500'>Impossible de charger les promotions.</p>";
        tableBody.innerHTML = "<tr><td colspan='6' class='px-6 py-4 text-red-500'>Impossible de charger les promotions.</td></tr>";
      });
    }


      // // Gestion des boutons de suppression
      document.querySelectorAll('.delete-class-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          console.log(id);
          
          confirmDelete(id);
        });
      });

        // Fonction pour afficher le modal de confirmation
function confirmDelete(id_classe) {
    classToDelete = id_classe;
    console.log(classToDelete);
    
  
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');
  
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl font-bold">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cette classe ?</p>
        <div class="flex justify-end gap-4 mt-4">
          <button id="cancelDelete" class="px-4 py-2 bg-gray-300 text-black rounded-lg">Annuler</button>
          <button id="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg">Confirmer</button>
        </div>
      </div>
    `;
  
    document.body.appendChild(modal);
  
    document.getElementById('cancelDelete').addEventListener('click', () => {
      modal.remove();
    });
  
    document.getElementById('confirmDelete').addEventListener('click', async () => {
      if (classToDelete) {
        const classes = await fetchData('classe');
        const classe = classes.find(c => c.id === classToDelete);
        console.log(classe);
        
        if (classe) {
          
          classe.etat = "supprimée";
          console.log(classes);
          
          const success = await softDelete('classes', classToDelete, {etat : "supprimée"});
          if (success) {
            displayClasses();
          } else {
            alert("Erreur lors de la suppression. Veuillez réessayer.");
          }
        }
      }
      modal.remove();
    });
  }
  
    // switchView("cards");
    loadPromotions();
  });
  