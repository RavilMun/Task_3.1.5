
let urlDelete;
let userId;
document.getElementById('allUsersTbody').addEventListener('click', async function (event) {
    if (event.target.classList.contains('btn-delete')) {
        userId = event.target.dataset.userId;
        let user = await getUser(userId);
        urlDelete = `http://localhost:8080/api/admin/${user.id}`
        openDeleteModal(user);
    }
});

function openDeleteModal(user) {
    const modal = document.getElementById('deleteModal');

    document.getElementById('deleteUserForm').elements['id'].value = user.id;
    document.getElementById('deleteUserForm').elements['username'].value = user.username;
    document.getElementById('deleteUserForm').elements['firstName'].value = user.firstName;
    document.getElementById('deleteUserForm').elements['lastName'].value = user.lastName;
    document.getElementById('deleteUserForm').elements['email'].value = user.email;
    document.getElementById('deleteUserForm').elements['roles'].value = user.roles.map(role => role.roleName.replace('ROLE_', ' '));

    const rolesDelete = document.getElementById('rolesDelete');
    rolesDelete.innerHTML = '';
    user.roles.forEach(role => {
        const optionForEdit = document.createElement('option');
        optionForEdit.textContent = role.roleName.replace('ROLE_', '');
        rolesDelete.appendChild(optionForEdit);
    })

    $(modal).modal('show');
}

async function getUser(userId) {
    const response = await fetch(`http://localhost:8080/api/admin/get/${userId}`);
    return await response.json();
}

document.getElementById('deleteUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const response = await fetch(urlDelete, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('User deleted');
            $('#deleteModal').modal('hide');
            removeUserFromTable(userId)
        } else {
            console.error('Failed to delete user:', response.statusText);
        }
    } catch (error) {
        console.error('Error during delete:', error);
    }
});

function removeUserFromTable(userId) {
    const tbody = document.getElementById('allUsersTbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const rowUserId = rows[i].getElementsByTagName('td')[0].innerText;

        if (rowUserId === userId) {
            tbody.removeChild(rows[i]);
            break;
        }
    }
}