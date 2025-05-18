    async function showPasswordFields() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');

        // Réinitialiser les messages d'erreur
        emailError.textContent = '';
        emailError.classList.add('hidden');

        if (!email) {
            emailError.textContent = 'Veuillez entrer une adresse email.';
            emailError.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            const users = await response.json();

            if (users.length > 0) {
                // Email existe
                document.getElementById('step1').classList.add('hidden');
                document.getElementById('step2').classList.remove('hidden');
                // Stocker l'ID utilisateur pour la mise à jour plus tard
                localStorage.setItem('userId', users[0].id);
            } else {
                emailError.textContent = "Cet email n'existe pas.";
                emailError.classList.remove('hidden');
            }
        } catch (error) {
            emailError.textContent = 'Erreur de connexion au serveur.';
            emailError.classList.remove('hidden');
        }
    }

    document.getElementById('passwordForm').onsubmit = async function(e) {
        e.preventDefault();
        const pwd1 = document.getElementById('newPassword').value;
        const pwd2 = document.getElementById('confirmPassword').value;
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';

        if (pwd1 !== pwd2) {
            errorMessage.textContent = "Les mots de passe ne correspondent pas.";
            errorMessage.classList.remove('hidden');
            return;
        }

        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: pwd1 })
            });

            if (response.ok) {
                alert("Mot de passe mis à jour avec succès !");
                window.location.href = "../index.html";
            } else {
                errorMessage.textContent = "Échec de la mise à jour du mot de passe.";
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = "Erreur lors de la mise à jour.";
            errorMessage.classList.remove('hidden');
        }
    }
