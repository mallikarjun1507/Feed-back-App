# Feedback App Backend

This is the backend of the Feedback App built with **Node.js**, **Express**, **Sequelize**, and **MySQL**.  
It allows users to submit ratings for stores, while admins and store owners have specific permissions.

---

##  Features

- User roles: `ADMIN`, `STORE_OWNER`, `USER`
- Admin: create/edit stores, view ratings
- Store Owner: view store ratings (cannot add or edit ratings)
- User: submit and update ratings for stores
- JWT-based authentication
- Role-based authorization
- Seed data for initial setup

---

##  Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- bcrypt for password hashing
- express-validator for input validation

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/mallikarjun1507/Feed-back-App.git
cd feedback-app/Backend

```
Install dependencies

npm install

```
Setup environment variables
Create a .env file in Backend/ with:

# Server
PORT=4000

# Database
DB_HOST=127.0.0.1
DB_NAME=feedback_app
DB_USER=root
DB_PASS=Root

# JWT Secrets
JWT_SECRET=your_super_secret_key_here   
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
You can change db password as per your db

```
Seed database

node sync.js

```
run backend  nodemone server
run frontend  npm run dev
