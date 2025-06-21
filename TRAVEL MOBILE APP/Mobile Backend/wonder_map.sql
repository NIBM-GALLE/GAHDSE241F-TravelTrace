-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 10, 2025 at 07:50 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wonder_map`
--

-- --------------------------------------------------------

--
-- Table structure for table `special_points`
--

DROP TABLE IF EXISTS `special_points`;
CREATE TABLE IF NOT EXISTS `special_points` (
  `point_id` int NOT NULL AUTO_INCREMENT,
  `trail_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL,
  PRIMARY KEY (`point_id`),
  KEY `trail_id` (`trail_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `special_points`
--

INSERT INTO `special_points` (`point_id`, `trail_id`, `name`, `lat`, `lng`) VALUES
(1, 1, 'Ruwanwelisaya', 8.349170, 80.388480),
(2, 1, 'Sri Maha Bodhiya', 8.347890, 80.390120);

-- --------------------------------------------------------

--
-- Table structure for table `trails`
--

DROP TABLE IF EXISTS `trails`;
CREATE TABLE IF NOT EXISTS `trails` (
  `trail_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `short_description` text,
  `start_lat` decimal(9,6) DEFAULT NULL,
  `start_lng` decimal(9,6) DEFAULT NULL,
  `end_lat` decimal(9,6) DEFAULT NULL,
  `end_lng` decimal(9,6) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `trail_date` date DEFAULT NULL,
  `trail_time` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trail_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trails`
--

INSERT INTO `trails` (`trail_id`, `user_id`, `name`, `category`, `short_description`, `start_lat`, `start_lng`, `end_lat`, `end_lng`, `video_url`, `photo_url`, `trail_date`, `trail_time`, `created_at`) VALUES
(1, 1, 'Anuradhapura Heritage Trail', 'Hiking', 'Explore ancient landmarks in Anuradhapura.', 8.345678, 80.388765, 8.351234, 80.394321, 'videos/anuradhapura_trail.mp4', 'images/anuradhapura_photo.jpg', '2025-06-12', '10:00:00', '2025-06-10 10:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`, `profile_image_url`, `bio`) VALUES
(1, 'nethmitk33@gmail.com', 'nethmitk33@gmail.com', '$2a$10$G0qGGc4N8WAYbxPWE8iuEOury3WmrYhlQSlG4BaOOP9L.p.UaHTyy', 'user', '2025-06-10 14:27:39', NULL, 'happy travel'),
(2, 'randula ruwashantha', 'randula@gmail.com', '$2a$10$Wf9Cq0m73Zk4.X5JB5fdWOYHfcIaAWlr3pjSubCuZjaUPRi3D75Ni', 'user', '2025-06-10 18:52:46', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
