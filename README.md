# 💇‍♀️ Salon Booking & E-Commerce Website

Welcome to the Salon Booking and E-Commerce Website!  
This project lets customers:
- 📅 Book salon appointments online (with flexible slot & staff selection)
- 🛒 Shop for products and manage orders
- 📧 Contact the business
- 🔐 Register, login, and manage their bookings & orders via a simple dashboard

---

## 📌 **Features**
- Multi-step appointment booking: select category ➜ service ➜ date & time ➜ basic details ➜ secure payment
- Fully responsive design (desktop & mobile)
- Product catalog with shopping cart and order management
- Secure authentication & user dashboard
- Payment integration (e.g., Paystack, Stripe, etc.)
- Thank you page with animated countdown redirect
- Reusable components for header, footer, sidebar
- Modern CSS flexbox & grid layouts

---

## ⚙️ **Tech Stack**

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | HTML, CSS, JavaScript (Vanilla)               |
| UI Framework | Flatpickr for date picker, FontAwesome Icons  |
| Backend      | Node.js, Express.js, MongoDB                  |
| Auth         | JWT-based authentication                      |
| Payments     | Paystack                                      |

---

## 📁 **Project Structure**
```plaintext
📂 root/
├── index.html             # Homepage
├── appointment.html       # Booking page
├── products.html          # Products listing
├── myorders.html          # User orders
├── about.html             # About us
├── email.html             # Contact page
├── thankyou.html          # Thank you redirect page
├── css/                   # Custom stylesheets
├── js/                    # Client-side JS files
├── img/                   # Static images and logos
├── server/                # Node.js backend (API routes, models, controllers)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── controllers/       # Business logic
│   ├── config/            # DB and auth configs
│   └── app.js             # Express server setup
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # This file!


