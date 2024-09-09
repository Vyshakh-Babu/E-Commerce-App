/*This file contains the controller logic for the category resource.
Every time a CRUD request come for the category, methods define in this controller file will be executed.
*/

//const { Category } = require("../models");
const db = require("../models"); //points to db object in index.js by default
const Category = db.category; //property of the db object created using const db = require("../models");

//POST: Create and save a new category

exports.create = (req, res) => {

  //creation of the category object to be stored in the db
  const category = {
    name: req.body.name,
    description: req.body.description,
  };

  //category is created and saved in the database using promises
  //calls the create method of the Category model
  Category.create(category)
    // starts a Promise-based chain, It will execute when the db insertion is successful.
    .then((category) => {
      //(category) parameter in the arrow function represents the newly created category object that was just inserted into the database.
      //expression is enclosed within backticks (`), which define the template literal.
      console.log(`category name: [${category.name}] got inserted in the DB`);
      res.status(201).send(category);
      // 201 indicates that the request has been successfully fulfilled, and a new resource (the category in this case) has been created
    })
    .catch((err) => {
      console.log(`Issue in inserting category name: [${category.name}]`);
      //err.message, which is provided by the database or ORM
      console.log(`Error Message: ${err.message}`);
      res.status(500).send({
        message: "Some internal error while storing the category",
      });
    });
};

//----------------------------------------------------------------------------------------------------------------------
//GET: get list of all categories

exports.findAll = (req, res) => {
    //req.query is a property of the req object that allows you to access the query parameters
    //Query params are typically included in the URL after the ? and separated by (&) or (=).
    let categoryName = req.query.name;
    if (categoryName) {
        //This method is executed and returns a promise, which is stored in the promise variable.
        promise = Category.findAll({
        where: {
            name: categoryName,
        },
        });
    } else {
        promise = Category.findAll();
    }

    promise
      .then((categories) => {
        res.status(200).send(categories);
      })
      .catch((err) => {
        console.log(`Error Message: ${err.message}`);
        res.status(500).send({
          message: "Some internal error while fetching the categories"
        });
      });
};

//----------------------------------------------------------------------------------------------------------------------
//GET: get a category based on category id

//used to retrieve a single item/record (e.g, a single category) from db based on certain criteria
exports.findOne = (req, res) => {
  //req.params allows you to access route parameters or path parameters from the URL. colon (:) is used to indicate a route parameter
  ///categories/:id, :id is a route parameter, and you can access its value using req.params.id.
  const categoryId = req.params.id;

  Category.findByPk(categoryId)
    .then((category) => {
      //Manually checking the response as mysql returns null with 200 even if id  not present
      if (!category) {
        return res.status(404).send({
          message: "Category not found",
        });
        //return res.status(404).json({ message: "Category not found", }) also can be used
      }
      res.status(200).send(category);
    })
    .catch((err) => {
      console.log(`Error Message: ${err.message}`);
      res.status(500).send({
        message: "Some internal error while fetching the category",
      });
    });
};

//----------------------------------------------------------------------------------------------------------------------
//UPDATE: the existing category

exports.update = (req, res) => {
  const category = {
    name: req.body.name,
    description: req.body.description,
  };

  const categoryId = req.params.id;
  // Category.update(category, {
  //   where: { id: categoryId } // Specify the condition to update a specific category by its ID
  // })

  Category.update(category, {
    where: { id: categoryId } // Specify the condition to update a specific category by its ID
  })
    .then((updatedCategory) => {
      //updation successful, but while fetching that row and sending it to user there might be chance of error
      Category.findByPk(categoryId)
        .then((category) => {
          res.status(200).send(category);
        })
        .catch((err) => {
          console.log(`Error Message: ${err.message}`);
          res.status(500).send({
            message: "Some internal error while fetching the updated category",
          });
        });
    })
    //updation not successful
    .catch((err) => {
      console.log(`Error Message: ${err.message}`);
      res.status(500).send({
        message: "Some internal error while updating the category",
      });
    });
};

//----------------------------------------------------------------------------------------------------------------------
//DELETE: the category based on id

exports.delete = (req, res) => {
  const categoryId = req.params.id;

  // to delete a record from the database table.
  Category.destroy({
    where: { id: categoryId },
  })
    .then((result) => {
      res.status(200).send({
        message: "successfully deleted the category",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some internal error while deleting the category",
      });
    });
};

//----------------------------------------------------------------------------------------------------------------------
//PATCH: the existing category (partial modifications to a resource)

exports.patch = (req, res) => {
  const category = {
    name: req.body.name,
    description: req.body.description,
  };

  const categoryId = req.params.id;
  // Category.update(category, {
  //   where: { id: categoryId } // Specify the condition to update a specific category by its ID
  // })

  Category.update(category, {
    where: { id: categoryId } // Specify the condition to update a specific category by its ID
  })
    .then((updatedCategory) => {
      //updation successful, but while fetching that row and sending it to user there might be chance of error
      Category.findByPk(categoryId)
        .then((category) => {
          res.status(200).send(category);
        })
        .catch((err) => {
          console.log(`Error Message: ${err.message}`);
          res.status(500).send({
            message: "Some internal error while fetching the updated category",
          });
        });
    })
    //updation not successful
    .catch((err) => {
      console.log(`Error Message: ${err.message}`);
      res.status(500).send({
        message: "Some internal error while updating the category",
      });
    });
};