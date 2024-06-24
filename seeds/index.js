const mongoose = require('mongoose');
const cities = require('./cities');
const axios = require('axios');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/CAMP');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'tDoQ8Qmnzy_Amj6-9tpTxa-znoaJJ_C3LdfXB_C94Tc',
        collections: 1114848, // "Camping" collection
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error("Error fetching image:", err);
    return 'default_image_url.jpg'; // Return a default image URL in case of error
  }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  try {
    await Campground.deleteMany({});

    for (let i = 0; i < 20; i++) {
      const random1000 = Math.floor(Math.random() * 20);
      const camp = new Campground({
        author:'667980be719efd4538917586',
        image: await seedImg(),
        title: `${sample(descriptors)} ${sample(places)}`,
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit...',
        price: Math.floor(Math.random() * 20) + 10,
      });
      await camp.save();
    }

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
