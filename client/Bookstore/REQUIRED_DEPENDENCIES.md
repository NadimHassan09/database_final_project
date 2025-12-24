# Required Dependencies

This frontend application requires the following npm packages to be installed:

## Core Dependencies

```bash
npm install axios react-router-dom
```

### Package Details

- **axios**: HTTP client for API calls (used in services)
- **react-router-dom**: Client-side routing (used for navigation and protected routes)

## Installation

Run the following command in the `client/Bookstore` directory:

```bash
cd client/Bookstore
npm install axios react-router-dom
```

## Optional Dependencies

The following are already included in package.json:
- **react**: ^19.2.0
- **react-dom**: ^19.2.0
- **react-bootstrap**: ^2.10.10
- **bootstrap**: ^5.3.8

## Environment Variables

Create a `.env` file in the `client/Bookstore` directory with:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

This is optional - the app will default to `http://localhost:5000/api` if not set.

