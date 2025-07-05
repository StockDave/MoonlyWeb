document.addEventListener('DOMContentLoaded', () => {
    const membersTableBody = document.querySelector('#membersTable tbody');

    fetch('miembros.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(members => {
            members.forEach(member => {
                const row = document.createElement('tr');

                // Celda de Imagen de Perfil
                const profileImageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = member.profileImage;
                img.alt = `Imagen de perfil de ${member.name}`;
                img.classList.add('profile-image');
                profileImageCell.appendChild(img);
                row.appendChild(profileImageCell);

                // Celda de Nombre
                const nameCell = document.createElement('td');
                nameCell.textContent = member.name;
                row.appendChild(nameCell);

                // Celda de Redes Sociales
                const socialsCell = document.createElement('td');
                const socialLinksDiv = document.createElement('div');
                socialLinksDiv.classList.add('social-links');

                member.socials.forEach(social => {
                    const link = document.createElement('a');
                    link.href = social.url;
                    link.textContent = social.platform;
                    link.target = "_blank"; // Abrir en una nueva pestaña
                    link.rel = "noopener noreferrer"; // Buena práctica de seguridad
                    socialLinksDiv.appendChild(link);
                });
                socialsCell.appendChild(socialLinksDiv);
                row.appendChild(socialsCell);

                membersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los miembros:', error);
            // Mostrar un mensaje de error en la tabla si falla la carga
            membersTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">No se pudieron cargar los miembros. Inténtalo de nuevo más tarde.</td></tr>`;
        });
});