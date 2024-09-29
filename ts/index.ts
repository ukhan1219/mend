import { json } from "express/lib/response";

const urlBase = 'http://98.81.175.225/api'
const extension = 'php'

let userID = 0;
let firstName = "";
let lastName = "";

function doResetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;

    if (newPassword === "") {
        alert("Please enter a new password");
    }

    let tmp = { "token": token, "newPassword": newPassword };

    let payload = JSON.stringify(tmp)

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
    let email = (document.getElementById("email") as HTMLInputElement).value;

    if (email === "") {
        showToast("Please enter your email");
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
                    showToast(err)
                } else {
                    showToast("A password reset link has been sent to your email");

                }
            }
        };
        xhr.send(payload);
    } catch (error) {
        showToast(error)
    }
}

function doRegister() {

    let firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    let lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    let username = (document.getElementById("username") as HTMLInputElement).value;
    let password = (document.getElementById("password") as HTMLInputElement).value;
    let email = (document.getElementById("email") as HTMLInputElement).value;

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
            if (xhr.readyState === 4 && xhr.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let err = jsonObject.err;

                if (err) {
                    showToast(err);
                    return;
                    // might not need 
                } else {
                    showToast("Registration successful");
                    window.location.href = "login.html";
                }
            }
        };
        xhr.send(payload);
    } catch (error) {
        showToast(error);
    }
}

function doLogin(event) {
    // Prevent form from submitting the traditional way
    event.preventDefault();

    // Initialize variables
    let userID = 0;
    let firstName = "";
    let lastName = "";

    // Get the values entered in the username and password fields
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Create a JSON payload with the entered username and password
    let tmp = { username: username, password: password };
    let jsonPayload = JSON.stringify(tmp);

    // Define the URL for the login API
    let url = urlBase + "/login." + extension;

    // Create a new XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Open a POST request to the login API
    xhr.open("POST", url, true);

    // Set the request headers
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Try sending the request
    try {
        xhr.onreadystatechange = function () {
            // When the request is completed successfully
            if (this.readyState == 4 && this.status == 200) {
                // Parse the response
                let jsonObject = JSON.parse(xhr.responseText);

                // Check for success in the response
                if (jsonObject.success) {
                    // Get user data and save it in cookies
                    userID = jsonObject.user.id;
                    firstName = jsonObject.user.firstName;
                    lastName = jsonObject.user.lastName;

                    // Save the user's information in cookies or session storage
                    saveCookie();

                    // Redirect to the account page
                    window.location.href = "account.html";
                } else {
                    // Handle error (like invalid username or password)
                    showToast(jsonObject.message || "Login failed.");
                }
            }
        };

        // Send the JSON payload with the request
        xhr.send(jsonPayload);
    } catch (err) {
        // If an error occurs, show the error message
        showToast("An error occurred: " + err.message);
    }
}


function doJournalEntry() {
    // TODO: change the element id's to whatever they actually are
    let entryDate = (document.getElementById("entryDate") as HTMLInputElement).value;
    let entryContent = (document.getElementById("entryContent") as HTMLInputElement).value;

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
    toast?.classList.remove('hidden');
    toast?.classList.add('visible');

    setTimeout(() => {
        toast?.classList.remove('visible');
        toast?.classList.add('hidden');
    }, 3000);

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
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userID") {
            userID = parseInt(tokens[1].trim());
        }
    }

    if (userID < 0) {
        alert("You are not logged in!");
        window.location.href = "login.html";
    }

    return { userID, firstName, lastName };
}

export {readCookie};
