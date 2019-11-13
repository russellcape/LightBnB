SELECT properties.id, title, cost_per_night, avg(property_reviews.rating) AS average_rating
FROM properties INNER JOIN property_reviews 
ON properties.id = property_id
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;