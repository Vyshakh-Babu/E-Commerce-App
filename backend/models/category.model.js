/*This file will be used to represent the category schema 
1. id
2. name
3. description
*/
const Sequelize = require("sequelize").Sequelize;

//"category" is the name of the model. In Sequelize, a model is a representation of a database table.
/*This module exports a function that receives two parameters: sequelize and Sequelize. 
> seq is an instance of Sequelize that represents the database connection.
> Sequelize is the Sequelize library itself.*/
module.exports = (seq, Sequelize) => {
  //This method takes two arguments: the model name ("category") and an object that defines the model's attributes and their data types.
  const Category = seq.define("category", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  });
  return Category;
};
/*
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255)
  );
*/
