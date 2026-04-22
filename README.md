# Student Handbook Guide System

A centralized digital onboarding platform for students - built with Node.js, Express, MySQL, and EJS.

## 📋 Features

- **Interactive Handbook** - Access school rules, policies, and grading system in a mobile-friendly format
- **Step-by-Step Registration Guide** - Track registration progress with clear deadlines
- **Deadline Tracking** - Never miss important dates with smart notifications
- **Payment Guide** - View payment procedures, bank details, and fee structures
- **Support System** - Get answers to common questions
- **Mobile-First Design** - Optimized for Nigerian students using phones

## 🏗️ System Architecture

```
STUDENT_HANDBOOK_-_GUIDE_SYSTEM/
├── backend/           # Application Layer (Node.js + Express)
│   ├── config/       # Database configuration
│   ├── controllers/  # Route handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── server.js     # Main server file
│   └── package.json  # Dependencies
│
├── frontend/         # Presentation Layer (EJS + CSS)
│   ├── public/       # Static assets
│   │   ├── css/      # Stylesheets
│   │   ├── js/       # JavaScript files
│   │   └── images/   # Images
│   └── views/        # EJS templates
│
└── database/         # Database Layer
    └── migrations/   # SQL migration files
```

## 👥 User Roles

|     Role        |      Description                                         |
|-----------------|----------------------------------------------------------|
| **Student**     | View handbook, follow registration steps, track progress |
| **Admin**       | School staff - manage handbooks, steps, announcements    |
| **Super Admin** | System admin - manage multiple schools                   |

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: EJS, CSS3, JavaScript
- **Authentication**: Session-based with bcrypt

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd STUDENT_HANDBOOK_-_GUIDE_SYSTEM
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Edit `backend/.env` with your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=student_handbook
   SESSION_SECRET=your-secret-key
   ```

4. **Set up the database**
   
   Create the database and run migrations:
   ```bash
   cd ../database/migrations
   node run.js
   ```
   
   Or manually import the SQL file:
   ```bash
   mysql -u root -p < 001_initial_schema.sql
   ```

5. **Start the server**
   ```bash
   cd ../backend
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

### Default Login (After Setup)

- **Email**: admin@system.com
- **Password**: admin123

> ⚠️ **Note**: The default password hash in the migration file is a placeholder. Register a new super admin user through the registration page, or manually insert a proper bcrypt hash.

## 📂 Project Structure

### Backend (Application Layer)

| Folder | Purpose |
|--------|---------|
| `config/` | Database connection configuration |
| `controllers/` | Business logic and route handlers |
| `models/` | Database models and queries |
| `routes/` | Express route definitions |
| `middleware/` | Authentication middleware |

### Frontend (Presentation Layer)

| Folder | Purpose |
|--------|---------|
| `views/` | EJS templates for pages |
| `public/css/` | Stylesheets |
| `public/js/` | Client-side JavaScript |
| `public/images/` | Static images |

### Database (Data Layer)

| Folder | Purpose |
|--------|---------|
| `migrations/` | SQL schema and seed data |

## 📊 Database Schema

### Key Tables

- **users** - Student, admin, and super admin accounts
- **institutions** - Schools and organizations
- **handbooks** - School handbook documents
- **handbook_sections** - Individual handbook sections
- **registration_steps** - Registration workflow steps
- **student_progress** - Student progress tracking
- **announcements** - School announcements
- **payments_info** - Payment details (future use)

## 💰 Monetization Strategy

### B2B (Main Model)
- Small school → ₦100k/year
- Medium → ₦300k/year
- Big institutions → ₦500k+

### B2C (Optional)
- Students pay ₦500-₦1000 for premium guides

### Add-ons
- SMS notifications (paid)
- Payment integration (premium)
- Custom branding for schools

## 🔜 Future Enhancements

- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] SMS/Email notifications
- [ ] Document upload functionality
- [ ] FAQ/Help system with chat
- [ ] Mobile app (React Native)
- [ ] Results processing integration
- [ ] Admission tracking

## 📝 License

MIT License - feel free to use this project for educational or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.