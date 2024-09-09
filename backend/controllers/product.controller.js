/*
This file contain the logic for product resource.
Every time any CRUD request comes for the product, methods defined in this controller file will be executed.
*/

const db = require("../models");
const Product = db.product; //gives access to products table created using sequelize
const Op = db.Sequelize.Op; //importing the Op object from Sequelize. const myOp or any name is fine.

//Create and save a new product
exports.create = async (req, res) => {
	const product = {
		name: req.body.name,
		description: req.body.description,
		cost: req.body.cost,
		categoryId: req.body.categoryId,
	};

/*
	Product.create(product)
		.then((product) => {
			console.log(`Product name ${product.name} got inserted in the db`);
			res.status(200).send(product);
		})
		.catch((err) => {
			console.log(`Issue in inserting product [${product.name}]`);
			console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message: "some internal error while storing the product",
			});
		});
*/
	//async and await can be used instead of above codeIn this version, the async/await syntax is used to make the asynchronous code appear more synchronous.
	//The await keyword is used with Product.create(product), allowing the code to wait for the asynchronous operation to complete before moving on.
	//This can make error handling more straightforward and the code look cleaner.
	try {
		let productInsertResponse = await Product.create(product);
		console.log(`Product name ${product.name} got inserted in the db`);
		res.status(200).send(product);
	} catch (err) {
		console.log(`Issue in inserting product [${product.name}]`);
		console.log(`Error message: ${err.message}`);
		res.status(500).send({
			message: "some internal error while storing the product",
		});
	}
};

//----------------------------------------------------------------------------------------------------------------------
//GET: get list of all products

exports.findAll = (req, res) => {
	let productName = req.query.name;
	let minCost = req.query.minCost;
	let maxCost = req.query.maxCost;

    let whereCondition = {};

    if (productName) {
        whereCondition.name = productName;
    }

    if (minCost && maxCost) {
        whereCondition.cost = {
            [Op.gte]: minCost,
            [Op.lte]: maxCost,
        };
    } else if (minCost) {
        whereCondition.cost = {
            [Op.gte]: minCost,
        };
    } else if (maxCost) {
        whereCondition.cost = {
            [Op.lte]: maxCost,
        };
    }

    promise = Product.findAll({
        where: whereCondition,
    });

	promise
		.then((products) => {
			res.status(200).send(products);
		})
		.catch((err) => {
			console.log(`Error Message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error while fetching the categories",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//GET: get a product based on product id

exports.findOne = (req, res) => {
	const productId = req.params.id;

	Product.findByPk(productId)
		.then((product) => {
			if (!product) {
				res.status(404).send({
					message: "Product not found",
				});
			}
			res.status(200).send(product);
		})
		.catch((err) => {
			console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error while fetching the product",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//UPDATE: the existing product

exports.update = (req, res) => {

	const product = {
		name: req.body.name,
		description: req.body.description,
		cost: req.body.cost,
		categoryId: req.body.categoryId,
	};

	const productId = req.params.id;

	Product.update(product, {
		where: {
			id: productId,
		},
	})
		.then((updatedProduct) => {
			Product.findByPk(productId)
				.then((product) => {
					console.log("Successfully updated the product");
					res.status(200).send(product);
				})
				.catch((err) => {
					console.log(`Error message: ${err.message}`);
					res.status(500).send({
						message: "Some internal error while fetching the updated product",
					});
				});
		})
		.catch((err) => {
			console.log(`Error Message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error occurred while updating the product",
			});
		});
};

//----------------------------------------------------------------------------------------------------------------------
//DELETE: the product based on id

exports.delete = (req, res) => {
	const productId = req.params.id;
	//Finding product and then deleting it else it will send 200 even if product for the id not present
	Product.findByPk(productId)
		.then((product) => {
			if (!product) {
				res.status(404).send({
					message: "Product not found",
				});
			} else {
				Product.destroy({
					where: {
						id: productId,
					},
				})
					.then(() => {
						res.status(200).send({
							message: "Successfully deleted the product",
						});
					})
					.catch((err) => {
						console.log(`Error message: ${err.message}`);
						res.status(500).send({
							message:
								"Some internal error occurred while deleting the product",
						});
					});
			}
		})
		.catch((err) => {
			console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message: "Some internal error occurred while finding the product to delete",
			});
		});
};


//----------------------------------------------------------------------------------------------------------------------
//GET: the product based on category id

exports.getProductsUnderCategory = (req, res) => {
	const categoryId = parseInt(req.params.categoryId);

	Product.findAll({
		where: {
			categoryId: categoryId,
		},
	})
		.then((products) => {
			res.status(200).send(products);
		})
		.catch((err) => {
			Console.log(`Error message: ${err.message}`);
			res.status(500).send({
				message:
					"Some internal error while fetching products based on category",
			});
		});
};