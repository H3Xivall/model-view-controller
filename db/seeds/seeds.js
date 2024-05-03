const faker = require('@faker-js/faker');
const { User, Post, Comment } = require('../models');

const generateSampleData = async () => {
  try {
    // Generate 20 sample users
    const users = [];
    for (let i = 0; i < 20; i++) {
      const user = await User.create({
        name: faker.name.findName(),
      });
      users.push(user);
    }

    // Generate 10 sample posts with random comments
    for (let i = 0; i < 10; i++) {
      const post = await Post.create({
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
        user_id: faker.random.arrayElement(users).id,
      });

      // Generate a random number of comments for each post
      const numComments = faker.random.number({ min: 1, max: 5 });
      for (let j = 0; j < numComments; j++) {
        await Comment.create({
          content: faker.lorem.sentence(),
          user_id: faker.random.arrayElement(users).id,
          post_id: post.id,
        });
      }
    }

    console.log('Sample data generated successfully!');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

generateSampleData();
