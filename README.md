# Project Setup Guide

## Prerequisites
1. **Node.js**: Install the latest version of Node.js from [Node.js official website](https://nodejs.org/).
2. **PostgreSQL**: Install PostgreSQL and pgAdmin4 from [PostgreSQL official website](https://www.postgresql.org/).
3. **Git**: Install Git from [Git official website](https://git-scm.com/).
4. **Prisma CLI**: Install Prisma globally using `npm install -g prisma`.

---

## Steps to Set Up the Project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CMSC-121-MP
```

### 2. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd store-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate the `.env` file:
   - Run the provided batch file to create the `.env` file:
     ```bash
     ../create_env.bat
     ```
   - Update the `.env` file with your PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://<username>:<password>@localhost:5432/ecommerce"
     ```

4. Create the database using pgAdmin4:
   - Open pgAdmin4 and log in.
   - In the left-hand navigation panel, right-click on "Databases" and select "Create > Database...".
   - Enter `ecommerce` as the database name.
   - Select the owner (your PostgreSQL username) and click "Save".

5. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed the database:
   ```bash
   npm run seed
   ```

7. Start the backend server:
   ```bash
   node app.js
   ```

---

### 3. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../store-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser:
   - Visit [http://localhost:3000](http://localhost:3000).

---

## Notes
- Ensure PostgreSQL is running and accessible via pgAdmin4.
- If you encounter issues with the database connection, verify the `DATABASE_URL` in the `.env` file and ensure the database is properly set up in pgAdmin4.
- For production, configure environment variables and use `npm run build` to build the frontend.

## Default Admin Account
After seeding the database, you can use the following admin account:
- Email: seller@store.com
- Password: password123
