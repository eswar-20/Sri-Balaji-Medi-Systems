# MediEquip Marketplace

A professional e-commerce platform for medical equipment sales, built with React.js and modern web technologies.

## Features

- **Modern UI/UX**: Dark theme with neutral colors and gold accents
- **Product Catalog**: Browse medical equipment with filters and search
- **Shopping Cart**: Add to cart with quantity management
- **Checkout**: Secure checkout with form validation
- **Order Management**: Order confirmation and tracking
- **Responsive Design**: Mobile-first responsive layout
- **State Management**: React Context API for cart management
- **LocalStorage**: Persistent cart data
- **API Ready**: Axios service layer for backend integration

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS with custom dark theme
- **Build Tool**: Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Loader.jsx
│   │   └── EmptyState.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductListingPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── OrderSuccessPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## Available Scripts

- `npm start` - Run the app in development mode
- `npm test` - Launch the test runner
- `npm run build` - Build the app for production
- `npm run eject` - Eject from Create React App (one-way operation)

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Tailwind CSS Configuration

The project uses a custom color scheme with:
- Primary colors: Charcoal, Matte Black, Beige, Ivory
- Accent color: Muted Gold
- Gray scale: Dark Gray, Medium Gray, Light Gray

## API Integration

The application includes a complete API service layer (`src/services/api.js`) with:

- Product endpoints
- Order management
- User authentication
- Review system
- Error handling

Simply update the `REACT_APP_API_URL` environment variable to connect to your backend.

## Features Overview

### Home Page
- Hero section with company branding
- Product categories grid
- Featured products showcase
- Call-to-action sections

### Product Pages
- Product listing with filters (category, price, sort)
- Detailed product view with images and specifications
- Add to cart functionality
- Stock status and ratings

### Shopping Experience
- Persistent shopping cart
- Quantity management
- Order summary with shipping and tax calculation
- Secure checkout with form validation

### Order Management
- Order confirmation page
- Order details and tracking information
- Print receipt functionality

## Design System

### Color Palette
- **Matte Black** (#0d0d0d) - Primary background
- **Charcoal** (#1a1a1a) - Secondary background
- **Beige** (#f5f5dc) - Primary text
- **Ivory** (#fffff0) - Secondary text
- **Muted Gold** (#d4af37) - Accent and CTAs

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

### Components
- Reusable UI components with consistent styling
- Hover effects and micro-interactions
- Loading states and empty states
- Form validation with error messages

## Deployment

The application is ready for deployment to any static hosting service:

- Netlify
- Vercel
- AWS S3
- GitHub Pages

Simply run `npm run build` and deploy the contents of the `build` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
