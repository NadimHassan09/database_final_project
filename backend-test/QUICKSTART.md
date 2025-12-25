# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend-test
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=backend_test
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=test-secret-key
```

### 3. Setup Database
```bash
npm run setup-db
```

This will:
- ✅ Create the database
- ✅ Create all tables
- ✅ Add constraints and triggers
- ✅ Seed test data with proper password hashes

### 4. Start Server
```bash
npm start
```

Server will run on `http://localhost:5000`

## 🧪 Test Login Credentials

**Admin:**
- Username: `admin`
- Password: `password123`

**Customers:**
- Username: `john_doe` / Password: `password123`
- Username: `jane_smith` / Password: `password123`
- Username: `mike_jones` / Password: `password123`

## 🔗 Frontend Connection

The frontend is already configured to connect to `http://localhost:5000/api`.

If your frontend runs on a different port, update `FRONTEND_URL` in `.env`.

## ✅ Verify Setup

1. Check server is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Test login:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password123"}'
   ```

## 🐛 Troubleshooting

**Database Connection Error:**
- Ensure MySQL is running
- Check `.env` credentials
- Verify database exists: `SHOW DATABASES;`

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

**CORS Errors:**
- Verify `FRONTEND_URL` matches your frontend URL
- Check browser console for exact error

## 📚 Next Steps

1. Start the frontend: `cd ../client/Bookstore && npm run dev`
2. Open browser: `http://localhost:5173`
3. Login with test credentials
4. Test all features!

