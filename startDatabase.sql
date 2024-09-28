-- mariadb -u root -p < startDatabase.sql

CREATE DATABASE IF NOT EXISTS mend;
USE mend;

-- create the `users` table
CREATE TABLE IF NOT EXISTS users (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dateLastLoggedIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `firstName` VARCHAR(50) NOT NULL DEFAULT "",
    `lastName` VARCHAR(50) NOT NULL DEFAULT "",
    `username` VARCHAR(50) NOT NULL DEFAULT "",
    `email` VARCHAR(100) NOT NULL DEFAULT "",
    `password` VARCHAR(255) NOT NULL DEFAULT "",
    `reset_token` VARCHAR(255) DEFAULT NULL,
    `token_expiration` DATETIME DEFAULT NULL,  
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

--  create the `journalEntries` table
CREATE TABLE IF NOT EXISTS journalEntries (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `userID` INT NOT NULL DEFAULT 0,
    `entryDate` DATE NOT NULL,
    `entryContent` TEXT NOT NULL,
    `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dateLastEdited` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`userID`) REFERENCES users(`ID`) ON DELETE CASCADE
) ENGINE=InnoDB;

--  create the `weeklyAnalysis` table
CREATE TABLE IF NOT EXISTS weeklyAnalysis (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `userID` INT NOT NULL, 
    `weekStartDate` DATE NOT NULL,
    `weekEndDate` DATE NOT NULL, 
    `analysisSummary` TEXT NOT NULL, 
    `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`userID`) REFERENCES users(`ID`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert sample data into 'users' table
INSERT INTO users (firstName, lastName, username, password) VALUES
('John', 'Doe', 'johndoe', 'hashed_password_123'),
('Jane', 'Smith', 'janesmith', 'hashed_password_456');

-- Insert sample data into 'journalEntries' table
INSERT INTO journalEntries (userID, entryDate, entryContent) VALUES
(1, '2024-09-01', 'Today I learned about journaling applications. It was an interesting day!'),
(1, '2024-09-02', 'I am really enjoying the process of learning and building applications.'),
(2, '2024-09-01', 'Started my journey into mindfulness journaling. Feeling optimistic about the week ahead.');

-- Insert sample data into 'weeklyAnalysis' table
INSERT INTO weeklyAnalysis (userID, weekStartDate, weekEndDate, analysisSummary) VALUES
(1, '2024-09-01', '2024-09-07', 'John, it looks like you have been focusing on learning and productivity. Keep up the good work!'),
(2, '2024-09-01', '2024-09-07', 'Jane, you mentioned mindfulness a few times this week. Consider exploring meditation practices.');
