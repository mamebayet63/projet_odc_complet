document.getElementById("sidebar-container").innerHTML = `
  <div id="sidebar" class="fixed h-screen w-72 bg-gradient-to-b from-gray-50 to-red-100 shadow-xl flex flex-col border-r border-gray-100 transition-transform duration-300 ease-in-out transform">
    
    <!-- Reste du contenu (profil, recherche, menu, etc.) -->
    <div class="p-6 border-b border-gray-200">
        <div class="mb-6 flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
            <img src="data:image/png;base64,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" 
                                     class="w-10 h-10 rounded-xl object-cover border-2 border-red-100">
            </div>
            <h2 class="font-semibold text-gray-800 text-base">Ecole-221</h2>
        </div>
        <div class="flex items-center space-x-2 bg-white rounded-lg p-3 shadow-sm ring-1 ring-gray-200/50 hover:ring-blue-300 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search..." class="bg-transparent outline-none w-full placeholder-gray-400">
        </div>
    </div>

    <!-- Ajoutez ici le reste du menu comme dans votre code -->
    <!-- Menu principal -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <nav class="space-y-2">
                <div class="space-y-1">
                    <a href="./dashboardRp.html" class="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all duration-200 group hover:shadow-sm">
                        <svg class="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span class="text-gray-600 group-hover:text-blue-500 transition-colors">Dashboard</span>
                    </a>
                    <!-- Répétez le même pattern pour les autres éléments avec des icônes différentes -->
                    
                </div>
    
                <div class="pt-4 border-t border-gray-200/50">
                    <h3 class="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">GOALS-24</h3>
                    <a href="./promo/promo.html" class="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm">
                        <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <span class="text-gray-600">Promos</span>
                    </a>
                   
                    <a href="./prof.html" class="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm">
                        <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <span class="text-gray-600">Professeur</span>
                    </a>
                    <a href="./cours.html" class="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm">
                        <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <span class="text-gray-600">Cours</span>
                    </a>
                </div>
            </nav>
        </div>
    
        <!-- Section basse -->
        <div class="p-4 border-t border-gray-200/50 mt-auto">
            <div class="text-sm text-gray-400 mb-2">February 2024</div>
            <a href="#" class="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm group">
                <svg class="w-6 h-6 text-gray-500 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                <span class="text-gray-600">Archive</span>
            </a>
            <a href="#" class="flex items-center space-x-3 p-3 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm group">
                <div class="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <span class="text-red-600">Critical</span>
            </a>
        </div>
  </div>
`;

// Gestion du toggle (fermer / ouvrir)
// document.addEventListener("DOMContentLoaded", () => {
//     const toggleBtn = document.getElementById("sidebarToggle");
//     const sidebar = document.getElementById("sidebar");
//     const menuIcon = document.getElementById("menuIcon");
//     const closeIcon = document.getElementById("closeIcon");

//     toggleBtn.addEventListener("click", () => {
//         sidebar.classList.toggle("-translate-x-full");
//         menuIcon.classList.toggle("hidden");
//         closeIcon.classList.toggle("hidden");
//     });
// });
