import { fetchData, softDelete , updateData } from '../../utils/utils.js';
// console.log("ttt");

let currentPage = 1;
const itemsPerPage = 6;
let classToDelete = null;

// Fonction pour récupérer et afficher les profs avec pagination
async function displayProf() {
    const profGrid = document.getElementById("prof-grid");
    const paginationControls = document.getElementById("pagination-controls");

    profGrid.innerHTML = "";

    const Profs = (await fetchData('prof'))?.filter(c => c.etat !== "suprimée");
    const Users = await fetchData('users');

    if (!Profs || !Users) return;

    const totalPages = Math.ceil(Profs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProfs = Profs.slice(startIndex, endIndex);

    paginatedProfs.forEach((prof) => {
        const user = Users.find(u => u.id === prof.userId);
        console.log(user);
        
        const fullName = `${prof.firstName} ${prof.lastName}`;
        const email = user?.email || 'Email inconnu';
        const avatar = prof?.avatar || 'https://img.freepik.com/premium-photo/magnifying-glass-concept-finding-employees-3d-rendering-illustration_567294-679.jpg?uid=R128466424&ga=GA1.1.810359603.1727369869&semt=ais_hybrid&w=740';
        const matricule = user?.matricule ;
        const Spécialite = prof?.Spécialite;


        const classCard = `
  <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 hover:border-red-100">
                <div class="p-6 space-y-4">
                    <!-- En-tête avec photo -->
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <img src="${avatar}" 
                                 class="w-16 h-16 rounded-full border-2 border-ecole-red object-cover">
                            <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 class="text-sm font-bold text-gray-800">${fullName}</h2>
                            <p class="text-ecole-red text-sm flex items-center gap-2">
                                <i class="ri-mail-line"></i>
                                ${email}
                            </p>
                        </div>
                    </div>

                    <!-- Détails -->
                    <div class="space-y-3 text-sm text-gray-600">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <i class="ri-book-line"></i>
                            </div>
                            <div>
                                <p class="font-medium">${Spécialite}</p>
                                <p class="text-xs text-gray-400">${matricule}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                            <i class="ri-checkbox-circle-line"></i>
                            ${prof.etat}
                        </span>
                        <div class="flex gap-2">
                            <button class="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-ecole-red">
                                <i class="ri-pencil-line"></i>
                            </button>
                            <button class="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-ecole-red">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        profGrid.innerHTML += classCard;
    });

    paginationControls.innerHTML = `
      <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Précédent</button>
      <span class="text-red-500">Page ${currentPage} sur ${totalPages}</span>
      <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Suivant</button>
    `;

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayProf();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProf();
        }
    });
}

  
  displayProf();
  