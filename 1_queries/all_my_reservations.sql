SELECT properties.id, title, cost_per_night, reservations.start_date, avg(rating) AS average_rating
FROM reservations INNER JOIN properties 
ON reservations.property_id = properties.id
INNER JOIN property_reviews 
ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;