
const urlBase = 'https://98.81.175.225/LAMPAPI';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

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



function doLogin() {
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


                window.location.href = "pages/dashboard.html";
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
                window.location.href = "journalEntries.html";
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
