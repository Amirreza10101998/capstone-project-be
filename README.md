# capstone-project-be

A backend server for the Music Discovery App, a platform that allows users to discover and share music based on their preferences.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Database Schema](#database-schema)

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- OAuth (Google, Facebook)
- JSON Web Tokens (JWT)
- Socket.io

## Features

### User Authentication
- User sign up and login functionality
- OAuth integration for Google and Facebook sign up/login
- JWT-based authentication and authorization

### User Profiles
- Create and edit user profiles
- Store user preferences, such as favorite genres and artists

### Discover Feed
- Integrate a music API (e.g., Spotify or Deezer) to fetch song recommendations based on user preferences
- Store song cards and user interactions in the database

### Following Feed
- Display song cards shared by followed users
- Store likes and comments on song cards in the database

### Real-time Listening Rooms
- Implement Socket.io for real-time listening rooms
- Store listening room data in the database

### Database Schema
- Users: contains user authentication and profile data
- Playlists: stores custom playlists created by users
- SongCards: contains song card data and user interactions (likes, comments, shares)
- ListeningRooms: stores data related to real-time listening rooms
