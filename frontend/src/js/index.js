const BASE_URL = "http://localhost:8080/ecom/api/v1";
var categoryList = document.getElementById("categoryList");

function loadCategories() {
	const token = localStorage.getItem("token");
	const headers = {
		"Content-Type": "application/json",
		"x-access-token": token,
	};

	fetch(BASE_URL + "/categories", {
		method: "GET",
		headers: headers,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}

			return response.json();
		})
		.then((result) => {
			renderCategories(result);
		})
		.catch((error) => {
			console.error(error.message);
		});
}

loadCategories();

function renderCategories(categories) {
	if (!Array.isArray(categories) || categories.length === 0) {
		console.error("Invalid or empty categories data");
		return;
	}

	categories.forEach((category) => {
		const categoryCard = document.createElement("div");
        categoryCard.className = "col-md-4 my-5 mx-auto"

		categoryCard.innerHTML = `
            <div class="card bg-success text-white">
                <div class="card-body text-start">
                    <h6 class="card-title">ID: ${category.id}</h6>
                    <h5 class="card-title">Name: ${category.name}</h5>
                    <p class="card-text">Description: ${category.description}</p>
                </div>
            </div>`;

		// <p class="card-text">Created At: ${category.createdAt}</p>
		// <p class="card-text">Updated At: ${category.updatedAt}</p>
		categoryList.appendChild(categoryCard);
	});
}
