-- makes the database
CREATE DATABASE IF NOT EXISTS mend;

USE mend;

-- users table
CREATE TABLE IF NOT EXISTS users (
    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Username VARCHAR(50) NOT NULL DEFAULT '',
    Password VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (ID)
) Engine = InnoDB;

-- journals table
CREATE TABLE IF NOT EXISTS journals (
    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastUsed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Title VARCHAR(50) NOT NULL DEFAULT '',
    Description TEXT,
    UserID INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)
) Engine = InnoDB;

-- entries table
CREATE TABLE IF NOT EXISTS entries (
    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastUsed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Title VARCHAR(50) NOT NULL DEFAULT '',
    Content TEXT NOT NULL DEFAULT '',
    JournalID INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)
) Engine = InnoDB;

-- Dummy Data
INSERT INTO users (FirstName, LastName, Username, Password, UserID) VALUES
('Leo', 'Salazar', 'lsalazar', 'test'),
('Usman', 'Khan', 'ukhan', 'test'),
('Lily', 'Vrionis', 'lvri', 'test'),
('Thashin', 'Bhuiyan', 'shin', 'test');

INSERT INTO journals (Title, Description) VALUES
('Thoughts', 'where i write my thoughts', '1'),
('Feelings', 'where i write my feelings', '2'),
('Likes', 'where i write my likes', '3'),
('Dislikes', 'where i write my dislikes', '4');

INSERT INTO entries (Title, Content, JournalID) VALUES
('Job Prospects', 'im cooked', '1'),
('Hackathon', 'im nervous', '1'),
('Matcha', 'i love matcha', '1'),
('Tomatoes', 'i hate tomatoes', '1');