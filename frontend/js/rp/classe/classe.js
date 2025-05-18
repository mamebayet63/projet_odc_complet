import { fetchData, softDelete , updateData } from '../../utils/utils.js';
// console.log("ttt");

let currentPage = 1;
const itemsPerPage = 6;
let classToDelete = null;

// Fonction pour récupérer et afficher les classes avec pagination
async function displayClasses() {
    const classGrid = document.getElementById("class-grid");
    const paginationControls = document.getElementById("pagination-controls");
  
    classGrid.innerHTML = "";
  
    const classes = (await fetchData('classes'))?.filter(c => c.etat !== "suprimée");
    const filieres = await fetchData('filiere');
    const inscriptions = await fetchData('inscription');
    console.log(classes);
    
    
  
    if (!classes || !filieres || !inscriptions) return;
  
    const totalPages = Math.ceil(classes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedClasses = classes.slice(startIndex, endIndex);
  
    paginatedClasses.forEach((classe) => {
      const filiere = filieres.find(f => f.id == classe.id_filiere);
      const studentsCount = inscriptions.filter(ins => ins.id_classe == classe.id && ins.annee === "2025").length;
  
      const classCard = `
  <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 hover:border-red-100">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-gray-800">${classe.name}</h2>
            <span class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">${filiere ? filiere.libelle : 'Aucune filière'}</span>
          </div>
          <p class="text-sm text-gray-500">Promotion 2023-2024</p>
        </div>
        
        <div class="relative">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600">
            <i class="ri-more-2-fill text-lg"></i>
          </button>
          <div class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-2 hidden group-hover:block hover:block">
            <a href="#" class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700">
              <i class="ri-edit-line"></i>
              Modifier
            </a>
            <button href="#" class="delete-class-btn flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-red-600" data-id="${classe.id}">
              <i class="ri-archive-line"></i>
              Archiver
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-3.5 text-sm text-gray-600">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-50 rounded-lg text-red-600">
            <i class="ri-user-line text-lg"></i>
          </div>
          <div>
            <p class="font-medium">${studentsCount} Étudiant${studentsCount > 1 ? 's' : ''}</p>
            <p class="text-xs text-gray-400">Dernière inscription: 15/09</p>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-green-700">Classe active</span>
        </div>
        <a href="#" class="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm">
          Voir détails
          <i class="ri-arrow-right-line mt-0.5"></i>
        </a>
      </div>
      
    </div>
  </div>
  
    `;

      classGrid.innerHTML += classCard;
    });
  
    paginationControls.innerHTML = `
      <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Précédent</button>
      <span class="text-white">Page ${currentPage} sur ${totalPages}</span>
      <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Suivant</button>
    `;
  
    // Gestion des boutons de pagination
    document.getElementById("prevPage").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayClasses();
      }
    });
  
    document.getElementById("nextPage").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayClasses();
      }
    });
  
    // // Gestion des boutons de suppression
    document.querySelectorAll('.delete-class-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        console.log(id);
        
        confirmDelete(id);
      });
    });
    // Gestion des boutons de modification
  document.querySelectorAll('.edit-class-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const classes = await fetchData('classe');
      const filieres = await fetchData('filiere');
      const classe = classes.find(c => c.id === id);
      
      if (classe) {
        showEditModal(classe, filieres);
      }
    });
  });
  
  }

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
  // modal pour modifier
  function showEditModal(classe, filieres) {
    const modal = document.createElement('div');
    modal.id = 'edit-class-modal';
    modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');
  
    modal.innerHTML = `
    <div class="bg-gray-800 p-8 rounded-xl w-96 shadow-xl border border-gray-700">
      <h2 class="text-2xl font-bold mb-6 text-gray-100">Modifier la classe</h2>
      
      <div class="space-y-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-400">Libellé</label>
          <input type="text" id="edit-libelle" value="${classe.libelle}" 
                 class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                        text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-400 transition-all" />
        </div>
  
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-400">Niveau</label>
          <input type="text" id="edit-niveau" value="${classe.niveau}" 
                 class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                        text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-400 transition-all" />
        </div>
  
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-400">Filière</label>
          <select id="edit-filiere" 
                  class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                         text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         appearance-none cursor-pointer transition-all">
            ${filieres.map(filiere => `
              <option value="${filiere.id}" ${filiere.id === classe.id_filiere ? 'selected' : ''}
                      class="bg-gray-800">
                ${filiere.libelle}
              </option>`).join('')}
          </select>
        </div>
      </div>
  
      <div class="flex justify-end gap-3 mt-8">
        <button id="cancelEdit" 
                class="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg
                       transition-colors duration-200 font-medium">
          Annuler
        </button>
        <button id="confirmEdit" 
                class="px-4 py-2 bg-[#b31822] rounded-xl hover:bg-[#d11a2a] text-white">
          Enregistrer
        </button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
  
    document.getElementById('cancelEdit').addEventListener('click', () => {
      modal.remove();
    });
  
    document.getElementById('confirmEdit').addEventListener('click', async () => {
      const updatedLibelle = document.getElementById('edit-libelle').value.trim();
      const updatedNiveau = document.getElementById('edit-niveau').value.trim();
      const updatedFiliere = document.getElementById('edit-filiere').value;
  
      if (updatedLibelle && updatedNiveau) {
        const success = await updateData('classe', classe.id, {
          libelle: updatedLibelle,
          niveau: updatedNiveau,
          id_filiere: updatedFiliere
        });
  
        if (success) {
          displayClasses();
          modal.remove();
        } else {
          alert("Erreur lors de la mise à jour.");
        }
      } else {
        alert("Veuillez remplir tous les champs.");
      }
    });
  }

  displayClasses();