const BASE_URL = "http://localhost:8080/ecom/api/v1";

var productImg = document.getElementById("productImg");
var productInfo = document.getElementById("productInfo");
var addCartBtn = document.getElementById("addCartBtn");
// var delFromCartBtn = document.getElementById("delFromCartBtn");
var gotoCartBtn = document.getElementById("gotoCartBtn");

addCartBtn.addEventListener("click", addToCart);
// delFromCartBtn.addEventListener("click", deleteFromCart);

function loadProduct() {
	var currentUrl = window.location.search; //get search bar URL from browser window
	var urlParams = new URLSearchParams(currentUrl); //The URLSearchParams interface is used to manipulate query string parameters in a URL. It provides methods for accessing and modifying the parameters of a URL
	var productId = urlParams.get("productId");

	let URI = `/products/${productId}`;

	fetch(BASE_URL + URI)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}
			return response.json();
		})
		.then((result) => {
			renderProductDetails(result);
		})
		.catch((error) => {
			console.error(error.message);
		});
}

function renderProductDetails(product) {
	productImg.src = `https://via.placeholder.com/500/000000/FFFFFF?text=${product.name}+${product.description}`;
	productInfo.innerHTML = `<h2>${product.description}</h2>                     
                            <h3 class="text-warning"><strong>₹${product.cost}</strong></h3>`;
}

loadProduct();

function addToCart() {
	var currentUrl = window.location.search;
	var urlParams = new URLSearchParams(currentUrl);
	var productId = urlParams.get("productId");

	const cartId = localStorage.getItem("cartId");
	const token = localStorage.getItem("token");

	const headers = {
		"Content-Type": "application/json",
		"x-access-token": token,
	};

	const data = {
		productIds: [productId],
	};
	console.log(data);
	fetch(BASE_URL + `/carts/${cartId}`, {
		method: "PUT",
		headers: headers,
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((result) => {
			console.log(result);
			if (result) {
				gotoCartBtn.classList.toggle("d-none");
				// delFromCartBtn.classList.toggle("d-none");
				addCartBtn.classList.toggle("d-none");
			}
		});
}

// function deleteFromCart() {
// }
