const BASE_URL = "http://localhost:8080/ecom/api/v1";
const cartTable = document.getElementById("cartTable");
const totalCost = document.getElementById("totalCost");
const tableBlock = document.getElementById("tableBlock");
const confirmPurchaseBtn = document.getElementById("confirmPurchaseBtn");
confirmPurchaseBtn.addEventListener("click", resetCart);

const cartId = localStorage.getItem("cartId");
const token = localStorage.getItem("token");
let URI = `/carts/${cartId}`;
const headers = {
	"Content-Type": "application/json",
	"x-access-token": token,
};

function loadCart() {
	fetch(BASE_URL + URI, {
		headers: headers,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch cart details");
			}
			return response.json();
		})
		.then((result) => {
			console.log(result);
			if (
				result &&
				result.productSelected &&
				result.productSelected.length > 0
			) {
				renderCartDetails(result);
			} else {
				showCartEmpty();
			}
		})
		.catch((error) => {
			console.error(error.message);
		});
}

function showCartEmpty() {
	tableBlock.classList.toggle("d-none");
	const emptyMsg = document.createElement("div");
	const emptyMsgH1 = document.createElement("h1");
	emptyMsgH1.classList.add(
		"bg-danger",
		"text-white",
		"text-center",
		"m-5",
		"p-5"
	);
	emptyMsgH1.textContent = "Your cart is empty";
	emptyMsg.appendChild(emptyMsgH1);
	tableBlock.parentNode.insertBefore(emptyMsg, tableBlock.nextSibling);
}

function renderCartDetails(cartData) {
	let cartListHtml = "";
	for (i = 0; i < cartData.productSelected.length; i++) {
		cartListHtml += `<tr>
						<td>${cartData.productSelected[i].name}</td>
						<td>${cartData.productSelected[i].description}</td>
						<td>₹${cartData.productSelected[i].cost}</td>
					</tr>`;
	}

	cartTable.innerHTML = cartListHtml;
	totalCost.innerText = cartData.cost;
}

loadCart();
//-----------------------------------------------------------------------------------------------------------------------------------------
function showSuccessToast() {
	if (window.successToast) {
		// Show the toast
		window.successToast.show();
	} else {
		console.error("Error: successToast is not defined or null.");
	}
}

function resetCart() {
	// Step 1: Delete the existing cart
	fetch(BASE_URL + URI, {
		method: "DELETE",
		headers: headers,
	})
		.then((deleteResponse) => {
			if (!deleteResponse.ok) {
				throw new Error("Failed to delete cart");
			}
			// Step 2: Create a new cart
			return fetch(BASE_URL + "/carts", {
				method: "POST",
				headers: headers,
			});
		})
		.then((createResponse) => {
			if (!createResponse.ok) {
				throw new Error("Failed to create a new cart");
			}
			// Step 3: Get the new cart data
			return createResponse.json();
		})
		.then((newCartData) => {
			// Step 4: Set the new cartId in local storage
			try {
				localStorage.setItem("cartId", newCartData.id);
				cartTable.innerHTML = "";
				totalCost.innerText = "";
				showCartEmpty();
				showSuccessToast();
				setTimeout(() => {
					window.location.href = "index.html";
				}, 2000);
			} catch (localStorageError) {
				console.error(
					"Error setting cartId in local storage:", localStorageError);
			}
		})
		.catch((error) => {
			// If any error occurs in the deleteResponse, createResponse, or newCartData promises, the control will jump to the nearest .catch() block.
			console.error(error.message);
		});
}
