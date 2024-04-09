-- Insert statement for features table
INSERT INTO features (id, title, body, link, image, createdBy, updatedBy, createdOn, updatedOn, linkText)
VALUES ('a376f051-c457-4ee2-8338-3966674073ba', 'Delicious Variety', 'Great treats for all size dogs and uses, whether it be for training or a special treat.', '/products', '/tus/images/r_features/f_image/a9cc01c4-2504-4ccd-90ed-065e009a38da.jpg', 'kizqkdu2oep4u7e', NULL, NULL, NULL, NULL);

-- Insert statements for products table
INSERT INTO products (id, name, description, nutrition, images, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('7dcf1af9-66dc-40cd-bca8-4ce9cc742566', 'Apple Carrot', NULL, NULL, '["/tus/images/r_products/f_images/c775a5de-e898-47e5-971d-146ab6f51458.jpg"]', 'kizqkdu2oep4u7e', NULL, 1709352469176, 1710185653373),
       ('74cf117d-6b2a-417f-8d24-023c46767b22', 'Pumpkin', NULL, NULL, NULL, 'kizqkdu2oep4u7e', NULL, NULL, NULL);
-- Insert statements for skus table
INSERT INTO skus (id, name, description, images, quantity, size, price, product_id, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('055374c8-9962-40cf-841b-38abb3b2eeec', 'Apple Carrot Large 10oz', NULL, NULL, '10oz', 'Large', '15', '7dcf1af9-66dc-40cd-bca8-4ce9cc742566', 'kizqkdu2oep4u7e', NULL, 1709352776537, 1709352776537);

-- Insert statement for socials table
INSERT INTO socials (id, facebook, twitter, instagram, youtube, tiktok, createdBy, updatedBy, createdOn, updatedOn)
VALUES ('4b08237c-1531-4b33-8785-567c04c0d0d3', 'https://www.facebook.com/profile.php?id=61553497111322', NULL, NULL, NULL, NULL, 'kizqkdu2oep4u7e', NULL, 1709352249719, 1709352249719);
