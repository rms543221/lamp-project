-- schema.sql
-- COP4331 Contact Manager DB schema (Users + Contacts)

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- USERS table
CREATE TABLE Users (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL,
  LastName  VARCHAR(50) NOT NULL,
  Login     VARCHAR(50) NOT NULL,
  Password  VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID)

  -- Optional: prevents duplicate usernames
  -- ,UNIQUE KEY uq_users_login (Login)
) ENGINE=InnoDB;

-- CONTACTS table
CREATE TABLE Contacts (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL,
  LastName  VARCHAR(50) NOT NULL,
  Phone     VARCHAR(50) NOT NULL,
  Email     VARCHAR(50) NOT NULL,
  UserID    INT NOT NULL,

  -- "date record created" requirement
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (ID)
) ENGINE=InnoDB;
