const db = require("../models");
const Category = db.category;

const validateCategoryRequest = (req, res, next) => {
	if (!req.body.name) {
		return res.status(400).send({
			message: "Name of the category can't be empty",
		});
	}

	next(); // allows the request to proceed to the next middleware (check routes logic to see next mw)
};

const validateProductRequest = (req, res, next) => {
	
	if (!req.body.name) {
		return res.status(400).send({
			message: "Name of the product can't be empty",
		});
	}

	if (!req.body.cost) {
		return res.status(400).send({
			message: "Cost of the product can't be empty",
		});
	}

	if (req.body.categoryId) {
		Category.findByPk(req.body.categoryId)
			.then((category) => {
				if (!category) {
					return res.status(400).send({
						message: "Category Id is not available",
					});
				}
				next();
			})
			.catch((err) => {
				res.status(500).send({
					message: "Some internal error while searching category based on category Id",
				});
			});
	} else {
		return res.status(400).send({
			message: "Category Id was not passed",
		});
	}
}

module.exports = {
	validateCategoryRequest: validateCategoryRequest,
	validateProductRequest: validateProductRequest,
};

// The entire construct module.exports = { ... } is exporting an object.
// validateCategoryRequest is a property (or key) within that object. Can use other names as well. Need to change in routes file as well.
// validateCategoryRequest is the value assigned to the validateCategoryRequest property.