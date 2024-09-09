const Sequelize = require("sequelize").Sequelize;
const sequelize = new Sequelize("university", "root", "5225", {
  host: "localhost",
  dialect: "mysql",
});

// product.findAll({
//   where: { 
//   name:{[Op.eql]: 'iPhone15'}
//     }
//   })
//CREATE

//defining a Sequelize model named Product and assigning it to the constant variable Product
const Product = sequelize.define(
  "product", //model name. It should be in singular form and lowercase. optional
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "products" //specifies the custom name for the table in the database. optional
  }
);

//INSERTION
// Product.bulkCreate = [...] also works
const productsToCreate = [
    {
      name: "iPhone15",
      description: "Apple product",
      cost: 89000,
      categoryId: 1,
    },
    {
      name: "Mi12",
      description: "Redme product",
      cost: 15000,
      categoryId: 1,
    },
    {
      name: "Prestige Stove",
      description: "Cooking stove",
      cost: 14500,
      categoryId: 2,
    },
  ];
  
  Product.bulkCreate(productsToCreate); //method to insert all of them at once.

  //Same as above
  /*
  Product.create({
name : "iPhone15",
description : "Apple product",
cost : 89000,
categoryId : 1
});
Product.create({
name : "Mi12",
description : "Redme product",
cost : 15000,
categoryId : 1
});
Product.create({
name : "Prestige Stove",
description : "Cooking stove",
cost : 14500,
categoryId : 2
});
  */
  
// Find all the categories where the id of category is greater then 3 and |
// contains a substring 'product' in their description. 
Category.findAll({
  where: {
    id: {
      [Op.gt]: 3 // Greater than 3
    },
    description: {
      [Op.substring]: 'product' // Contains 'product'
    }
  }
});

//if we don't define table name explicitly then it will take from table name lowercase with plural.
//model-> product, table name-> products
//if model name not defined then it will take object name lowercase with plural.

/*
The sequelize.define function is used to define a model in Sequelize, which represents a table in your database. Here's the general syntax:

javascript
Copy code
const Model = sequelize.define('ModelName', {
  / Attributes (columns) of the table
  attributeName: {
    type: Sequelize.DataType,
    allowNull: true or false,
    / other attributes and options
  },
  / ... other attributes ...
}, {
  / Options for the model
  tableName: 'custom_table_name', // (optional) Custom table name
  timestamps: true or false,       // (optional) Include timestamps
  / ... other options ...
});
Let's break down the different parts:

sequelize: An instance of the Sequelize class representing your database connection.

define: The method used to define a model.

ModelName: The name of the model you're defining. This should be in singular form, and Sequelize will automatically convert it to lowercase and use it as the table name in the database.

Attributes: An object that defines the columns of the table and their data types.

attributeName: The name of the column.
type: The data type of the column (e.g., Sequelize.STRING, Sequelize.INTEGER, etc.).
allowNull: Whether the column can have a null value (true or false).
Other options specific to the attribute, like defaultValue, primaryKey, etc., can be added here.
Options: An object containing options for the model.

tableName: (Optional) A custom name for the table in the database. If not provided, Sequelize will use the automatically generated table name based on the model name.
timestamps: (Optional) Whether to include createdAt and updatedAt columns in the table for automatic timestamping. Defaults to true.

*/