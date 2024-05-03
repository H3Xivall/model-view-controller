-- Delete the database if it exists
DROP DATABASE IF EXISTS tech_blog;
CREATE DATABASE tech_blog;

-- Create the User table
CREATE TABLE User (
    id INT PRIMARY KEY,
    name VARCHAR(255),
);

-- Create the Post table
CREATE TABLE Post (
    id INT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- Create the Comment table
CREATE TABLE Comment (
    id INT PRIMARY KEY,
    user_id INT,
    post_id INT,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (post_id) REFERENCES Post(id)
);