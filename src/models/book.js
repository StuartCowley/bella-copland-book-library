module.exports = (connection, DataTypes) => {
    const schema = {
      title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  args: [true],
                  msg: 'Title cannot be empty',
              },
              notNull: {
                  args: [true],
                  msg: 'Title cannot be empty'
              },
          },
      },
      author: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty: {
                  args: [true],
                  msg: 'Author cannot be empty',
              },
              notNull: {
                args: [true],
                msg: 'Author cannot be empty'
            },
          },
      },
      genre: DataTypes.STRING,
      ISBN: DataTypes.STRING,
    };
  
    const BookModel = connection.define('Book', schema);
    return BookModel;
  };