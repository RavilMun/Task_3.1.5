const form = document.getElementById('addNewUserForm');
let urlGetAddedUser;
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = document.getElementById('addNewUserForm');

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

    const jsonPayload = JSON.stringify(formDataObject);

    fetch('http://localhost:8080/api/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonPayload,
    }).then(res => {
        if (!res.ok) {
            throw new Error('Failed to add user');
        } else {
            fetchDataAndPopulateTable();
            document.getElementById('addNewUserForm').reset();
            $('#userTableButton').click();
        }
    })
        .catch(err => console.error('Error:', err));
});

async function getUser() {
    const response = await fetch(urlGetAddedUser);
    return await response.json();
}

async function fetchDataAndPopulateTable() {
    try {
        const user = await getUser();
        if (user) {
            await addUserToTable(user)
        } else {
            console.error('No user data received.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addUserToTable(user) {
    let tbody = document.getElementById('allUsersTbody');
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
}



