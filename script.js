document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function activateTab(tabId) {
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });
    });

    function renderMembersTable(members, tableId) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = '';

        if (members.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No hay miembros para mostrar en esta categoría.</td></tr>`;
            return;
        }

        members.forEach(member => {
            const row = document.createElement('tr');

            const profileImageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = member.profileImage;
            img.alt = `Imagen de perfil de ${member.name}`;
            img.classList.add('profile-image');
            profileImageCell.appendChild(img);
            row.appendChild(profileImageCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = member.name;
            row.appendChild(nameCell);

            const socialsCell = document.createElement('td');
            const socialLinksDiv = document.createElement('div');
            socialLinksDiv.classList.add('social-links');

            if (member.socials && member.socials.length > 0) {
                member.socials.forEach(social => {
                    const link = document.createElement('a');
                    link.href = social.url;
                    link.textContent = social.platform;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
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

    fetch('miembros.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(allMembers => {
            const members = allMembers.filter(member => member.roles.includes('Miembro'));
            const staff = allMembers.filter(member => member.roles.includes('Staff'));
            const representantes = allMembers.filter(member => member.roles.includes('Representante'));
            const artistas = allMembers.filter(member => member.roles.includes('Artista'));
            const ceo = allMembers.find(member => member.roles.includes('CEO'));

            renderCEOSocials(ceo);
            renderMembersTable(members, 'membersTable_miembros');
            renderMembersTable(artistas, 'membersTable_miembros_artistas');
            renderMembersTable(staff, 'membersTable_staff');
            renderMembersTable(representantes, 'membersTable_representantes');

            activateTab('miembros');
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los miembros:', error);
            document.querySelectorAll('.tab-content tbody').forEach(tbody => {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">No se pudieron cargar los miembros.</td></tr>`;
            });
        });

    // Lógica del menú lateral
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    const sectionButtons = sidebar.querySelectorAll('li');
    const allSections = ['mainContent', 'aboutMoonly', 'ceoSection'];

    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.section;

            allSections.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    section.style.display = (id === target) ? 'block' : 'none';
                }
            });

            if (target === 'mainContent') {
                document.querySelector('.tab-button[data-tab="miembros"]').click();
            }

            sidebar.classList.remove('active');
        });
    });

    mostrarSeccionDesdeHash();

    window.addEventListener('hashchange', mostrarSeccionDesdeHash);
});

function mostrarSeccionDesdeHash() {
    const hash = location.hash.replace('#', '');

    const mapa = {
        'miembros': 'mainContent',
        'acercaDeMoonly': 'aboutMoonly',
        'nuestraCEO': 'ceoSection'
    };

    const destino = mapa[hash];
    if (destino) {

        ['mainContent', 'aboutMoonly', 'ceoSection'].forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = (id === destino) ? 'block' : 'none';
        });

        if (destino === 'mainContent') {
            document.querySelector('.tab-button[data-tab="miembros"]').click();
        }

        sidebar.classList.remove('active');
    }
}


function renderCEOSocials(member) {
    const socialsDiv = document.getElementById('ceoSocials');
    if (!member || !member.socials || member.socials.length === 0) {
        socialsDiv.innerHTML = "<p>No hay redes sociales disponibles.</p>";
        return;
    }

    member.socials.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.textContent = social.platform;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        socialsDiv.appendChild(link);
    });
}