-- Widgets table seeds here (Example)
INSERT INTO widgets (category,item) VALUES ('Restaurant', 'Salad'),
('Book', 'Don Quixote'),
('Film', 'Encanto'),
('Product','face cream'),
('Restaurant', 'Pizza'),
('Book', 'Don Quixote'),
('Film', 'The wasteland'),
('Product','watch');

--lists bridge table

INSERT INTO lists (user_id, widget_id) VALUES (1,1),
(1,2),
(1,3),
(1,4),
(2,5),
(2,6),
(2,7),
(2,8);
