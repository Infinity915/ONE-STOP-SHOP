# 🛍️ One Stop Shop – MERN E-Commerce Platform

One Stop Shop is a modern full-stack E-Commerce website built using the **MERN stack** (MongoDB, Express, React, Node.js). It offers a smooth and secure shopping experience with features like user authentication, admin management, real-time cart updates, and integrated **Braintree payment processing**.

---

## 🌟 Features

### 🧑‍💼 User
- ✅ User registration & login
- 🛒 Add to Cart, Remove, Update quantities
- 📦 Place orders and view order history
- 💳 Braintree secure payment gateway
- 📄 Order confirmation with transaction details
- 👤 View and edit profile

### 🛠️ Admin
- 🛂 Admin-only protected routes
- 🗂️ Create, update & delete products
- 🏷️ Category management
- 👥 Manage all users
- 📊 View and update order status

### 💡 Tech Stack
- **Frontend**: React, React Router, Context API, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Payments**: Braintree Integration (with sandbox mode)
- **Auth**: JWT-based user & admin authentication
- **Others**: dotenv, axios, toastify, nodemon, cors

---

## 🚀 Live Demo (optional)
> _Coming Soon: Deploy on Vercel / Render / Netlify + MongoDB Atlas_

---

## 🧰 Installation & Setup

### 📁 Clone & Install
```bash
git clone https://github.com/yourusername/onestopshop.git
cd onestopshop


Backend Setup
bash
Copy
Edit
cd backend
npm install

Create .env file in backend/:

ini
Copy
Edit
PORT=2100
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
BRAINTREE_MERCHANT_ID=your_id
BRAINTREE_PUBLIC_KEY=your_key
BRAINTREE_PRIVATE_KEY=your_key

Start Backend:
bash
Copy
Edit
npm run dev


💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Visit: http://localhost:5173

🧪 Test Credentials
Role	Email	Password
Admin	admin@example.com	123456
User	user@example.com	123456

📦 Folder Structure
arduino
Copy
Edit
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── index.js
│
├── frontend/
│   ├── assets/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx

🙌 Contribution
Fork the project

Create your feature branch (git checkout -b feature/my-feature)

Commit your changes (git commit -m 'Add awesome feature')

Push to the branch (git push origin feature/my-feature)

Open a Pull Request


📜 License
This project is licensed under the MIT License.

BUILT BY Taksh

