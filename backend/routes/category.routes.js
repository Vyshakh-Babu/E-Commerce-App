//This file will contain the routing logic for the Category controller

const { requestValidator, authJwt } = require("../middlewares");

//Imports the Category controller module, which contains the CRUD operations for categories.
const categoryController = require("../controllers/category.controller");

module.exports = function(app) {

    //app.HTTP_METHOD("URL_PATH", routeHandlerFunction);
    //Wrapping it in square brackets [] is a way to define an array. In this context, it's used to provide an array of middleware functions to the app.post route. It is optional
    
    //Route for the POST request to create a category
    app.post("/ecom/api/v1/categories", [requestValidator.validateCategoryRequest], [authJwt.verifyToken], [authJwt.isAdmin], categoryController.create);

    //Route for the GET request to fetch all categories
    app.get("/ecom/api/v1/categories", categoryController.findAll);
    
    //Route for the GET request to fetch a category based on category id
    app.get("/ecom/api/v1/categories/:id", categoryController.findOne);

    //Route for the UPDATE request to update a category based on id
    app.put("/ecom/api/v1/categories/:id", [requestValidator.validateCategoryRequest], [authJwt.verifyToken], [authJwt.isAdmin], categoryController.update);
    
    //Route for the DELETE request to delete a category based on id
    app.delete("/ecom/api/v1/categories/:id", [authJwt.verifyToken], [authJwt.isAdmin], categoryController.delete);  

    //Route for the PATCH request to delete a category based on id
    app.patch("/ecom/api/v1/categories/:id", [authJwt.verifyToken], [authJwt.isAdmin], categoryController.patch);  
}