#!/bin/bash

# GenImage - Verification Script
# This script checks if everything is set up correctly

echo "🔍 GenImage Image History - Verification Script"
echo "================================================"
echo ""

# Check Node version
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✅ Node.js installed: $(node -v)"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

# Check MongoDB connection
echo ""
echo "2️⃣  Checking MongoDB..."
if [ -f "/home/rudra/Projects/GenImage/server/.env" ]; then
    echo "   ✅ .env file exists"
else
    echo "   ❌ .env file not found"
fi

# Check required files
echo ""
echo "3️⃣  Checking required files..."

files=(
    "/home/rudra/Projects/GenImage/server/models/imageModel.js"
    "/home/rudra/Projects/GenImage/server/controllers/imageController.js"
    "/home/rudra/Projects/GenImage/server/routes/imageRoutes.js"
    "/home/rudra/Projects/GenImage/client/src/components/ImageHistory.jsx"
    "/home/rudra/Projects/GenImage/client/src/App.jsx"
    "/home/rudra/Projects/GenImage/client/src/context/AppContext.jsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ ${file##*/}"
    else
        echo "   ❌ Missing: $file"
    fi
done

# Check package.json scripts
echo ""
echo "4️⃣  Checking npm scripts..."

# Check server start script
if grep -q '"start": "nodemon server.js"' "/home/rudra/Projects/GenImage/server/package.json"; then
    echo "   ✅ Server start script configured"
else
    echo "   ❌ Server start script issue"
fi

# Check client dev script
if grep -q '"dev": "vite"' "/home/rudra/Projects/GenImage/client/package.json"; then
    echo "   ✅ Client dev script configured"
else
    echo "   ❌ Client dev script issue"
fi

echo ""
echo "5️⃣  Checking imports..."

# Check if ImageHistory imported in App.jsx
if grep -q "import ImageHistory from" "/home/rudra/Projects/GenImage/client/src/App.jsx"; then
    echo "   ✅ ImageHistory imported in App.jsx"
else
    echo "   ❌ ImageHistory not imported in App.jsx"
fi

# Check if imageModel imported in imageController
if grep -q "import imageModel from" "/home/rudra/Projects/GenImage/server/controllers/imageController.js"; then
    echo "   ✅ imageModel imported in imageController"
else
    echo "   ❌ imageModel not imported in imageController"
fi

echo ""
echo "================================================"
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. npm start (in /server directory)"
echo "2. npm run dev (in /client directory)"
echo "3. Visit http://localhost:5173"
echo "4. Generate an image"
echo "5. Click '📸 History' button"
echo ""

