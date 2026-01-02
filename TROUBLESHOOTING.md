# 🔧 Troubleshooting Guide

Common issues and solutions for CropAid system.

---

## 🗄️ Database Issues

### Error: "Cannot connect to database"

**Symptoms:**
- Backend shows "Database connection failed"
- Error message: "ECONNREFUSED" or "ER_ACCESS_DENIED_ERROR"

**Solutions:**

1. **Check if MySQL is running:**
   - Open XAMPP Control Panel
   - Ensure MySQL shows "Running" status
   - If not, click "Start" button

2. **Verify database exists:**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Check if `cropaid_db` database exists
   - If not, create it and import `backend/database/schema.sql`

3. **Check credentials:**
   - Open `backend/.env`
   - Verify:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=          # Usually empty for XAMPP
     DB_NAME=cropaid_db
     DB_PORT=3306
     ```

4. **Test MySQL manually:**
   ```bash
   mysql -u root -p
   # Press Enter when prompted for password (XAMPP default has no password)
   USE cropaid_db;
   SHOW TABLES;
   ```

### Error: "Table doesn't exist"

**Solution:**
1. Open phpMyAdmin
2. Select `cropaid_db`
3. Click "Import" tab
4. Choose `backend/database/schema.sql`
5. Click "Go"

---

## 🔐 Authentication Issues

### Error: "Invalid or expired token"

**Symptoms:**
- Can't access protected pages
- Automatically logged out
- "403 Forbidden" errors

**Solutions:**

1. **Clear browser data:**
   - Open browser DevTools (F12)
   - Go to "Application" tab
   - Click "Local Storage"
   - Delete `token` and `user` items
   - Refresh page and login again

2. **Check JWT_SECRET:**
   - Open `backend/.env`
   - Ensure `JWT_SECRET` has a value
   - If empty, add any random string:
     ```env
     JWT_SECRET=my_super_secret_key_2026
     ```
   - Restart backend server

### Error: "Login failed" or "Invalid credentials"

**Solutions:**

1. **For Admin Login:**
   - Email: `admin@cropaid.com`
   - Password: `admin123`
   - If still fails, update password hash in database

2. **For Farmer Login:**
   - Ensure you registered first
   - Use email or RSBSA number as identifier
   - Password is case-sensitive

3. **Check backend logs:**
   - Look at terminal where backend is running
   - Check for specific error messages

---

## 🌐 Network/Connection Issues

### Error: "Network Error" or "Failed to fetch"

**Symptoms:**
- Frontend can't reach backend
- "CORS error" in browser console
- Requests fail with network errors

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # In backend directory
   npm run dev
   ```
   - Should see: "Server running on http://localhost:3000"

