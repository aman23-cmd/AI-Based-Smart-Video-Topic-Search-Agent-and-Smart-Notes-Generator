-- ============================================
-- AI Video Search Agent — Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS ai_video_search
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ai_video_search;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(80)   NOT NULL UNIQUE,
    email         VARCHAR(120)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================
-- Transcripts Table
-- ============================================
CREATE TABLE IF NOT EXISTS transcripts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    video_id            VARCHAR(20)   NOT NULL,
    video_url           VARCHAR(500)  NOT NULL,
    video_title         VARCHAR(500)  DEFAULT '',
    transcript_text     LONGTEXT      NOT NULL,
    transcript_segments JSON          NOT NULL,
    created_at          DATETIME      DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_video_id (video_id)
) ENGINE=InnoDB;

-- ============================================
-- Searches Table
-- ============================================
CREATE TABLE IF NOT EXISTS searches (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT           NOT NULL,
    query           VARCHAR(500)  NOT NULL,
    video_url       VARCHAR(500)  NOT NULL,
    video_title     VARCHAR(500)  DEFAULT '',
    transcript_id   INT           DEFAULT NULL,
    results         JSON          DEFAULT NULL,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)       REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE SET NULL,
    INDEX idx_user_searches (user_id, created_at)
) ENGINE=InnoDB;

-- ============================================
-- Generated Notes Table
-- ============================================
CREATE TABLE IF NOT EXISTS generated_notes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT           NOT NULL,
    transcript_id   INT           NOT NULL,
    topic           VARCHAR(500)  NOT NULL,
    notes_content   LONGTEXT      NOT NULL,
    notes_type      VARCHAR(50)   DEFAULT 'bullet',
    key_concepts    JSON          DEFAULT NULL,
    questions       JSON          DEFAULT NULL,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)       REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE CASCADE,
    INDEX idx_user_notes (user_id, created_at)
) ENGINE=InnoDB;

-- ============================================
-- Playlists Table
-- ============================================
CREATE TABLE IF NOT EXISTS playlists (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT           NOT NULL,
    playlist_url    VARCHAR(500)  NOT NULL,
    playlist_title  VARCHAR(500)  DEFAULT '',
    video_ids       JSON          DEFAULT NULL,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_playlists (user_id)
) ENGINE=InnoDB;

-- ============================================
-- JWT Blacklist (for logout)
-- ============================================
CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    jti        VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_jti (jti)
) ENGINE=InnoDB;
