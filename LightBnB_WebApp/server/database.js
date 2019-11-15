const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require(`pg`)

const pool = new Pool({
  user: `vagrant`,
  password: `123`,
  host: `localhost`,
  database: `lightbnb`
})

pool.connect()
 .then(() => {
   console.log("Succesfully connected to database!");
 }).catch((error) => {
   console.log(`Error is: ${error}`)
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const text = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
 const values = [email];
  return pool.query(text, values)
  .then((res) => {
    if (res.rows.length === 0) {
      return (null)
    } else {
      return (res.rows[0])
      }
  }).catch((error) => {
    console.log(`Error is: ${error}`)
  })
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const text = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
 const values = [id];
  return pool.query(text, values)
  .then((res) => {
    if (res.rows.length === 0) {
      return (null)
    } else {
      return (res.rows[0])
      }
  }).catch((error) => {
    console.log(`Error is: ${error}`)
  })
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
const text = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
const values = [`${user.name}`, `${user.email}`, `${user.password}`]

  return pool.query(text, values)
  .then(res => res.rows[0]
    ).catch((error) => {
      console.log(`Error is: ${error}`)
  })
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const text = `SELECT properties.*, reservations.*, avg(rating) AS average_rating
  FROM reservations 
  INNER JOIN properties ON reservations.property_id = properties.id
  INNER JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const values = [guest_id, limit];

  return pool.query(text, values)
    .then((res) => {
      return res.rows;
    }).catch((error) => {
      console.log(`Error is: ${error}`)
    })
  };

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
   queryParams.push(Number(options.owner_id));
   queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} owner_id = $${queryParams.length}`;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'}  cost_per_night > $${queryParams.length}`;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'}  cost_per_night < $${queryParams.length}`;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `GROUP BY properties.id HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  } else {
    queryString += `GROUP BY properties.id`;
  }
  // 4

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parcking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;
  queryParams.push(property);
  queryString +=
    `${properties.owner_id}`,
    `${properties.title}`,
    `${properties.description}`,
    `${properties.thumbnail_photo_url}`,
    `${properties.cover_photo_url}`,
    `${properties.cost_per_night}`,
    `${properties.parking_spaces}`,
    `${properties.number_of_bathrooms}`,
    `${properties.number_of_bedrooms}`,
    `${properties.country}`,
    `${properties.street}`,
    `${properties.city}`,
    `${properties.province}`,
    `${properties.post_code}`,
    `${properties.active}`;

    console.log(queryParams, queryParams);

  return pool.query(queryString)
  .then(res => res.rows[0]
    ).catch((error) => {
      console.log(`Error is: ${error}`)
  })
  };
exports.addProperty = addProperty;
