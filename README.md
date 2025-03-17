# GartenSpace24

## About GartenSpace24
GartenSpace24 is a digital platform that facilitates the buying, renting, and leasing of garden spaces. It connects garden owners with individuals looking for green spaces, making transactions seamless and efficient.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: FastAPI, PostgreSQL
- **Authentication**: OAuth2 (Google Login)
- **Containerization**: Docker, Docker Compose

## Repository Structure

```
.
├── backend
│   ├── app
│   │   ├── advert          # Advertisement API
│   │   ├── auth            # Authentication API
│   │   ├── entities        # User and Venue Management API
│   │   ├── google          # Google OAuth Integration
│   │   ├── config.py       # App configuration
│   │   ├── db.py           # Database setup
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── middleware.py   # Middleware configurations
│   │   ├── models.py       # Database models
│   ├── tests               # Backend test suite
│   ├── requirements.txt    # Dependencies
│   ├── Dockerfile          # Backend Docker configuration
│   └── docker-compose.yaml # Docker Compose setup
├── frontend
│   ├── app
│   │   ├── authgoogle      # Google login callback
│   │   ├── authlogin       # User login page
│   │   ├── authsignup      # Signup page
│   │   ├── displayadverts  # Display of available gardens
│   │   ├── publishadvert   # Advert submission form
│   │   ├── userentities    # User profiles and entities
│   ├── components          # Shared UI components
│   ├── context             # Authentication state management
│   ├── styles              # Global styles (Tailwind)
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── next.config.mjs     # Next.js configuration
│   ├── public              # Static assets (logos, icons)
│   ├── pages               # Next.js routing
│   └── cities.json         # Preloaded city data for search
├── docker-compose.yaml     # Full-stack service orchestration
└── readme.md               # This documentation
```

## Installation & Setup
### Prerequisites
- Docker & Docker Compose
- Node.js (for frontend development)
- Python 3.9+ (for backend development)
- Add the **.env** file to the backend and frontend folder based on the **.env.example** file
- Install Postgres locally and create a database, add the URL of that database to the .env file
- Sign-Up for Google-Auth API and add the json credential file to the backend folder

### Running Locally
Clone the repository:
```bash
git clone https://github.com/tombk556/ELTS_backend/tree/main
cd gartenspace24
```

Start the backend:
```bash
cd backend
docker-compose up --build
```

Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

The app should now be accessible at `http://localhost:3000`.

## Features
- **Garden Listings**: Users can browse and filter available gardens
- **Advert Publishing**: Owners can list their gardens
- **User Authentication**: OAuth2 integration for secure login
- **Responsive UI**: Optimized for desktop and mobile
- **User Profiles**: Manage listings and interactions

## Roadmap
- Implement Payment System (Stripe/PayPal)
- Add Contract Automation (DocuSign)
- Mobile App Version (React Native)
- Add email validation and confirmation mails


