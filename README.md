
# 🎓 NexPath – Full Stack Learning Management System

NexPath is a full-stack EdTech platform, It enables users to browse, purchase, and access online courses with secure authentication, role-based access control, and real-time payment integration.

---

## 🚀 Features

- 👤 **Authentication & Authorization** – Login/signup with JWT, role-based access (Admin, Instructor, User)  
- 🧑‍🏫 **Course Management** – Add, edit, and view courses with media support  
- 💳 **Stripe Integration** – Secure real-time payments using Stripe + Webhooks  
- 🌐 **Responsive UI** – Fully responsive frontend built with Tailwind CSS and shadcn/ui  
- ☁️ **Cloudinary Integration** – Optimized image and video uploads  
- 🔒 **Secure APIs** – RESTful APIs with proper validation and authentication  
- 📈 **User Dashboard** – Track purchases, access content, and view learning progress  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- shadcn/ui  
- React Router  
- Redux / Context API  

### Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT for Auth  
- Stripe for Payments  
- Cloudinary for Media Uploads  


---

## 📁 Folder Structure

```
NexPath/
├── client/               # Frontend (React)
├── server/               # Backend (Node/Express)
├── .env                  # Environment Variables
└── README.md
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/Arpit12890/NexPath.git
cd NexPath
```

2. **Install frontend and backend dependencies**

```bash
cd client
npm install
cd ../server
npm install
```

3. **Set up environment variables**

Create `.env` files in both `client/` and `server/` with the required keys:

```env
# .env (server)
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the app**

```bash
# Start client
cd client
npm start

# Start server
cd ../server
npm run dev
```

---

## 🌐 Live Demo

🔗Live link-
https://nexpath.onrender.com/

---

## 📚 Learnings

- Implemented real-world authentication, payments, and role-based access.  
- Improved API design and secure data handling.  
- Practiced scalable architecture and responsive UI development.  

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Connect With Me

- 📧 [arpitgupta205001@gmail.com](mailto:arpitgupta205001@gmail.com)  
- 💼 [LinkedIn](https://www.linkedin.com/in/arpit-gupta-014819252/)  
- 🧑‍💻 [GitHub](https://github.com/Arpit12890)
