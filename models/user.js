/* eslint no-underscore-dangle: 0 */
/* eslint func-names: 0 */
/* eslint consistent-return: 0 */
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  password: {
    type: String,
    required: true,
  },
  contacts: {
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addContact = function (item) {
  const users = [...this.contacts.users];
  const idx = users.findIndex((c) => c.userId.toString() === item._id.toString());

  if (idx >= 0) {
    return;
  }
  users.push({
    userId: item._id,
  });
  this.contacts = { users };
  return this.save();
};

userSchema.methods.removeContact = function (id) {
  let users = [...this.contacts.users];

  users = users.filter((c) => c.userId.toString() !== id.toString());

  this.contacts = { users };
  return this.save();
};

userSchema.methods.changeName = function (name) {
  this.name = name;
  return this.save();
};

userSchema.methods.changePassword = function (password) {
  this.password = password;
  return this.save();
};

userSchema.methods.changeEmail = function (email) {
  this.email = email;
  return this.save();
};

module.exports = model('User', userSchema);
