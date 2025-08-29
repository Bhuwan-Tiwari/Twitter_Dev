## Twitter Frontend (React + Vite + MUI)

### Prerequisites
- Backend running at `http://localhost:3000` (CORS enabled)
- Node 18+

### Install
```bash
cd frontend
npm install
```

### Run
```bash
npm run dev
```
Open `http://localhost:5173` in the browser.

### Environment
No `.env` required. API base is `http://localhost:3000/api/v1` (see `src/lib/api.js`).

### Features
- Auth: signup, login (JWT stored in `localStorage`)
- Create tweet with optional image upload to S3
- Toggle likes, create comments
- Protected routes using a simple `PrivateRoute`

### Project Structure
- `src/context/AuthContext.jsx`: auth state and actions
- `src/lib/api.js`: axios instance with auth header
- `src/pages/*`: UI pages
- `src/components/PrivateRoute.jsx`: simple route guard

