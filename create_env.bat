@echo off

:: Create .env file for the backend
cd store-backend
(echo DATABASE_URL=postgresql://<username>:<password>@localhost:5432/ecommerce) > .env

echo .env file created successfully in store-backend directory.