DROP DATABASE IF EXISTS `stockview`;
CREATE DATABASE IF NOT EXISTS `stockview` DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS `stockview`.`Templates` (
	`templateId` INT(11) NOT NULL AUTO_INCREMENT,
	`condFormatting` VARCHAR(16) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`templateId`));

CREATE TABLE IF NOT EXISTS `stockview`.`Trackers` (
	`trackerId` INT(11) NOT NULL AUTO_INCREMENT,
	`mapping` VARCHAR(50) NULL DEFAULT NULL,
	`formula` VARCHAR(150) NULL DEFAULT NULL,
	`name` VARCHAR(50) NOT NULL,
	`api` VARCHAR(50) NOT NULL,
	`sigFigs` INT(11) NOT NULL DEFAULT 0,
	`biggerBetter` BOOLEAN NOT NULL DEFAULT 1,
	PRIMARY KEY (`trackerId`));

CREATE TABLE IF NOT EXISTS `stockview`.`TemplateToTrackers` (
	`trackerId` INT(11) NOT NULL,
	`templateId` INT(11) NOT NULL,
	CONSTRAINT
		FOREIGN KEY (`trackerId`)
		REFERENCES `stockview`.`Trackers` (`trackerId`),
	CONSTRAINT 
		FOREIGN KEY (`templateId`)
		REFERENCES `stockview`.`Templates` (`templateId`));

CREATE TABLE IF NOT EXISTS `stockview`.`Industries` (
	`industryId` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`industryId`));

CREATE TABLE IF NOT EXISTS `stockview`.`Securities` (
	`securityId` INT(11) NOT NULL AUTO_INCREMENT,
	`symbol` VARCHAR(8) NOT NULL,
	`industryId` INT(11) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`description` VARCHAR(100) NULL,
	PRIMARY KEY (`securityId`),
	CONSTRAINT
		FOREIGN KEY (`industryId`)
		REFERENCES `stockview`.`Industries` (`industryId`));

CREATE TABLE IF NOT EXISTS `stockview`.`Watchlists` (
	`watchlistId` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`watchlistId`));

CREATE TABLE IF NOT EXISTS `stockview`.`WatchlistToSecurities` (
	`watchlistId` INT(11) NOT NULL,
	`securityId` INT(11) NOT NULL,
	CONSTRAINT
		FOREIGN KEY (`watchlistId`)
		REFERENCES `stockview`.`Watchlists` (`watchlistId`),
	CONSTRAINT 
		FOREIGN KEY (`securityId`)
		REFERENCES `stockview`.`Securities` (`securityId`));

CREATE TABLE IF NOT EXISTS `stockview`.`TrackersSecuritiesJnct` (
	`trackerId` INT(11) NOT NULL,
	`securityId` INT(11) NOT NULL,
	`date` DATE NOT NULL,
	`value` BIGINT(11) NOT NULL,
	CONSTRAINT
		FOREIGN KEY (`trackerId`)
		REFERENCES `stockview`.`Trackers` (`trackerId`),
	CONSTRAINT 
		FOREIGN KEY (`securityId`)
		REFERENCES `stockview`.`Securities` (`securityId`));