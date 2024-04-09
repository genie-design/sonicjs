-- Insert statement for users table
INSERT INTO users (id, firstName, lastName, email, password, role, createdOn, updatedOn, createdBy, updatedBy)
VALUES ('w4a219e7mfnsahq', 'Corey', 'Jepperson', 'corey.jepperson@gmail.com', NULL, 'admin', 1709261957860, 1709261957860, NULL, NULL);

-- Insert statements for user_sessions table
INSERT INTO user_sessions (id, user_id, active_expires, idle_expires, createdOn, updatedOn, createdBy, updatedBy)
VALUES ('1a1ieyb01ew4rphqrp1v505vnm33k5nozfvbi6l5', 'w4a219e7mfnsahq', 1709348378844, 1710557978844, NULL, NULL, NULL, NULL),
       ('cqnuws5gvfnek5r8wdropzqsnzglcj7mvzbeh9jc', 'w4a219e7mfnsahq', 1709600723401, 1710810323401, NULL, NULL, NULL, NULL),
       ('uf25qi6q4ly1t5iyhdhdf1kxp9pd92ruq348dl9h', 'w4a219e7mfnsahq', 1709784206747, 1710993806747, NULL, NULL, NULL, NULL),
       ('rw5e7vijfrvmxgepnph73hyntek550ne4uoagw9k', 'w4a219e7mfnsahq', 1709861526348, 1711071126348, NULL, NULL, NULL, NULL),
       ('lh7kzjibw1zq98di0cia4knh27j6kud3je0ue8jf', 'w4a219e7mfnsahq', 1710210013205, 1711419613205, NULL, NULL, NULL, NULL),
       ('1vneyycot1swgclqkebuae9rynf1zcs5smuxsb8c', 'w4a219e7mfnsahq', 1711984754510, 1713194354510, NULL, NULL, NULL, NULL);

-- Insert statement for user_keys table
INSERT INTO user_keys (id, user_id, hashed_password, createdOn, updatedOn, createdBy, updatedBy)
VALUES ('email:corey.jepperson@gmail.com', 'w4a219e7mfnsahq', 'snc:$:$K©ÎÀª¥×i§fô^çæ§¡î~ö ;X½§^NRYþ ÿTÒÔäÖ§àò;Ý"7Vo-:$:pjhbhkvhgj5gdtdq:$:SHA-512:$:100000', NULL, NULL, NULL, NULL);

-- Insert statement for features table
INSERT INTO features (id, title, body, link, image, createdBy, updatedBy, createdOn, updatedOn, linkText)
VALUES ('a376f051-c457-4ee2-8338-3966674073ba', 'Delicious Variety', 'Great treats for all size dogs and uses, whether it be for training or a special treat.', '/products', '/tus/images/r_features/f_image/a9cc01c4-2504-4ccd-90ed-065e009a38da.jpg', 'w4a219e7mfnsahq', NULL, NULL, NULL, NULL);

-- Insert statements for products table
INSERT INTO products (id, name, description, nutrition, images, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('7dcf1af9-66dc-40cd-bca8-4ce9cc742566', 'Apple Carrot', NULL, NULL, '["/tus/images/r_products/f_images/c775a5de-e898-47e5-971d-146ab6f51458.jpg"]', 'w4a219e7mfnsahq', NULL, 1709352469176, 1710185653373),
       ('74cf117d-6b2a-417f-8d24-023c46767b22', 'Pumpkin', NULL, NULL, NULL, 'w4a219e7mfnsahq', NULL, NULL, NULL);
-- Insert statements for skus table
INSERT INTO skus (id, name, description, images, quantity, size, price, product_id, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('055374c8-9962-40cf-841b-38abb3b2eeec', 'Apple Carrot Large 10oz', NULL, NULL, '10oz', 'Large', '15', '7dcf1af9-66dc-40cd-bca8-4ce9cc742566', 'w4a219e7mfnsahq', NULL, 1709352776537, 1709352776537);

-- Insert statement for socials table
INSERT INTO socials (id, facebook, twitter, instagram, youtube, tiktok, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('4b08237c-1531-4b33-8785-567c04c0d0d3', 'https://www.facebook.com/profile.php?id=61553497111322', NULL, NULL, NULL, NULL, 'w4a219e7mfnsahq', NULL, 1709352249719, 1709352249719);
