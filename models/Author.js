const { DataTypes } = require("sequelize");

const connection = require("../context/AppContext");

const Author = connection.define("Author", {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantityBooks: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Author;