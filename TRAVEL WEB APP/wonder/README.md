# Travel Trace - Trail Tracking Application

A web application for tracking and sharing hiking trails, built with React, Express, and MySQL.

## Features

- User authentication
- Create and view trails
- Upload trail photos and videos
- Interactive map integration
- Trail categorization
- User profiles

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd wonder
```

2. Install dependencies:
```bash
npm install
```

3. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE wonder_map;
```

4. Import the database schema:
```bash
mysql -u root -p wonder_map < wonder_map.sql
```

5. Configure database connection:
Edit `src/config/db.js` and update the MySQL connection details:
```javascript
{
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'wonder_map'
}
```

6. Create required directories:
```bash
mkdir -p public/images public/videos
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. Start the backend server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The application will be served at http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=wonder_map
```

## File Upload Limits

- Images: jpg, jpeg, png, gif (max 10MB)
- Videos: mp4, MPEG-4, mkv (max 10MB)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
