const { DataTypes } = require("sequelize");

const connection = require("../context/AppContext");

const Category = connection.define("Category", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantityBooks: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Category;