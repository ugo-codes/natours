const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

mongoose.set('strictQuery', false);
mongoose
  .connect(`${process.env.DATABASE}`, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Db connection successful'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, { encoding: 'utf-8' })
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, { encoding: 'utf-8' })
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, { encoding: 'utf-8' })
);

// LOAD DATA TO DATABASE
const importData = async function () {
  try {
    console.log('importing');
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA FROM DB
const deleteData = async function () {
  try {
    console.log('deleting');
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('All Data successfully delete');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
