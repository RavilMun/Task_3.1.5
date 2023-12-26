document.getElementById('allUsersTbody').addEventListener('click', async function (event) {
    if (event.target.classList.contains('btn-edit')) {
        const userId = event.target.dataset.userId;
        let user = await getUser(userId);
        openEditModal(user);
    }
});

function openEditModal(user) {
    const modal = document.getElementById('editModal');

    document.getElementById('editUserForm').elements['id'].value = user.id;
    document.getElementById('editUserForm').elements['username'].value = user.username;
    document.getElementById('editUserForm').elements['password'].value = '';
    document.getElementById('editUserForm').elements['firstName'].value = user.firstName;
    document.getElementById('editUserForm').elements['lastName'].value = user.lastName;
    document.getElementById('editUserForm').elements['email'].value = user.email;

    $(modal).modal('show');
}

async function getUser(userId) {
    const response = await fetch(`http://localhost:8080/api/admin/get/${userId}`);
    return await response.json();
}

document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const selectedRoles = [];
    const rolesSelector = document.getElementById('rolesEdit');
    for (let i = 0; i < rolesSelector.options.length; i++) {
        if (rolesSelector.options[i].selected) {
            selectedRoles.push({roleName: rolesSelector.options[i].value, id: rolesSelector.options[i].id});
        }
    }

    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    formDataObject.roles = selectedRoles;

    const jsonPayload = JSON.stringify(formDataObject);

    try {
        const response = await fetch(`http://localhost:8080/api/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonPayload,
        });

        if (response.ok) {
            console.log('User updated:', formDataObject.username);
            $('#editModal').modal('hide');
            updateUserInTable(formDataObject)
        } else {
            console.error('Failed to update user:', response.statusText);
        }
    } catch (error) {
        console.error('Error during update:', error);
    }
});

async function updateUserInTable( updatedUserData) {
    const tbody = document.getElementById('allUsersTbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const rowUserId = rows[i].getElementsByTagName('td')[0].innerText;

        if (rowUserId === updatedUserData.id) {
            rows[i].getElementsByTagName('td')[1].innerText = updatedUserData.firstName;
            rows[i].getElementsByTagName('td')[2].innerText = updatedUserData.lastName;
            rows[i].getElementsByTagName('td')[3].innerText = updatedUserData.email;
            rows[i].getElementsByTagName('td')[4].innerText = updatedUserData.username;
            rows[i].getElementsByTagName('td')[5].innerText = updatedUserData.roles.map(role => role.roleName.replace('ROLE_', ' '));
            break;
        }
    }
}