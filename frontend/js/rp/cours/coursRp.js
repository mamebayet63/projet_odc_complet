import { fetchData } from '../../utils/utils.js';

const container = document.getElementById('courses-container');
const emptyState = document.getElementById('empty-state');
const filterSelect = document.getElementById('filter');

function calculerDuree(heure_debut, heure_fin) {
  const [heureDebut, minuteDebut] = heure_debut.split(':').map(Number);
  const [heureFin, minuteFin] = heure_fin.split(':').map(Number);
  const debut = new Date(2000, 0, 1, heureDebut, minuteDebut);
  const fin = new Date(2000, 0, 1, heureFin, minuteFin);
  const diff = (fin - debut) / (1000 * 60);
  const heures = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${heures}h ${minutes}m`;
}

async function displayCourses() {
  const [allCourses, allModules, allProfs] = await Promise.all([
    fetchData('courses'),
    fetchData('modules'),
    fetchData('prof')
  ]);

  if (!allCourses || !allModules || !allProfs) return;

  const selectedFilter = filterSelect?.value;
  const filteredCourses = selectedFilter
    ? allCourses.filter(c => c.categorie === selectedFilter)
    : allCourses;

  container.innerHTML = '';

  if (filteredCourses.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filteredCourses.forEach(c => {
      const module = allModules.find(m => m.id == c.id_module);
      const prof = allProfs.find(p => p.id == c.proffesseur_id);
      const libelleModule = module?.libelle || 'Module inconnu';
      const nomProf = prof ? `${prof.firstName} ${prof.lastName}` : 'Professeur inconnu';

      // Calcule la durée
      const duree = calculerDuree(c.heure_debut, c.heure_fin);

      container.innerHTML += `
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 group relative overflow-hidden">
        <!-- Shimmer effect de fond -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div class="absolute -inset-2 bg-gradient-to-r from-red-50 to-yellow-50 animate-shimmer"></div>
        </div>
        
        <div class="p-6 relative z-10">
          <!-- En-tête avec badge dynamique -->
          <div class="flex items-start justify-between mb-5">
            <div class="space-y-1">
              <span class="inline-block px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-[0.7rem] font-bold tracking-wider shadow-sm">
                ${c.salle.toUpperCase()}
              </span>
              <h3 class="text-xl font-extrabold text-gray-900 mt-1.5">${libelleModule}</h3>
            </div>
            <div class="flex flex-col items-end space-y-1.5">
              <span class="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-medium rounded-full backdrop-blur-sm">
                ${c.etat}
              </span>
              <div class="w-8 h-1 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full opacity-50"></div>
            </div>
          </div>
      
          <!-- Grid d'informations -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-500">
                <i class="ri-timer-flash-line text-lg"></i>
                <span class="text-sm font-medium">Durée</span>
              </div>
              <div class="text-sm font-bold text-gray-900">${duree}</div>
            </div>
            <div class="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2 text-gray-500">
                <i class="ri-calendar-2-line text-lg"></i>
                <span class="text-sm font-medium">Date</span>
              </div>
              <div class="text-sm font-bold text-gray-900">${c.date}</div>
            </div>
          </div>
      
          <!-- Footer avec interactions élégantes -->
          <div class="pt-5 border-t border-gray-200/70 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                <i class="ri-user-3-line text-red-600"></i>
              </div>
              <div class="text-sm font-semibold text-gray-900">${nomProf}</div>
            </div>
            <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm">
                <i class="ri-edit-line text-lg text-gray-600"></i>
              </button>
              <button class="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm">
                <i class="ri-delete-bin-2-line text-lg text-red-600"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
      </style>
      `;
    });
  }
}

if (filterSelect) {
  filterSelect.addEventListener('change', displayCourses);
}

displayCourses();
