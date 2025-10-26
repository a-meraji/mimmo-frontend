# Quick Setup Guide 🚀

## For New Developers

If you've just cloned this repository, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```

That's it! The app will run on `http://localhost:3000`

---

## Environment Variables

The `.env.local` file is already configured with default development values. You typically don't need to change anything unless you have a custom backend setup.

**Default configuration**:
- ✅ Development backend: `http://5.75.203.252:3000`
- ✅ Production backend: `https://back.mimmoacademy.com`

---

## Common Issues

### Issue: "Missing environment variables" warning

**Solution**: Make sure you copied `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Issue: API requests failing

**Solution**: Check that the backend server is running and accessible at the URL specified in your `.env.local` file.

### Issue: Changes to `.env.local` not taking effect

**Solution**: Restart your development server:
```bash
# Stop the server (Ctrl+C) then:
npm run dev
```

---

## Need Help?

- 📖 **Full documentation**: See `utils/FETCH_INSTANCE_GUIDE.md`
- 🔒 **Security info**: See `SECURITY_IMPLEMENTATION_COMPLETE.md`
- 📝 **Quick reference**: See `utils/FETCH_CHEATSHEET.md`

---

## Important

❌ **NEVER commit `.env.local`** - It's already in `.gitignore`

✅ **DO update `.env.example`** if you add new required variables

