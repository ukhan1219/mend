const urlBase = 'https://98.81.175.225/LAMPAPI';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

let journalEntriesData = [];


function fetchJournalEntries() {
    readCookie();

    let url = urlBase + "/fetchJournalEntries." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    let tmp = { userID: userID };
    let payload = JSON.stringify(tmp);

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let journalEntries = jsonObject.results;

                let journalEntriesBody = document.getElementById("journal-entries-body");
                journalEntriesBody.innerHTML = "";

                // Store fetched entries in the global variable
                journalEntriesData = journalEntries;

                // Populate the journal entries
                if (journalEntries && Array.isArray(journalEntries)) {
                    for (let i = 0; i < journalEntries.length; i++) {
                        let entry = journalEntries[i];
                        let row = document.createElement("tr");

                        row.innerHTML = `
                            <td><a href="#" onclick="viewEntry(${entry.ID})">${entry.entryDate}</a></td>
                        `;

                        journalEntriesBody.appendChild(row);
                    }
                } else {
                    showToast("No journal entries found or invalid response from the server.");
                }
            }
        };
        xhr.send(payload);
    } catch (err) {
        console.log(err.message);
    }
}

function viewEntry(id) {
    // Find the entry with the given ID
    let entry = journalEntriesData.find(e => e.ID === id);
    if (entry) {
        // Construct a URL with query parameters to pass the entry details
        const entryUrl = `viewEntry.html?id=${entry.ID}&date=${encodeURIComponent(entry.entryDate)}&content=${encodeURIComponent(entry.entryContent)}`;
        
        // Redirect to the new page
        window.location.href = entryUrl;
    } else {
        showToast("Entry not found.");
    }
}



function closeModal() {
    document.getElementById("entryModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    let modal = document.getElementById("entryModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function checkLogin() {
    let { userID } = readCookie(); // Check the login status by reading the cookie

    if (userID < 0) {  // If the user is not logged in (userID < 0)
        alert("You need to log in to access this page.");
        window.location.href = "login.html"; // Redirect to login page
    }
}

function doResetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const newPassword = document.getElementById("newPassword").value;

    if (newPassword === "") {
        alert("Please enter a new password");
        return; // Added return to prevent further execution
    }

    let tmp = { "token": token, "newPassword": newPassword };
    let payload = JSON.stringify(tmp);
    let url = urlBase + "/reset." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let err = jsonObject.err;

                if (err) {
                    showToast(err);
                } else {
                    showToast("Password reset successfully");
                    window.location.href = "login.html";
                }
            }
        };
        xhr.send(payload);
    } catch (error) {
        showToast(error);
    }
}

function doForgotPassword() {

    let email = document.getElementById("email").value;

    if (email === "") {
        showToast("Please enter your email");
        return; // Added return to prevent further execution
    }

    let tmp = { email: email };
    let payload = JSON.stringify(tmp);
    let url = urlBase + "/forgot." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let err = jsonObject.err;

                if (err) {

                    showToast(err);
                } else {
                    showToast("A password reset link has been sent to your email");

                }
            }
        };
        xhr.send(payload);
    } catch (error) {

        showToast(error);

    }
}

function doRegister() {
    console.log("Form submitted");
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (firstName === "" || lastName === "" || username === "" || password === "" || email === "") {
        showToast("Please fill in all fields");
        return;
    }

    let tmp = { firstName: firstName, lastName: lastName, email: email, username: username, password: password };
    let payload = JSON.stringify(tmp);
    let url = urlBase + "/register." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    let err = jsonObject.error;
                    if (err) {
                        showToast(err);
                        return;
                    }
                    showToast("Registration successful");
                    window.location.href = "login.html";

                } else {
                    showToast("Error: " + xhr.statusText); // Handle unexpected HTTP response
                }
            }
        };
        xhr.send(payload);
    } catch (error) {
        showToast("Error: " + error.message); // Catch errors in a more informative way
    }
}

function doLogout() {
    userID = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function doLogin(event) {
    event.preventDefault();
    userID = 0;
    firstName = "";
    lastName = "";


    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let tmp = { username: username, password: password };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/login." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                let err = jsonObject.err;
                userID = jsonObject.id;

                if (userID < 1) {
                    showToast("Username/Password combination incorrect");

                    return; // might not need 

                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();


                window.location.href = "dashboard.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {

        showToast(err);
    }
}

function doJournalEntry() {
    // TODO: change the element id's to whatever they actually are

    let entryDate = document.getElementById("entryDate").value;
    let entryContent = document.getElementById("entryContent").value;


    if (entryDate === "" || entryContent === "") {
        showToast("Please fill in both the date and content");
        return;
    }

    // Assuming userID is already available from login
    let tmp = { userID: userID, entryDate: entryDate, entryContent: entryContent };

    let payload = JSON.stringify(tmp);
    let url = urlBase + "/addJournalEntry." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let err = jsonObject.err;

                if (err) {
                    showToast(err);
                    return;
                }

                showToast("Journal entry added successfully");
                // Optionally, you can redirect the user to another page or reset the form fields
                fetchJournalEntries();
            }
        };
        xhr.send(payload);
    } catch (error) {
        showToast(error);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toastMessage) {
        toastMessage.textContent = message;
    }

    if (toast) {
        toast.classList.remove('hidden');
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
            toast.classList.add('hidden');
        }, 3000);
    }

}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toUTCString();
}

function readCookie() {
    userID = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];

        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userID") {

            userID = parseInt(tokens[1].trim());
        }
    }

    if (userID < 0) {
        alert("You are not logged in!");
        window.location.href = "login.html";
    }

    return { userID, firstName, lastName };
}

// export default readCookie;
