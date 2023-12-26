async function rolesSelector() {
    try {
        const response = await fetch('http://localhost:8080/api/admin/roles');
        if (!response.ok) {
            throw new Error(`Failed to fetch roles: ${response.status}`);
        }
        const roles = await response.json();
        const rolesSelector = document.getElementById('rolesSelector');
        const rolesEdit = document.getElementById('rolesEdit');
        rolesSelector.innerHTML = '';
        rolesEdit.innerHTML = '';
        roles.forEach(role => {
            const optionForSelector = document.createElement('option');
            optionForSelector.id = role.id;
            optionForSelector.value = role.roleName;
            optionForSelector.textContent = role.roleName.replace('ROLE_', '');
            rolesSelector.appendChild(optionForSelector);

            const optionForEdit = document.createElement('option');
            optionForEdit.id = role.id;
            optionForEdit.value = role.roleName;
            optionForEdit.textContent = role.roleName.replace('ROLE_', '');
            rolesEdit.appendChild(optionForEdit);
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
}

rolesSelector();
