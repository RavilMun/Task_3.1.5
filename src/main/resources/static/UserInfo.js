let url = 'http://localhost:8080/api/user';

async function getUser() {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

async function addUserToTable(user) {
    let tbody = document.getElementById('userTbody');
    let roles = user.roles.map(role => role.roleName.replace('ROLE_', ' '));
    let dataOfUser = '';
    dataOfUser += `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>${roles}</td>
            </tr>`
    tbody.innerHTML = dataOfUser;
}

async function addInfoInNavbar(user) {
    try {
        let navbarEmail = document.getElementById('navbarEmail');
        let navbarRoles = document.getElementById('navbarRoles');
        navbarEmail.innerHTML = user.email;
        navbarRoles.innerHTML = user.roles.map(role => role.roleName.replace('ROLE_', ' '));
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchDataAndPopulateTable() {
    try {
        const user = await getUser();
        if (user) {
            await addUserToTable(user);
            await addInfoInNavbar(user);
        } else {
            console.error('No user data received.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDataAndPopulateTable()
    .then(() => {
        console.log('User info successfully');
    }).catch(error => {
    console.error('Error', error);
})