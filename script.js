document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Función para activar un tab
    function activateTab(tabId) {
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    // Event listeners para los botones de los tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });
    });

    // Función para renderizar la tabla
    function renderMembersTable(members, tableId) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos miembros

        if (members.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No hay miembros para mostrar en esta categoría.</td></tr>`;
            return;
        }

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

            if (member.socials && member.socials.length > 0) {
                member.socials.forEach(social => {
                    const link = document.createElement('a');
                    link.href = social.url;
                    link.textContent = social.platform;
                    link.target = "_blank"; // Abrir en una nueva pestaña
                    link.rel = "noopener noreferrer"; // Buena práctica de seguridad
                    socialLinksDiv.appendChild(link);
                });
            } else {
                socialLinksDiv.textContent = "N/A";
            }
            socialsCell.appendChild(socialLinksDiv);
            row.appendChild(socialsCell);

            tableBody.appendChild(row);
        });
    }

    // Cargar los miembros y renderizar las tablas
    fetch('miembros.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(allMembers => {
            // Filtrar miembros por rol
            const members = allMembers.filter(member => member.roles.includes('Miembro'));
            const staff = allMembers.filter(member => member.roles.includes('Staff'));
            const representantes = allMembers.filter(member => member.roles.includes('Representante'));

            // Renderizar cada tabla
            renderMembersTable(members, 'membersTable_miembros');
            renderMembersTable(staff, 'membersTable_staff');
            renderMembersTable(representantes, 'membersTable_representantes');

            // Activar el primer tab por defecto (Miembros)
            activateTab('miembros');
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los miembros:', error);
            // Mostrar un mensaje de error en todas las tablas si falla la carga
            document.querySelectorAll('.tab-content tbody').forEach(tbody => {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">No se pudieron cargar los miembros. Inténtalo de nuevo más tarde.</td></tr>`;
            });
        });
});