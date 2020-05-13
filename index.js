const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/contacts', contactsRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect('mongodb+srv://Lev:xvgYWUbEepnDqbxa@cluster0-5sstg.mongodb.net/takeoff?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
