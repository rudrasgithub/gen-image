# Image History Debugging Guide

## ✅ Issues Fixed:

1. **Fetch API to Axios** - Changed from native fetch to axios (consistent with app)
2. **Added Console Logging** - Track image saving and retrieval
3. **Request Headers** - Properly formatted with axios

---

## 🔍 TROUBLESHOOTING CHECKLIST

### Step 1: Verify Backend Connection

```bash
# Terminal 1: Check if backend is running
curl http://localhost:4000/api/user/credit

# Should return: {"success":false,"message":"Not Authorized. Login Again!"}
# If you get connection refused, backend is not running
```

### Step 2: Check Browser Console

1. Open browser → Press `F12` → Go to Console tab
2. Generate an image and watch for error messages
3. Check for:
   - ✅ "Image generated" toast message
   - ✅ No red errors in console

### Step 3: Check Backend Logs

When you generate an image, you should see in server terminal:
```
✅ Image saved to DB: [object_id]
✅ User updated with new image
```

If you don't see these, images are NOT being saved to database.

### Step 4: Verify .env Variables

Check `/server/.env`:
```bash
# Must have:
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIP_DROP_API=your_clipdrop_key
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch images" Toast Message

**Cause**: Backend API not responding or token not sent correctly

**Solution**:
```javascript
// Check browser console for actual error:
// 1. Open DevTools (F12)
// 2. Go to Network tab
// 3. Generate image and click History
// 4. Check the /api/image/history request
// 5. Look at Response tab for error message
```

---

### Issue 2: Images Generated But Not Showing in History

**Cause**: Images saved to DB, but not fetching

**Checklist**:
- [ ] Backend running? (Check: `npm start` shows "Server running on port: 4000")
- [ ] Database connected? (Check: logs show "Db connected")
- [ ] Token valid? (Check: browser console Network tab for auth errors)
- [ ] imageModel imported? (Check: `/server/models/imageModel.js` exists)

**Debug Steps**:
1. Check MongoDB directly:
```bash
# Connect to MongoDB
# Run in MongoDB shell:
db.images.find({}).pretty()
# Should show your generated images
```

2. Check backend logs when fetching:
```bash
# Generate image → should show:
# ✅ Image saved to DB: 507f1f77bcf36cd799439011
# ✅ User updated with new image

# Go to History → should show:
# Fetching history for userId: 507f1f77bcf36cd799438011
# Images found: 1
```

---

### Issue 3: Images Show in DB but Not in Frontend

**Cause**: Frontend not correctly fetching or parsing response

**Solution**: Check browser Network tab:
1. F12 → Network tab
2. Go to History page
3. Look for request to `/api/image/history`
4. Click it and check:
   - **Headers tab**: Should show `token: [jwt_token]`
   - **Response tab**: Should show `{"success":true,"images":[...]}`

---

### Issue 4: "Not Authorized. Login Again!"

**Cause**: Token not being sent in headers

**Check**:
```javascript
// In ImageHistory.jsx, verify token is present:
const { backendUrl, token } = useAppContext();
console.log('Token:', token);  // Add this line temporarily

// Should print JWT token (long string)
```

---

## 🔧 Manual Testing Steps

### Complete Flow Test:

1. **Restart everything**:
```bash
# Terminal 1: Backend
cd server
npm start
# Wait for: "Db connected" and "Server running on port: 4000"

# Terminal 2: Frontend
cd client
npm run dev
# Wait for: "Local: http://localhost:5173"
```

2. **Test in browser**:
```
Step 1: Go to http://localhost:5173
Step 2: Login with your credentials
Step 3: Go to /result page
Step 4: Enter prompt: "red car"
Step 5: Click "Generate"
Step 6: Watch server logs for:
        ✅ Image saved to DB
        ✅ User updated
