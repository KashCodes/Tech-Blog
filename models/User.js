const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    // hashes the PW to safeguard their personal info
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO IN HERE
    id: {
      // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    // Defines the username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Defines email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //Verifies that the email entered is unique and not a duplicate from the database
      unique: true,      
      validate: {
        isEmail: true,
      },
    },
    // Defines password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Provides rule that passwords must be at least 4 characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    // Prevents time stamps from automatically being created
    timestamps: false,
    // Prevents pluralization of the table names
    freezeTableName: true,
    underscored: true,
    // Ensures that the model name remains lowercase in the DB
    modelName: "user",
  }
);

module.exports = User;
