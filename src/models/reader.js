module.exports = (connection, DataTypes) => {
    const schema = {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: [true],
            msg: 'Name cannot be empty',
          },
          notNull: {
            args: [true],
            msg: 'Name cannot be empty'
        },
        },
      },
      email: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        isEmail: {
          args: [true],
          msg: 'Please use a valid email address',
          },
          notNull: {
            args: [true],
            msg: 'Email cannot be empty'
        },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isLessThan8Characters(value) {
            if (value.length < 8)
              throw new Error('Password cannot be empty and needs to be longer than 8 characters');
          },
          notNull: {
            args: [true],
            msg: 'Password cannot be empty'
        },
        },
      },
    };
  
    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
  };