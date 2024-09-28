-- makes the database
CREATE DATABASE IF NOT EXISTS mend;

USE mend;

-- users table
CREATE TABLE IF NOT EXISTS users (
    ID INT NOT NULL AUTO_INCREMENT,
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    firstName VARCHAR(50) NOT NULL DEFAULT '',
    lastName VARCHAR(50) NOT NULL DEFAULT '',
    username VARCHAR(50) NOT NULL DEFAULT '',
    password VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(50) NOT NULL DEFAULT '',
    reset_token VARCHAR(50) DEFAULT NULL,
    token_expiration DATETIME DEFAULT NULL,
    PRIMARY KEY (ID)
) Engine = InnoDB;

-- journals table
CREATE TABLE IF NOT EXISTS journals (
    ID INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL DEFAULT 0,
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateLastEdited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(50) NOT NULL DEFAULT '',
    description TEXT,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE
) Engine = InnoDB;

-- entries table
CREATE TABLE IF NOT EXISTS entries (
    ID INT NOT NULL AUTO_INCREMENT,
    journalID INT NOT NULL DEFAULT 0,
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateLastEdited DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(50) NOT NULL DEFAULT '',
    entryDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entryContent TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (ID),
    FOREIGN KEY (journalID) REFERENCES journals(ID) ON DELETE CASCADE
) Engine = InnoDB;

CREATE TABLE IF NOT EXISTS weeklyAnalysis (
    ID INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL DEFAULT 0,
    journalID INT NOT NULL DEFAULT 0,
    weekStartDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    weekEndDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    analysisSummary TEXT NOT NULL, 
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (journalID) REFERENCES journals(ID) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Dummy Data
INSERT INTO users (firstName, lastName, username, password, email) VALUES
('Leo', 'Salazar', 'lsalazar', 'test', 'idk@gmail.com'),
('Usman', 'Khan', 'ukhan', 'test', 'idk@gmail.com'),
('Lily', 'Vrionis', 'lvri', 'test', 'idk@gmail.com'),
('Thashin', 'Bhuiyan', 'shin', 'test', 'idk@gmail.com');

INSERT INTO journals (title, description, UserID) VALUES
('Thoughts', 'where i write my thoughts', '1'),
('Feelings', 'where i write my feelings', '2'),
('Likes', 'where i write my likes', '3'),
('Dislikes', 'where i write my dislikes', '4');

INSERT INTO entries (title, entryContent, journalID) VALUES
('Job Prospects', 'im cooked', '1'),
('Hackathon', 'im nervous', '1'),
('Matcha', 'i love matcha', '1'),
('Tomatoes', 'i hate tomatoes', '1');

INSERT INTO weeklyAnalysis (userID, journalID, weekStartDate, weekEndDate, analysisSummary) VALUES
('1', '1', '2024-09-01', '2024-09-07', 'Leo, it looks like you have been focusing on learning and productivity. Keep up the good work!'),
('2', '2', '2024-09-01', '2024-09-07', 'Usman, you mentioned mindfulness a few times this week. Consider exploring meditation practices.');