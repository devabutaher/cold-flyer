# Cold Flyer

Modern AC service booking and AC parts marketplace built with Next.js App Router and Firebase Authentication.

---

## 🚀 Project Overview

Cold Flyer is a responsive web application for AC services and AC parts management. Users can browse products, search and filter items, view detailed product information, and manage products through protected routes with Firebase Authentication.

This project was built as part of the Odyssey Next.js Assessment Task using modern web technologies and responsive UI design principles.

---

## ✨ Key Features

### 🔐 Authentication
- Firebase Email & Password Authentication
- Google Login (optional)
- Protected routes using authentication guard
- Persistent user session handling

### 🏠 Landing Page
- Responsive sticky navbar
- Authentication-aware navigation
- Hero section with CTA
- Multiple promotional/content sections
- Responsive footer

### 📦 Items System
- Product listing page
- Search functionality
- Multi-filter support
- Responsive product grid
- Dynamic product details page

### ➕ Protected Product Management
- Add new products/items
- Manage products page
- Delete products
- Protected routes for authenticated users only

### 🎨 UI & UX
- Fully responsive design
- Consistent spacing and layout system
- Interactive hover and focus states
- Clean typography hierarchy
- Modern component-based architecture

---

## 🛠️ Tech Stack

- Next.js (App Router)
- React
- Firebase Authentication
- Tailwind CSS
- JavaScript
- Shadcn UI
- Context API

---

## 📂 Routes Overview

| Route | Description |
|---|---|
| `/` | Landing page |
| `/about` | About page |
| `/items` | All items/products |
| `/items/[id]` | Dynamic item details page |
| `/items/add` | Protected add item page |
| `/items/manage` | Protected manage items page |
| `/login` | User login |
| `/register` | User registration |

---

## 🔒 Protected Routes

The following routes require authentication:

- `/items/add`
- `/items/manage`

Unauthenticated users are redirected to the login page.

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devabutaher/cold-flyer.git
```

### 2. Navigate to Project Folder

```bash
cd cold-flyer
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 📱 Responsive Design

The application is optimized for:

- Mobile devices
- Tablets
- Desktop screens

---

## 📌 Future Improvements

- Database integration
- Product editing functionality
- Advanced filtering & sorting
- Wishlist & cart system
- Admin dashboard
- Real-time updates

---

## 🌐 Live Demo

```txt
https://cold-flyer.vercel.app
```

---

## 📁 GitHub Repository

```txt
https://github.com/devabutaher/cold-flyer
```

---

## 👨‍💻 Author

Developed by Abu Taher

---

## 📄 License

This project is licensed under the MIT License.