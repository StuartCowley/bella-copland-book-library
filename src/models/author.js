module.exports = (connection, DataTypes) => {
    const schema = {
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            args: [true],
            msg: 'Author cannot be empty'
          },
          notEmpty: {
            args: [true],
            msg: 'Author cannot be empty',
          },
        },
      },
    };
  
    const AuthorModel = connection.define('Author', schema);
    return AuthorModel;
  };