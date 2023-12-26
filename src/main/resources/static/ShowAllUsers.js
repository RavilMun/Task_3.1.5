let url = 'http://localhost:8080/api/admin';

async function getUsers() {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

export async function addUsersToTable(users) {
    let tbody = document.getElementById('allUsersTbody');

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

async function fetchDataAndPopulateTable() {
    try {
        const users = await getUsers();
        if (users && Array.isArray(users)) {
            await addUsersToTable(users);
        } else {
            console.error('No user data received.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
fetchDataAndPopulateTable()
    .then(() => {
        console.log('Table populated successfully');
    }).catch(error => {
    console.error('Error', error);
});
