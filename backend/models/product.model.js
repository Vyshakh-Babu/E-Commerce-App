/*This file will be used to represent the Product Schema
Product fields:
    1. Id
    2. Name
    3. Description
    4. Cost
*/

const Sequelize = require("sequelize").Sequelize;

module.exports = (seq, Sequelize) => {
  const Product = seq.define(
    "product",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNullable: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      cost: {
        type: Sequelize.INTEGER,
        allowNullable: false,
      },
    },
    {
      tableName: "products",
    }
  );
  return Product;
};
