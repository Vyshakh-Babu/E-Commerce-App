const express = require('express');
const serverConfig = require('./configs/server.config'); 
const bodyParser = require('body-parser'); // to parse incoming request data, such as form data or JSON, and make it accessible in the req.body object
const app = express();

const cors = require('cors');
app.use(cors());

//Configures the Express app to use the body-parser middleware for parsing URL-encoded data and populates req.body with the parsed data. 
//The extended: true option allows for rich parsing of query strings.
app.use(bodyParser.urlencoded({ extended: true }));
//Configures the Express app to use the body-parser middleware for parsing JSON data. This middleware makes JSON data available in req.body.
app.use(bodyParser.json());

//If no file specified, then index.js will be picked
const db = require("./models");
const Category = db.category; //tables will be created
const Product = db.product; 
const Role = db.role; 

//establishes a "hasMany" association between the Category and Product models
//it is used to express a one-to-many relationship between two models, where one instance of the source model (Category) is associated with multiple instances of the target model (Product).
//Sequelize will automatically handle the creation of foreign key constraints
//Creates 'categoryId' column col in products table
Category.hasMany(Product);

//Synchronizes the db using Sequelize by calling sync() on the sequelize instance (db.sequelize).
//{ force: true } indicates that existing tables should be dropped and recreated.
db.sequelize.sync({ force: true }).then(() => {
  console.log("tables dropped and created");
  init();
});

function init() {
	var categories = [
		{
			name: "Home Appliances",
			description:
				"This category will contain all the home appliances products",
		},
		{
			name: "Personal Devices",
			description: "This category will contain all the personal devices",
		},
		{
			name: "Kitchen Items",
			description: "This category will contain all the kitchen products",
		},
	];

	Category.bulkCreate(categories)
		.then(() => {
			console.log("Category table initialized");
		})
		.catch((err) => {
			console.log("Error while initializing categories table");
		});

	//Inserting user roles. We can also use bulkCreate method also as above
	Role.create({
		id: 1,
		name: "user",
	});

	Role.create({
		id: 2,
		name: "admin",
	});

	var products = [
		{
			name: "Laptop",
			description: "Asus 14 inch",
			cost: 200000,
			categoryId: "1",
		},
		{
			name: "TV",
			description: "LG 42 inch",
			cost: 50000,
			categoryId: "1",
		},
		{
			name: "TV",
			description: "Samsung 55 inch",
			cost: 70000,
			categoryId: "1",
		},
		{
			name: "TV",
			description: "Sony 55 inch",
			cost: 70000,
			categoryId: "1",
		},
		{
			name: "Refrigerator",
			description: "Whirlpool 5 star",
			cost: 30000,
			categoryId: "1",
		},
		{
			name: "Refrigerator",
			description: "LG 3 star",
			cost: 20000,
			categoryId: "1",
		},
		{
			name: "Oven",
			description: "Whirlpool 5 star",
			cost: 30000,
			categoryId: "1",
		},
		{
			name: "Smartphone",
			description: "Apple iPhone 15 Pro",
			cost: 140000,
			categoryId: "2",
		},
		{
			name: "Smartphone",
			description: "Samsung Galaxy S23 Ultra",
			cost: 125000,
			categoryId: "2",
		},
		{
			name: "Smartphone",
			description: "Xiaomi Redmi 4",
			cost: 10000,
			categoryId: "2",
		},
		{
			name: "Smartphone",
			description: "Google Pixel 8",
			cost: 90000,
			categoryId: "2",
		},
		{
			name: "SmartWatch",
			description: "Apple Watch 5",
			cost: 50000,
			categoryId: "2",
		},
		{
			name: "SmartWatch",
			description: "Samsung Galaxy Watch 4",
			cost: 40000,
			categoryId: "2",
		},
		{
			name: "Earbuds",
			description: "Samsung Galaxy Buds 2",
			cost: 15000,
			categoryId: "2",
		},
		{
			name: "Bread",
			description: "Modern Bread",
			cost: 20000,
			categoryId: "3",
		},
		{
			name: "Milk",
			description: "Milma 50 Litre",
			cost: 30000,
			categoryId: "3",
		},
		{
			name: "Milk",
			description: "Amul 50 Litre",
			cost: 40000,
			categoryId: "3",
		},
		{
			name: "Eggs",
			description: "Chick Eggs 500",
			cost: 100000,
			categoryId: "3",
		},
	];

	Product.bulkCreate(products)
		.then(() => {
			console.log("Product table initialized");
		})
		.catch((err) => {
			console.log("Error while initializing products table");
		});
}

//sets up those routes within the Express app, allowing the app to respond to incoming HTTP requests for the specified routes.
//invokes the module as a function, passing the Express app as an argument. The (app) part of the code is a common pattern in Express.js applications to configure and initialize routes within the application
//(the routes function is having this (app) as param in it's file)
require("./routes/category.routes")(app);
require("./routes/product.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/cart.routes")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Application is running at port : ${serverConfig.PORT}`);
});