module.exports = (connection, DataTypes) => {
    const schema = {
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            args: [true],
            msg: 'Genre cannot be empty'
          },
          notEmpty: {
            args: [true],
            msg: 'Genre cannot be empty',
          },
        },
      },
    };
  
    const GenreModel = connection.define('Genre', schema);
    return GenreModel;
  };