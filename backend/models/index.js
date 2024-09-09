// This file will be used for the following purpose:
// 1. Create the DB connection with the help of sequelize
// 2. Export all the functionalities of the model through the file.
// One of the biggest advantage of using index.js is other file trying to import this file only need to provide module name.

//To satisfy the testing scenario, modified like this
//const env = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV === 'test' || !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;
const config = require("../configs/db.config")[env];
const Sequelize = require("sequelize").Sequelize; //creates a new Sequelize instance

//Creating the DB connection
                 //constructor with arguments
const seq = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    { // braces won't make any functional difference
        host: config.HOST,
        dialect: config.dialect 
    }
);

const db = {}; //initializes an empty JS object
//adding properties
db.Sequelize = Sequelize; //assigns the value of the Sequelize object imported from the sequelize library. 
db.sequelize = seq; //assigns the value of the seq instance you created earlier
db.category = require('./category.model')(seq, Sequelize); // assigns it the result of requiring the 'category.model' module imported
//(seq, Sequelize): After importing the model file, you immediately invoke it as a function, passing the seq and Sequelize objects as arguments. This is done to create a new instance of the model associated with your Sequelize connection.
db.product = require('./product.model')(seq, Sequelize);
db.user = require('./user.model')(seq, Sequelize);
db.role = require('./role.model')(seq, Sequelize);
db.cart = require('./cart.model')(seq, Sequelize);
module.exports = db;

//Establish the relationship between user and role
/*Join Table (user_roles):
The user_roles table serves as an intermediary table that holds the relationships between users and roles.
It contains columns for 'roleId' and 'userId' to establish connections between roles and users.*/

db.role.belongsToMany(db.user, {    //establishes a many-to-many relationship from the role model to the user model.
	through: "user_roles", //specifies the model that will be used to join the two models
	foreignKey: "roleId", //specifies the foreign key in the user_roles join table that refers to the current model 
});

db.user.belongsToMany(db.role, {
	through: "user_roles",
	foreignKey: "userId",
});

db.ROLES = ["user", "admin"];

//Establish the relationship between Cart and Product: Many to Many
db.product.belongsToMany(db.cart, {
	through: "cart_products",
	foreignKey: "productId",
});

db.cart.belongsToMany(db.product, {
	through: "cart_products",
	foreignKey: "cartId",
});

//Establish relationship between Cart and User: One to Many
db.user.hasMany(db.cart);

/*
const { DataTypes } = db.Sequelize; like this we can use that property
if we don't use it then the line will be like 
const { Sequelize, DataTypes } = require("sequelize");
 */