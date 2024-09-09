// const BASE_URL = "http://localhost:8080/ecom/api/v1";
fetch("navbar.html")
	.then((response) => response.text())
	.then((data) => {
		// Inject the content into the navbarContainer
		document.getElementById("navbarContainer").innerHTML = data;

		var usernameLabel = document.getElementById("usernameLabel");
		usernameLabel.innerText = localStorage.getItem("username");

		const logoutBtn = document.getElementById("logoutBtn");
		logoutBtn.addEventListener("click", logoutProcess);
		function logoutProcess() {
			localStorage.clear();
			window.location.href = "login.html";
		}
	})
	.catch((error) => console.error("Error fetching navbar content:", error));
