-- Run on Debian server as MariaDB root:
--   sudo mariadb < init-db.sql

CREATE DATABASE IF NOT EXISTS blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'blog'@'localhost' IDENTIFIED BY 'blog_password_change_me';
GRANT ALL PRIVILEGES ON blog.* TO 'blog'@'localhost';
FLUSH PRIVILEGES;
