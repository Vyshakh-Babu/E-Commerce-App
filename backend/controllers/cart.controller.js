const db = require("../models");
const Cart = db.cart;
const Product = db.product;
const Op = db.Sequelize.Op;
const { STATUS } = require("../configs/cart.status");
//----------------------------------------------------------------------------------------------------------------------
//POST: Creating cart with user id details mapped

exports.create = (req, res) => {
	const cart = {
		//we are getting this id from the middleware
		userId: req.userId,
		status: STATUS.CREATION,
	};

	Cart.create(cart)
		.then((cart) => {
			res.status(200).send(cart);
		})
		.catch((err) => {
			res.status(500).send({
				message: "Some internal error occurred while creating the cart",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//UPDATE: products in a cart and calculate total cost

exports.update = (req, res) => {
	const cartId = req.params.id;

	Cart.findByPk(cartId)
		.then((cart) => {
			Product.findAll({
				where: {
					id: req.body.productIds,
				},
			})
				.then((items) => {
					if (!items || items.length === 0) {
						return res.status(400).send({
							message: "Products trying to add doesn't exist",
						});
					}
			
					cart.addProducts(items).then(() => {
						console.log("Cart updated");
						var totalCost = 0;
						const ProductSelected = [];
						cart.getProducts().then((allProducts) => {
							for (let i = 0; i < allProducts.length; i++) {
								totalCost += allProducts[i].cost;
								ProductSelected.push({
									id: allProducts[i].id,
									name: allProducts[i].name,
									description: allProducts[i].description,
									status: allProducts[i].status,
									cost: allProducts[i].cost,
								});
							}

							res.status(200).send({
								id: cart.id,
								productSelected: ProductSelected,
								status: cart.status,
								cost: totalCost,
							});
						});
					});
				})
				.catch((err) => {
					console.log(`Error message: ${err.message}`);
					res.status(500).send({
						message:
							"Some internal error occurred while fetching the products details",
					});
				});
		})
		.catch((err) => {
			console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error occurred while fetching the cart details",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//GET: cart details

exports.getCart = (req, res) => {
	const cartId = req.params.cartId;

	Cart.findByPk(cartId)
		.then((cart) => {
			if (!cart) {
				return res.status(404).send({
					message: "Cart not found",
				});
			}

			console.log("Cart fetched");

			cart
				.getProducts()
				.then((allProducts) => {
					//map function to create an array of objects with the specified properties
					//For each element (product) in the array, a new object is created with specific properties (id, name, and cost).
					//This results in an array of objects, where each object represents a product with the selected properties.
					//Simplified way using destructuring - const ProductSelected = allProducts.map(({ id, name, cost }) => ({ id, name, cost }));
					const ProductSelected = allProducts.map((product) => ({
						id: product.id,
						name: product.name,
						description: product.description,
						status: product.status,
						cost: product.cost,
					}));
					
					//The reduce fn iterates over each element in the allProducts array, adding up the cost property of each product.
					//The sum parameter represents the running total, starting from an initial value of 0.
					const totalCost = allProducts.reduce(
						(sum, product) => sum + product.cost,
						0
					);

					res.status(200).send({
						id: cart.id,
						productSelected: ProductSelected,
						status: cart.status,
						cost: totalCost,
					});
				})
				.catch((err) => {
					console.log(`Error message: ${err.message}`);
					res.status(500).send({
						message:
							"Some internal error occurred while fetching the products details",
					});
				});
		})
		.catch((err) => {
			console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error occurred while fetching the cart details",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//DELETE: cart by id

exports.delete = (req, res) => {
	const cartId = req.params.id;

	Cart.destroy({
		where: {
			id: cartId,
		},
	})
		.then(() => {
			res.status(200).send({
				message: "Successfully deleted the cart",
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: "Some internal error occurred while deleting the cart",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//PUT: status by cart id

exports.updateStatus = (req, res) => {
	const cart = {
		status: req.body.status,
	};

	const cartId = req.params.id;
	// Get an array of STATUS values
	const statusValues = Object.values(STATUS);

	if (!statusValues.includes(cart.status)) {
		return res.status(400).send({
			message: "Failed! Status type does not exist = " + cart.status,
		});
	}else {
		Cart.update(cart, {
			where: { id: cartId }, // Specify the condition to update a specific cart by its ID
		})
			.then((updatedCart) => {
				//BELOW PIECE OF CODE IS FROM UPDATE CART HANDLER
				//updation successful, but while fetching that row and sending it to user there might be chance of error
				Cart.findByPk(cartId)
				.then((cart) => {		

					cart.getProducts()
						.then((allProducts) => {
							const ProductSelected = allProducts.map((product) => ({
								id: product.id,
								name: product.name,
								description: product.description,
								status: product.status,
								cost: product.cost,
							}));

							const totalCost = allProducts.reduce(
								(sum, product) => sum + product.cost,
								0
							);
		
							res.status(200).send({
								id: cart.id,
								productSelected: ProductSelected,
								status: cart.status,
								cost: totalCost,
							});
						})
						.catch((err) => {
							console.log(`Error message: ${err.message}`);
							res.status(500).send({
								message:
									"Some internal error occurred while fetching the products details",
							});
						});
				})
					.catch((err) => {
						console.log(`Error Message: ${err.message}`);
						res.status(500).send({
							message: "Some internal error while fetching the updated cart",
						});
					});
			})
			//updation not successful
			.catch((err) => {
				console.log(`Error Message: ${err.message}`);
				res.status(500).send({
					message: "Some internal error while updating the cart",
				});
			});
	}
};