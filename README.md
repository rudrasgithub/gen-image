# GenImage 🎨

An AI-powered image generation web application built with React and Node.js. Generate stunning images from text prompts with a credit-based system.

## ✨ Features

- **AI Image Generation** - Create images from text descriptions
- **User Authentication** - Secure login and registration system
- **Credit System** - Purchase credits to generate images
- **Image History** - View and manage your generated images
- **Razorpay Integration** - Seamless payment processing
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Motion** - Animation library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Razorpay** - Payment gateway

## 📁 Project Structure

```
GenImage/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   └── public/
│
└── server/                 # Node.js backend
    ├── api/                # API entry point
    ├── config/             # Database configuration
    ├── controllers/        # Route controllers
    ├── middlewares/        # Auth middleware
    ├── models/             # Mongoose models
    └── routes/             # API routes
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GenImage.git
   cd GenImage
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Run the development servers**

   ```bash
   # Start the backend server
   cd server
   npm start

   # In a new terminal, start the frontend
   cd client
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 📜 Available Scripts

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server
| Command | Description |
|---------|-------------|
| `npm start` | Start server with nodemon |

## 🔗 API Endpoints

### Authentication
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login

### Images
- `POST /api/image/generate` - Generate a new image
- `GET /api/image/history` - Get user's image history

### Payments
- `POST /api/user/pay-razor` - Create Razorpay order
- `POST /api/user/verify-razor` - Verify payment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- AI image generation powered by advanced ML models
- UI components styled with Tailwind CSS
- Payment processing by Razorpay
