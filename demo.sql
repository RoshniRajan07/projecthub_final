-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: demo
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '76797d37-52d2-11f1-865d-84470926d058:1-344';

--
-- Table structure for table `admin_settings`
--

DROP TABLE IF EXISTS `admin_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `max_file_size` int DEFAULT NULL,
  `max_resubmissions` int DEFAULT NULL,
  `submission_deadline` varchar(255) DEFAULT NULL,
  `allowed_file_types` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_settings`
--

LOCK TABLES `admin_settings` WRITE;
/*!40000 ALTER TABLE `admin_settings` DISABLE KEYS */;
INSERT INTO `admin_settings` VALUES (1,25,3,'30-05-2026',NULL);
/*!40000 ALTER TABLE `admin_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `access_level` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpiovo1hsx7hi5f9ax85epqya9` (`user_id`),
  CONSTRAINT `FKgc8dtql9mkq268detxiox7fpm` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,NULL,8);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allowed_file_types`
--

DROP TABLE IF EXISTS `allowed_file_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allowed_file_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `settings_id` bigint DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `settings_id` (`settings_id`),
  CONSTRAINT `allowed_file_types_ibfk_1` FOREIGN KEY (`settings_id`) REFERENCES `admin_settings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allowed_file_types`
--

LOCK TABLES `allowed_file_types` WRITE;
/*!40000 ALTER TABLE `allowed_file_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `allowed_file_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_title` varchar(255) DEFAULT NULL,
  `description` text,
  `performed_by` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FKonjalmr7kf8970g8gu7ymueer` (`performed_by`),
  CONSTRAINT `FKonjalmr7kf8970g8gu7ymueer` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'User Created','Created user: John Doe',NULL,'2026-05-28 07:57:27'),(2,'User Created','Created user: Jane Smith',NULL,'2026-05-28 07:57:35'),(3,'User Updated','Updated user: Student Updated',NULL,'2026-05-29 09:59:09'),(4,'User Updated','Updated user: Student Updated',NULL,'2026-05-29 10:07:34'),(5,'User Updated','Updated user: Student Updated',NULL,'2026-05-29 10:07:37'),(6,'User Updated','Updated user: swathi',NULL,'2026-05-29 10:19:13'),(7,'User Updated','Updated user: siva',NULL,'2026-05-29 10:24:22'),(8,'User Updated','Updated user: siva',NULL,'2026-05-29 10:24:57'),(9,'User Created','Created new user: Swathi',41,'2026-06-01 09:20:25'),(10,'User Created','Created new user: Test Student',42,'2026-06-01 14:58:03'),(11,'User Created','Created new user: priyasri',43,'2026-06-01 15:54:03');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3eea1r6n844u6vn4qae7dix4` (`user_id`),
  CONSTRAINT `FKfakwwhqpm5bahy2do8t30j58r` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (2,'CSE','Artificial Intelligence',38),(3,'CSE','Cloud Computing',39);
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `abstract_text` varchar(2000) DEFAULT NULL,
  `draft` bit(1) DEFAULT NULL,
  `feedback` varchar(2000) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `submission_date` datetime(6) DEFAULT NULL,
  `technology` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `version_number` int DEFAULT NULL,
  `faculty_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnk5gb84tc4271pocth8rx5sm3` (`faculty_id`),
  KEY `FKl1xvk23ld0d0ylvsv6jgrkdlx` (`student_id`),
  CONSTRAINT `FKl1xvk23ld0d0ylvsv6jgrkdlx` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKnk5gb84tc4271pocth8rx5sm3` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `faculty_id` bigint DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `hackerrank_url` varchar(255) DEFAULT NULL,
  `leetcode_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `student_code` varchar(255) DEFAULT NULL,
  `enrollment_year` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  KEY `FK472u8uhciyn9h12cykodmnd1` (`faculty_id`),
  CONSTRAINT `FK472u8uhciyn9h12cykodmnd1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (2,'ai/ds','2024',30,2,'https://github.com/testuser','https://hackerrank.com/testuser','https://leetcode.com/testuser','https://linkedin.com/in/testuser','https://testuser.dev','STU-S157',NULL,NULL),(5,NULL,NULL,33,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,NULL,NULL,41,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,NULL,NULL,42,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,NULL,NULL,43,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `assigned_subject` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'anu@gmail.com','Anu','123','STUDENT',NULL,NULL),(8,'admin@gmail.com','Admin','123','ADMIN',NULL,NULL),(9,'swathi@gmail.com','Swathi Saravanan','12345','STUDENT','swathi',NULL),(10,'audit@gmail.com','Audit Test','12345','STUDENT','audittest',NULL),(29,'bcrypt@gmail.com','BCrypt User','$2a$10$t0ZDqnEyonUluwBuW.Cvq.X2YdqSaHLO6zlMGu1KaqVAtAPeWsPUm','ADMIN','bcryptuser',NULL),(30,'siva062005@gmail.com','siva','$2a$10$TD6xWrcpCR8xsJgEHRIXXuAopJaXM1WE2SMfP/MDjpJp2voI5mIxC','STUDENT',NULL,NULL),(33,'student2@gmail.com','Test Student','$2a$10$0cJbrUHoDQUY6y0bRx5R/.bCsFmNMnA9LY2kwbb14y5H/3RJE1lKW','STUDENT','student2',NULL),(35,'admin@test.com','Admin','$2a$10$iIYzyCsneqy7FRVms7Tt5.CJ4nU8Cty9fzdeeoQ3/mdpe6D4bN2hu','ADMIN','admin',NULL),(36,'admin@admin.com','System Admin','$2a$10$azhk.j/ovyVB8C07UPBo8ulay2RxfLZTLdIsEBtutPVfobSMPItCC','ADMIN','admin',NULL),(37,'admin@university.edu','System Admin','$2a$10$vA9gfZ8x5gpVRGMqAmvIveo1sGgkXK2stxNWYXuTnSed/Gr5HKUZO','ADMIN','admin',NULL),(38,'faculty1@demo.com','John Doe','12345','FACULTY',NULL,'Computer Science'),(39,'faculty2@demo.com','Jane Smith','12345','FACULTY',NULL,'Information Technology'),(40,'roshni@test.com','Roshni','$2a$10$ZL.Sdju1gmZxHqDtj749Yuy6JrFcGy4UCIY46n6GmtVC8NNGUBdYu','STUDENT',NULL,NULL),(41,'swathi@test.com','Swathi','$2a$10$rBqxl.cMLNXEtfOL7Fi9L./jVi6hwwkOl3HZwpOx8wNicwkPfl6LS','STUDENT',NULL,NULL),(42,'student@test.com','Test Student','$2a$10$SorbdLBR9OiMZVTG8Nz21.T7PxoF5acSbxL3fMiCWpX70Qf9KKGCy','STUDENT','teststudent',NULL),(43,'faculty3@demo.com','priyasri','$2a$10$4MU59.wM1Rn8zsWnRMjdXO1ZGMLT6sCzA5KvYJViP9LprzLUqSgLC','STUDENT','priyasri',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02  9:57:34
