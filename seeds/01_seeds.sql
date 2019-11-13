--  USERS

INSERT INTO users (name, email, password)
VALUES ('Will Smith', 'freshprince@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Mila Kunis', 'meggriffin@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ted Mosby', 'tedmosby@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- PROPERTIES

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, parking_spaces, number_of_bathrooms, country, city, province, post_code)
VALUES (1, 'House', 'Description', 'pic1', 'pic2', 400, 'Baronscourt', 2, 5, 4, 'Canada', 'Montreal', 'Quebec', 'H3H 1H1'),
(2, 'Condo', 'Description', 'pic1', 'pic2', 300, 'Aldred', 1, 3, 3, 'Canada', 'Montreal', 'Quebec', 'H4H 2H2'),
(3, 'Townhouse', 'Description', 'pic1', 'pic2', 250, 'Fleet', 3, 5, 4, 'Canada', 'Montreal', 'Quebec', 'H9H 5H5');

-- RESERVATIONS

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

-- PROPERTY_REVIEWS
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'message'),
(2, 2, 3, 5, 'message'),
(3, 3, 3, 3, 'message');
