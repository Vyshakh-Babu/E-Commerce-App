console.clear();
// const BASE_URL = "https://ecommce-be.herokuapp.com/ecomm/api/v1";
const BASE_URL = "http://localhost:8080/ecom/api/v1";

document.addEventListener("DOMContentLoaded", function () {

var signUpBtn = document.getElementById("signupBtn");
var login = document.getElementById("loginBtn");
var signUpUsername = document.getElementById("signUpUsername");
var signUpPwd = document.getElementById("signUpPwd");
var signUpEmail = document.getElementById("signUpEmail");
var loginUsername = document.getElementById("loginUsername");
var loginPwd = document.getElementById("loginPwd");
var authErrMsg = document.getElementById("authErrMsg");
var authSuccMsg = document.getElementById("authSuccMsg");

signUpBtn.addEventListener("click", signUpProcess);
login.addEventListener("click", loginProcess);

function signUpProcess() {
    if (signUpUsername.value == "") {
        updateAuthErrMsg("Username should not be empty");
    } else if (signUpPwd.value == "") {
        updateAuthErrMsg("Password should not be empty");
    } else if (signUpEmail.value == "") {
        updateAuthErrMsg("Email should not be empty");
    } else {
        console.log("Signup started");
        const data = {
            username: signUpUsername.value,
            email: signUpEmail.value,
            password: signUpPwd.value,
        };

        fetch(BASE_URL + "/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        // const errorMessage = `HTTP error! Status: ${response.status}, Message: ${errorData.message}`;
                        throw new Error(errorData.message);
                    });
                }
                // Parse the response body as JSON and log it
                return response.json().then((parsedData) => {
                    updateAuthSuccMsg(parsedData.message);
                    console.log("Parsed JSON response:", parsedData);
                });
            })
            .catch((error) => {
                console.error("Error:", error);
                updateAuthErrMsg(error);
            });
    }
}

function loginProcess() {
    if (loginUsername.value == "") {
        updateAuthErrMsg("Username should not be empty");
    } else if (loginPwd.value == "") {
        updateAuthErrMsg("Password should not be empty");
    } else {
        console.log("Login started");
        const data = {
            username: loginUsername.value,
            password: loginPwd.value,
        };

        fetch(BASE_URL + "/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message);
                    });
                }
                return response.json().then((parsedData) => {
                    if (parsedData.accessToken) {
                        localStorage.setItem("userId", parsedData.id);
                        localStorage.setItem("username", parsedData.username);
                        localStorage.setItem("email", parsedData.email);
                        localStorage.setItem("token", parsedData.accessToken);
                        createCart();
                        updateAuthSuccMsg('User logged in successfully');
                    } else {
                        throw new Error('Login failed. No token received');
                    }
                    // return parsedJson; // Pass the parsed JSON to the next then block
                });
            })
            .catch((error) => {
                console.error("Error:", error);
                updateAuthErrMsg(error);
            });
    }
}

const updateAuthErrMsg = (msg) => {
    clearFields();
    authErrMsg.innerText = msg;
};

const updateAuthSuccMsg = (msg) => {
    clearFields();
    authSuccMsg.innerText = msg;
};

const clearFields = () => {
    authErrMsg.innerText = "";
    authSuccMsg.innerText = "";
    signUpUsername.value = "Vyshakh";
    signUpPwd.value = "vys123";
    signUpEmail.value = "vyshakh.mmb@gmail.com";
    loginUsername.value = "Vyshakh";
    loginPwd.value = "vys123";
};

function createCart() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        "x-access-token": token
    }

    fetch(BASE_URL + "/carts", {
        method: 'POST',
        headers: headers,
        // body: JSON.stringify(userId)
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.message);
                });
            }
            return response.json().then((parsedData) => {
                localStorage.setItem("cartId", parsedData.id);
                console.log('Cart created successfully');
                window.location.href = "index.html";
            }).catch((errorData) => { throw new Error(errorData.message) });
        })
        .catch((error) => {
            console.error("Error:", error);
            updateAuthErrMsg(error);
        });
}

if(localStorage.getItem('username')){
    window.location.href = 'index.html'
}

});