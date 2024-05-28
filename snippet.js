const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'nap_db',
  user: 'nap_user',
  password: 'Sundiver2!',
});

async function getUserByEmail(email) {
  try {
    const user = await db.oneOrNone(
      'SELECT * FROM login WHERE email = $1 AND archived = false',
      [email]
    );
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

const email = 'nap@napsoft.com';
getUserByEmail(email)
  .then((user) => {
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('No user found with that email.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
