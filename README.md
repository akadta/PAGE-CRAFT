<div align="center">

# 🧩 Page Craft

### 🎨 Design it. Drag it. Publish it.

A fully customizable website management system where you build and edit your entire website visually, with no code required.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

## ✨ Features

- 🖱️ **Drag & drop builder**: arrange sections visually in real time
- 🦸 **Hero section editor**: custom headings, images, buttons and backgrounds
- 📖 **About, services, gallery, testimonials, contact** and more ready-made blocks
- 🧱 **Custom sections**: create and add your own blocks
- 🎨 **Theme customization**: colors, fonts, spacing and layouts
- 📱 **Responsive preview**: desktop, tablet and mobile views
- 🖼️ **Media manager**: upload and manage images
- 🧭 **Menu & navigation manager**
- 🔍 **SEO controls**: titles, meta descriptions and social previews
- 📄 **Multiple pages** with custom URLs
- 💾 **Draft & publish** workflow
- 🔐 **Secure admin panel** with authentication

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🎨 Frontend | React + Vite |
| ⚙️ Backend | Node.js + Express |
| 🗄️ Database | PostgreSQL |
| 🖱️ Drag & Drop | dnd-kit |
| 🎯 Styling | CSS / Tailwind |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/akadta/PAGE-CRAFT.git
cd PAGE-CRAFT
```

### 2️⃣ Setup the database

```sql
CREATE DATABASE site_forge;
```

### 3️⃣ Setup the backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/site_forge
JWT_SECRET=your_secret_key
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 4️⃣ Setup the frontend

```bash
cd client
npm install
npm run dev
```

### 5️⃣ Open the app

```
Admin Panel → http://localhost:5173/admin
Live Site   → http://localhost:5173
```

---

## 🎯 Roadmap

- [x] Drag & drop section builder
- [x] Hero and about editors
- [x] Theme customization
- [ ] Multi-page support
- [ ] Template library
- [ ] Role-based access
- [ ] Custom domain support
- [ ] Version history & rollback
- [ ] Form submissions manager

---

## 🤝 Contributing

Contributions are welcome!

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit: `git commit -m "Add amazing feature"`
4. 🚀 Push: `git push origin feature/amazing-feature`
5. 📬 Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.

---

<div align="center">

### ⭐ If you like Page Craft, give it a star!
Made with ❤️ by [akadta](https://github.com/akadta)

</div>