Step 7: Should see image displayed
Step 8: Click "📸 History" button
Step 9: Wait for page to load
Step 10: Should see your generated image in gallery
```

---

## 📊 Expected Network Requests

### Generate Image Request:
```
POST /api/image/generate-image
Headers:
  token: eyJhbGc...
Body:
  { prompt: "red car" }

Response:
  {
    success: true,
    resultImage: "data:image/png;base64,iVBORw0K...",
    imageId: "507f1f77bcf36cd799439011"
  }
```

### Fetch History Request:
```
GET /api/image/history
Headers:
  token: eyJhbGc...

Response:
  {
    success: true,
    images: [
      {
        _id: "507f1f77bcf36cd799439011",
        prompt: "red car",
        imageUrl: "data:image/png;base64,iVBORw0K...",
        createdAt: "2026-01-03T10:30:00.000Z",
        isFavorite: false,
        generationTime: 2500
      }
    ]
  }
```

---

## 📱 Browser DevTools Guide

### Console Tab (F12):
```javascript
// Add this temporarily to ImageHistory.jsx to debug:
const fetchImages = async () => {
  console.log('📊 Fetching images...');
  console.log('Backend URL:', backendUrl);
  console.log('Token:', token ? 'Present' : 'MISSING ❌');
  
  try {
    const { data } = await axios.get(`${backendUrl}/api/image/history`, {
      headers: { token }
    });
    console.log('✅ Response:', data);
  } catch (err) {
    console.error('❌ Error:', err);
  }
};
```

### Network Tab (F12):
1. Click Network tab
2. Go to History page
3. Look for request to `/api/image/history`
4. Click on it
5. Check tabs:
   - **Headers**: Verify token is present
   - **Response**: Should be valid JSON with images array
   - **Timing**: Should be <500ms if working

---

## 🚀 Quick Fix Checklist

If images aren't showing, run through this:

```
[ ] 1. Backend running? 
      → Check terminal shows "Server running on port: 4000"
      → Check "Db connected" message

[ ] 2. Database connected?
      → Run: db.images.find().pretty()
      → Should see generated images

[ ] 3. Generated images in DB?
      → If no, images not being saved
      → Check console.log output from generateImage

[ ] 4. Token valid?
      → F12 → Console
      → Check token is not empty or "undefined"

[ ] 5. Backend receiving requests?
      → F12 → Network tab
      → Check /api/image/history request
      → Should have token in headers

[ ] 6. Response contains images?
      → F12 → Network tab
      → Click /api/image/history request
      → Click Response tab
      → Should show {"success":true,"images":[...]}
```

---

## 📝 File Changes Made

### Updated Files:
1. `ImageHistory.jsx` - Changed fetch to axios
2. `imageController.js` - Added console logging

### Files to Verify:
1. `/server/models/imageModel.js` - Exists ✅
2. `/server/controllers/imageController.js` - Has all 5 functions ✅
3. `/server/routes/imageRoutes.js` - Has all routes ✅
4. `/client/src/components/ImageHistory.jsx` - Updated ✅
5. `/client/src/App.jsx` - Route added ✅
6. `/client/src/context/AppContext.jsx` - State added ✅

---

## 💡 Pro Tips

1. **Always check browser console first** (F12)
2. **Check backend logs for errors** (Watch terminal)
3. **Verify token is present** (Network tab in DevTools)
4. **Test with curl** (Isolate frontend issues):
```bash
curl -H "token: YOUR_JWT_TOKEN" http://localhost:4000/api/image/history
```

5. **MongoDB Shell** (Check if data exists):
```bash
mongo
> use genimage  # or your db name
> db.images.find().pretty()
```

---

## 🎯 Expected Result

After following all steps:
1. Generate image → see "Image Generated" toast ✅
2. Check server logs → see "✅ Image saved to DB" ✅
3. Click History button ✅
4. See gallery with your image ✅
5. All buttons work (favorite, delete, download) ✅

**If any step fails, refer to the specific issue section above.**

