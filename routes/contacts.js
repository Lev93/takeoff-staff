/* eslint no-underscore-dangle: 0 */

const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.post('/getcontacts', async (req, res) => {
  try {
    const { userId, contactsUsers } = req.body;
    let list = [userId];
    if (contactsUsers) {
      list = [userId, ...contactsUsers.map((el) => el.userId)];
    }
    const users = await User.find({ _id: { $nin: [...list] } });
    let contacts = [];
    if (contactsUsers) {
      contacts = await User.find({
        _id: { $in: [...contactsUsers.map((el) => el.userId)] },
      });
    }
    res.send({ users, contacts });
  } catch (e) {
    console.log(e);
  }
});

router.post('/add', async (req, res) => {
  try {
    const user = await User.findById(req.body.mainUserId);
    await user.addContact(req.body.user);
    res.status(200);
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', async (req, res) => {
  try {
    const user = await User.findById(req.body.mainUserId);
    await user.removeContact(req.body.user._id);
    res.status(200);
  } catch (e) {
    console.log(e);
  }
});

router.post('/search', async (req, res) => {
  try {
    const filter = { email: { $regex: req.body.text, $options: 'i' } };
    const results = await User.find({ ...filter })
      .limit(5);
    res.send(results);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
