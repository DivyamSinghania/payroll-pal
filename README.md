# 🧾 Payroll Management System – Full Stack

A complete role-based payroll management web application built as part of the Full-Stack Developer Internship Assignment.

---

## 🚀 Project Overview

This project implements a functional **Payroll Management System** with:

- Secure authentication
- Admin & Employee roles
- Salary slip management
- Expense tracking
- Interactive dashboards
- Clean UI & scalable backend architecture

It follows modern full-stack development best practices.

---

## 🧑‍💻 Tech Stack

### Frontend
- **React + TypeScript** – Component-based UI development
- **Tailwind CSS** – Utility-first styling with responsive design
- **TanStack React Query** – Efficient server state management
- **ShadCN UI** – Clean, accessible UI components

### Backend / Database
- **Supabase (PostgreSQL)** – Managed relational database
- **Supabase Auth** – Email/password authentication
- **Row Level Security (RLS)** – Role-based access control

### Deployment & Tooling
- **Vite** – Fast development environment
- **GitHub** – Version control & submission

---

## 🧠 Why This Tech Stack?

| Requirement | Chosen Solution | Reason |
|-----------|---------------|--------|
Scalable database | PostgreSQL (Supabase) | ACID compliant, relational, production-grade |
Secure authentication | Supabase Auth | Built-in auth with session management |
Role-based access | PostgreSQL RLS | Enforces security directly at DB level |
Modern frontend | React + Tailwind | Fast UI development & responsive UX |
State management | React Query | Efficient caching & API synchronization |
Maintainable code | TypeScript | Type safety & long-term scalability |

---


---

## 🛠️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/DivyamSinghania/payroll-pal
cd payroll-management-system
```
2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Environment Variables

Create a .env file in root folder:
VITE_SUPABASE_PROJECT_ID= your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY= your_key
VITE_SUPABASE_URL= your_URL

4️⃣ Run the Application
```bash
npm run dev
```

The app will run at:

http://localhost:8080

5️⃣ Demo Credentials
Email: hire-me@anshumat.org
Password: HireMe@2025!

🧩 **Core Features**
Authentication

Secure login & signup

Role-based access control

Admin Capabilities

Create & manage employees

Generate & update salary slips

Review expenses

Payroll analytics

Employee Capabilities

View salary slips

Submit monthly expenses

Track expense history

Dashboards

Salary & expense trends

Interactive charts

Clean data tables

🧪 **Bonus Features**

Search & filters

Pagination

Approval workflow

Responsive UI

Optimized queries & caching

🏁 **Conclusion**

This project demonstrates:

Strong full-stack development skills

Secure backend architecture

Clean frontend design

Scalable system planning

Designed to meet real-world payroll requirements with maintainable and extensible code.