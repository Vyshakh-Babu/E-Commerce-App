const BASE_URL = "http://localhost:8080/ecom/api/v1";

var categoryList = document.getElementById("categoryList");
var productList = document.getElementById("productList");
var searchInput = document.getElementById("searchInput");
var minPrice = document.getElementById("minPrice");
var maxPrice = document.getElementById("maxPrice");
var clearBtn = document.getElementById("clearFilters");

searchInput.addEventListener("keyup", searchProducts);
minPrice.addEventListener("change", searchProducts);
maxPrice.addEventListener("change", searchProducts);
clearBtn.addEventListener("click", clearAllFilters);

function loadCategories() {
	fetch(BASE_URL + "/categories")
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

function renderCategories(categories) {
	let categoryListHtml = "";

	for (i = 0; i < categories.length; i++) {
		// <a class="d-flex text-decoration-none" href="productList.html?categoryId=categories[i].id">categories[i].name</a>
		categoryListHtml +=
			'<a class="d-flex text-decoration-none fw-semibold" href="productList.html?categoryId=' +
			categories[i].id +
			'">' +
			categories[i].name +
			"</a>";
	}
	categoryList.innerHTML = categoryListHtml;
}

loadCategories();

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

function loadProducts() {
	var currentUrl = window.location.search; //get search bar URL from browser window
	var urlParams = new URLSearchParams(currentUrl); //The URLSearchParams interface is used to manipulate query string parameters in a URL. It provides methods for accessing and modifying the parameters of a URL
	var categoryId = urlParams.get("categoryId");

	let URI = "/products";
	if (categoryId) {
		URI = `/categories/${categoryId}/products`;
	}

	fetch(BASE_URL + URI)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}
			return response.json();
		})
		.then((result) => {
			renderProducts(result);
		})
		.catch((error) => {
			console.error(error.message);
		});
}

function renderProducts(products) {
	productList.innerHTML = "";
	const productRow = document.createElement("div");
	productRow.className = "row mx-3";

	products.forEach((product) => {
		const productCard = document.createElement("div");
		productCard.className = "col-md-3 my-3";

		productCard.innerHTML = `
		<a class="text-decoration-none" href="productDetails.html?productId=${product.id}">
            <div class="card bg-secondary text-white">
                <img src="https://via.placeholder.com/700/000000/FFFFFF?text=+${product.name}" class="card-img-top" alt="Product Image Placeholder">
                <div class="card-body text-start">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">₹${product.cost}</p>
                </div>
            </div>
		</a>`;
		// <h6 class="card-title">ID: ${product.id}</h6>

		productRow.appendChild(productCard);
	});

	productList.appendChild(productRow);
}

loadProducts();

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

function searchProducts() {
	const params = {};

	if (searchInput.value.trim() !== "") {
		params.name = searchInput.value.trim();
	}
	if (!isNaN(minPrice.value)) {
		params.minCost = minPrice.value;
	}
	if (!isNaN(maxPrice.value)) {
		params.maxCost = maxPrice.value;
	}

	let URI = "/products?";
	const searchParams = new URLSearchParams(params);

	// Print all parameters
	// searchParams.forEach((value, key) => {
	//     console.log(`${key}: ${value}`);
	// });

	// console.log(BASE_URL + URI + searchParams);
	// http://localhost:8080/ecom/api/v1/products?name=tv&minCost=0&maxCost=0

	if (params.name != "") {
		fetch(BASE_URL + URI + searchParams)
			.then((response) => response.json())
			.then((result) => {
				renderProducts(result);
			})
			.catch((error) => {
				console.error(error.message);
			});
	} else {
		loadProducts();
	}
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

function clearAllFilters() {
    window.location.replace(window.location.origin + window.location.pathname);
}

//window.location.replace() is a method that replaces the current document with a new one. It is often used to navigate to a new page.

// window.location.origin 
// returns the protocol, hostname, and port number of the current URL.
// For example, if the current URL is http://example.com:8080/path/page.html, window.location.origin will be http://example.com:8080.

// window.location.pathname 
// returns the path of the current URL.
// For example, if the current URL is http://example.com/path/page.html, window.location.pathname will be /path/page.html.