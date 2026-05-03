# Bloodbank

A blood donation web application that allows donors and hospitals to register, manage profiles, and search for blood availability.

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Templating**: EJS (server-side rendering)
- **Styling**: Tailwind CSS + custom CSS
- **Auth**: Passport.js (local, Facebook, Google strategies)
- **File Uploads**: Multer
- **Sessions**: express-session + connect-flash

## Project Structure

- `app.js` — Main entry point, server setup, middleware, routes
- `models/` — Mongoose schemas: `donor.js`, `hospital.js`, `hospDatabase.js`
- `routes/` — Express route handlers: auth, edit, search, hospital routes
- `views/` — EJS templates and static assets (CSS, JS, images)
- `public/` — Static files and `uploads/` for profile pictures
- `config/` — Passport strategies and OAuth credentials (`auth.js`, `passport.js`)
- `middleware/` — Auth guards (`index.js`)
- `count.js` — Utility to aggregate donor/blood type statistics on startup

## Configuration

- **Port**: 5000 (via `PORT` env var or default)
- **MongoDB URI**: Set via `MONGODB_URI` secret
- **Session Secret**: Set via `SESSION_SECRET` secret (currently hardcoded fallback)

## Running the App

```
node app.js
```

The workflow "Start application" handles this automatically.

## Deployment

Configured for autoscale deployment with `node app.js` as the run command.
