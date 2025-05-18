const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const loginError = document.getElementById("login-error");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Réinitialiser les messages d'erreur
  emailError.classList.add("hidden");
  passwordError.classList.add("hidden");
  loginError.classList.add("hidden");

  let valid = true;

  // Validation de l'email
  if (!email || !email.includes("@")) {
    emailError.classList.remove("hidden");
    valid = false;
  }

  // Validation du mot de passe
  if (!password) {
    passwordError.classList.remove("hidden");
    valid = false;
  }

  if (!valid) return;

  // Vérification de l'utilisateur dans la base de données (JSON Server)
  fetch(`http://localhost:3000/users?email=${email}&password=${password}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const user = data[0];
        enrichUser(user); // Appelle la fonction d'enrichissement
      } else {
        loginError.textContent = "Email ou mot de passe incorrect.";
        loginError.classList.remove("hidden");
      }
    })
    .catch(error => {
      console.error("Erreur de connexion :", error);
      loginError.textContent = "Erreur serveur. Veuillez réessayer.";
      loginError.classList.remove("hidden");
    });
});

// Fonction pour enrichir les données utilisateur (ajouter prénom, nom, etc.)
function enrichUser(user) {
  let endpoint = "";

  if (user.role === "student") {
    endpoint = `http://localhost:3000/students?userId=${user.id}`;
  } else if (user.role === "teacher") {
    endpoint = `http://localhost:3000/teachers?userId=${user.id}`;
  } else if (user.role === "rp") {
    endpoint = `http://localhost:3000/rp?userId=${user.id}`;
  }
  // Ajoute d'autres rôles si besoin

  if (endpoint) {
    fetch(endpoint)
      .then(res => res.json())
      .then(details => {
        if (details.length > 0) {
          const fullUser = { ...user, ...details[0] };
          localStorage.setItem("user", JSON.stringify(fullUser));
        } else {
          localStorage.setItem("user", JSON.stringify(user));
        }
        redirectByRole(user.role);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des détails :", err);
        localStorage.setItem("user", JSON.stringify(user));
        redirectByRole(user.role);
      });
  } else {
    localStorage.setItem("user", JSON.stringify(user));
    redirectByRole(user.role);
  }
}

// Fonction de redirection selon le rôle
function redirectByRole(role) {
  if (role === "rp") {
    window.location.href = "./views/rp/dashboardRp.html";
  } else if (role === "attache") {
    window.location.href = "attache.html";
  } else if (role === "student") {
    window.location.href = "student.html";
  } else {
    loginError.textContent = "Rôle inconnu.";
    loginError.classList.remove("hidden");
  }
}
