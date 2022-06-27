module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validation: {
        notNull: {
          args: [true],
          msg: 'Genre cannot be empty',
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