2. **Check API URL:**
   - Open browser DevTools → Network tab
   - Click on failed request
   - Check if URL is correct (should be http://localhost:3000/api/...)

3. **Update environment:**
   - Create/edit `.env` in project root:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```
   - Restart frontend (Ctrl+C and `npm run dev`)

4. **Check CORS settings:**
   - Open `backend/src/server.js`
   - Verify CORS origin matches frontend URL:
     ```javascript
     app.use(cors({
         origin: 'http://localhost:5173'
     }));
     ```

### Error: "Port already in use"

**For Backend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or change port in backend/.env
PORT=3001
```

**For Frontend (Port 5173):**
```bash
# Kill the process or change port in vite.config.js
```

---

## 📁 File Upload Issues

### Error: "File upload failed"

**Solutions:**

1. **Check uploads directory:**
   ```bash
   # In backend folder
   ls -la uploads/    # Mac/Linux
   dir uploads        # Windows
   
   # If doesn't exist:
   mkdir uploads
   ```

2. **Verify file size:**
   - Max size: 5MB
   - Check actual file size before uploading

3. **Verify file type:**
   - Allowed: .jpg, .jpeg, .png, .gif, .mp4, .mov, .avi
   - Case-sensitive extensions

4. **Check permissions:**
   - `backend/uploads/` folder should be writable
   - On Mac/Linux: `chmod 755 uploads/`

### Error: "No files uploaded"

**Solution:**
- Ensure you selected files before clicking submit
- Check browser console for errors
- Try with smaller files first

---

## 🎨 Frontend Issues

### Issue: "Mock Mode" overlay appears

**Symptoms:**
- Yellow banner saying "Running in Mock Mode"
- Data doesn't persist after refresh

**Solutions:**

1. **Start backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Wait for connection:**
   - Frontend checks backend on startup
   - May take a few seconds
   - Refresh page if needed

3. **Check health endpoint:**
   - Open: http://localhost:3000/api/health
   - Should see: `{"status":"ok",...}`
   - If not, backend isn't running properly

### Issue: Page shows blank or white screen

**Solutions:**

1. **Check browser console:**
   - Press F12
   - Look for red error messages
   - Check "Console" tab

2. **Clear browser cache:**
   - Ctrl+Shift+Delete (Windows)
   - Cmd+Shift+Delete (Mac)
   - Clear "Cached images and files"

3. **Verify frontend is running:**
   ```bash
   npm run dev
   ```

4. **Check for JavaScript errors:**
   - Look for syntax errors in console
   - Check if all dependencies installed

### Issue: Styles not loading / looks broken

**Solutions:**

1. **Rebuild Tailwind:**
   ```bash
   npm run dev
   ```
   - Vite rebuilds automatically

2. **Clear browser cache**

3. **Check CSS imports:**
   - Verify `src/index.css` is imported in `src/main.jsx`

---

## 📦 Package/Dependency Issues

### Error: "Cannot find module"

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18 or higher
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

### Error: "npm ERR! code ENOENT"

**Solution:**
- Ensure you're in correct directory
- Check if `package.json` exists
- Run `npm install` in directory with `package.json`

---

## 🔍 Debugging Tips

### Enable Detailed Logging

**Backend:**
Edit `backend/src/server.js`:
```javascript
// Add after imports
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

**Frontend:**
Add in component:
```javascript
useEffect(() => {
    console.log('Current state:', someState);
}, [someState]);
```

### Check API Responses

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Click on any request
4. Check "Response" tab
5. Look for error messages

### Test Backend Directly

Use browser or curl:
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@cropaid.com","password":"admin123"}'
```

---

## 🚨 Emergency Recovery

### Complete Reset

If everything breaks:

1. **Stop all servers:** Ctrl+C in all terminals

2. **Reset database:**
   ```sql
   DROP DATABASE cropaid_db;
   CREATE DATABASE cropaid_db;
   -- Then import schema.sql again
   ```

3. **Clear all caches:**
   - Browser cache
   - localStorage
   - Node modules

4. **Reinstall everything:**
   ```bash
   # Frontend
   rm -rf node_modules
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   ```

5. **Start fresh:**
   - Start MySQL (XAMPP)
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `npm run dev`

---

## 📞 Getting Help

### Before Asking for Help

Collect this information:

1. **Error message** (exact text)
2. **What you were doing** when error occurred
3. **Browser console logs** (F12 → Console)
4. **Backend terminal output**
5. **Operating System** (Windows/Mac/Linux)
6. **Node.js version** (`node --version`)
7. **MySQL status** (running or not)

### Check These First

- [ ] XAMPP MySQL is running
- [ ] Database `cropaid_db` exists
- [ ] Backend server is running (port 3000)
- [ ] Frontend server is running (port 5173)
- [ ] `.env` files are configured
- [ ] Dependencies are installed (`npm install`)
- [ ] No other apps using ports 3000 or 5173

---

## 🎯 Prevention Tips

1. **Always start services in order:**
   - MySQL first (XAMPP)
   - Backend second
   - Frontend third

2. **Check before coding:**
   - All servers running
   - No errors in console
   - Database accessible

3. **Regular backups:**
   - Export database weekly
   - Commit code changes to Git
   - Save `.env` files securely

4. **Keep logs:**
   - Save error messages
   - Screenshot issues
   - Note what worked

---

## 📝 Common Questions

**Q: Do I need internet connection?**
A: No, everything runs locally. Internet only needed for initial package installation.

**Q: Can I use PostgreSQL instead of MySQL?**
A: Yes, but you'll need to modify database connection and schema.

**Q: How do I add more admin users?**
A: Manually insert into database or create an admin registration endpoint.

**Q: Where are uploaded files stored?**
A: `backend/uploads/` folder.

**Q: Can I change the port?**
A: Yes, edit `backend/.env` for backend and `vite.config.js` for frontend.

---

**Last Updated:** January 2, 2026

If your issue isn't listed here, check:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) for setup-specific issues
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick tips
- Backend logs for detailed error messages
