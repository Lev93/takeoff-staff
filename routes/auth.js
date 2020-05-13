/* eslint no-underscore-dangle: 0 */

const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.post('/registration', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log(req.body);
    const olduser = await User.findOne({ email });
    if (olduser) {
      res.send({ error: 'Такой пользователь уже существует' });
    } else {
      const user = new User({
        email, name, password,
      });
      await user.save();
      res.send(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            contacts: { users: [] },
          },
        },
      );
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/edit', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      id,
    } = req.body;
    const olduser = await User.findById(id);
    await olduser.changeName(name);
    await olduser.changePassword(password);
    await olduser.changeEmail(email);
    res.send(
      {
        user: {
          id,
          name,
          email,
          contacts: olduser.contacts,
        },
        text: 'Пользователь обновлен',
      },
    );
  } catch (e) {
    console.log(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = password === candidate.password;
      if (areSame) {
        res.send(
          {
            user: {
              id: candidate._id,
              name: candidate.name,
              email: candidate.email,
              contacts: candidate.contacts,
            },
          },
        );
      } else {
        res.send({ error: 'Неверный пароль' });
      }
    } else {
      res.send({ error: 'Пользователь не найден' });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
