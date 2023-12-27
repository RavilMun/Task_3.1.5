const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
showAllUsers();
addNewUser()
deleteUser();
editUser();
rolesSelector();
async function getUsers(url) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

async function addUsersToTable(users) {
    let tbody = document.getElementById('allUsersTbody');

    if (!Array.isArray(users)) {
        users = [users];
    }

    users.forEach(user => {
        let row = document.createElement('tr');
        let roles = user.roles.map(role => role.roleName.replace('ROLE_', ' '));
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${roles}</td>
            <td>
                <button type="button"
                        class="btn btn-success btn-edit"
                        data-toggle="modal"
                        data-user-id="${user.id}"
                        style="background-color: darkcyan;
                        border-color: darkcyan">
                            Edit
                </button>
            </td>
            <td>
                <button type="button"
                        class="btn btn-success btn-delete"
                        data-toggle="modal"
                        data-user-id="${user.id}"
                        style="background-color: #ea2525;
                        border-color: #ea2525">
                            Delete
                </button>
            </td>`;
        tbody.appendChild(row);
    })
}



async function showAllUsers() {
    const users = await getUsers('http://localhost:8080/api/admin')
    addUsersToTable(users)
}

async function addNewUser() {
    const form = document.getElementById('addNewUserForm');
    let urlGetAddedUser;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const selectedRoles = [];
        const rolesSelector = document.getElementById('rolesSelector');
        for (let i = 0; i < rolesSelector.options.length; i++) {
            if (rolesSelector.options[i].selected) {
                selectedRoles.push({roleName: rolesSelector.options[i].value, id: rolesSelector.options[i].id});
            }
        }
        const formData = new FormData(form);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        formDataObject.roles = selectedRoles;
        urlGetAddedUser = `http://localhost:8080/api/admin/${formDataObject.username}`;
        const json = JSON.stringify(formDataObject);

        const response = await fetch('http://localhost:8080/api/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            body: json,
        });
        if (!response.ok) {
            throw new Error('Failed to add user');
        } else {
            const user = await getUsers(urlGetAddedUser);
            console.log(`User ${formDataObject.username} added`)
            addUsersToTable(user);
            document.getElementById('addNewUserForm').reset();
            $('#userTableButton').click();
        }
    });
}

function openModal(user, modalId, formId) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);

    form.elements['id'].value = user.id;
    form.elements['username'].value = user.username;
    form.elements['password'].value = '';
    form.elements['firstName'].value = user.firstName;
    form.elements['lastName'].value = user.lastName;
    form.elements['email'].value = user.email;

    if (modalId === 'deleteModal') {
        const rolesDelete = document.getElementById('rolesDelete');
        rolesDelete.innerHTML = '';
        user.roles.forEach(role => {
            const optionForEdit = document.createElement('option');
            optionForEdit.textContent = role.roleName.replace('ROLE_', '');
            rolesDelete.appendChild(optionForEdit);
        })
    }
    $(modal).modal('show');
}

function deleteUser() {
    let urlDelete;
    let userID;

    document.getElementById('allUsersTbody').addEventListener('click', async function (event) {
        if (event.target.classList.contains('btn-delete')) {
            const userId = event.target.dataset.userId;
            userID = userId;
            urlDelete = `http://localhost:8080/api/admin/${userId}`;
            let user = await getUsers(`http://localhost:8080/api/admin/get/${userId}`);
            openModal(user, 'deleteModal', 'deleteUserForm');
        }
    });

    document.getElementById('deleteUserForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const response = await fetch(urlDelete, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': csrfToken }
            });

            if (response.ok) {
                console.log('User deleted');
                $('#deleteModal').modal('hide');
                removeUserFromTable(userID)
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
}

function editUser() {
    document.getElementById('allUsersTbody').addEventListener('click', async function (event) {
        if (event.target.classList.contains('btn-edit')) {
            const userId = event.target.dataset.userId;
            let user = await getUsers(`http://localhost:8080/api/admin/get/${userId}`);
            openModal(user, 'editModal', 'editUserForm');
        }
    });

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
        const json = JSON.stringify(formDataObject);

        const response = await fetch(`http://localhost:8080/api/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
            body: json,
        });
        if (response.ok) {
            console.log('User updated:', formDataObject.username);
            $('#editModal').modal('hide');
            updateUserInTable(formDataObject)
        } else {
            console.error('Failed to update user:', response.statusText);
        }

    });

    async function updateUserInTable(updatedUserData) {
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
}

async function rolesSelector() {

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
}

$(document).ready(function () {
    $("#userInfo").hide();

    // Обработчик события клика на кнопке User
    $("#userButton").click(function () {
        $("#adminPanel").hide();
        $("#addNewUser").hide();
        $("#userInfo").show();
    });

    // Обработчик события клика на кнопке Admin
    $("#adminButton").click(function () {
        $("#userInfo").hide();
        $("#adminPanel").show();
        $("#userTableButton").click();
    });

    // Обработчик события клика на кнопке New User
    $("#newUserButton").click(function () {
        $("#adminPanel2").hide();
        $("#addNewUser").show();
        $("#adminPanel").show();
    });

    // Обработчик события клика на кнопке User table
    $("#userTableButton").click(function () {
        $("#addNewUser").hide();
        $("#userInfo").hide();
        $("#adminPanel2").show();
        $("#adminPanel").show();
    });

});