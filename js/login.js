import { users } from './users.js';
const userInfo = document.getElementById("loginInfo");

if (userInfo) {
    userInfo.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("userName").value.trim();
        const password = document.getElementById("userPassword").value.trim();
        /*check username & password */
        if (username && password) {
            const isValid = users.some(user => user.username === username && user.password === password);
            if (isValid) {
                localStorage.setItem("currentUser", username);
                window.location.href = "index.html";
            } else {
                alert("Can't find the user");
            }
        } else {
            alert("Error! Please check it again.");
        };
    });
}