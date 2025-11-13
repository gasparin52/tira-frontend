# Tira Frontend

**Tira** is a task and team management web application. This is the frontend of the application, built entirely in **JavaScript** with React.

---

## Technologies

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Styled Components** - CSS-in-JS styling
- **Fetch API** - HTTP calls to backend (no Axios)

---

## Features

- **User management** - Login, register, profile editing
- **Team management** - Create teams, add/remove members
- **Task management** - Full CRUD for tasks
- **Kanban view** - Visual task board
- **Comment system** - Task comments
- **Responsive design** - Adaptive interface with styled-components

---

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── buttons/        # Custom buttons
│   ├── cards/          # Cards (Task, Team, Audit, etc.)
│   ├── modals/         # Modals (EditTask, EditUser, TaskDetail, etc.)
│   ├── Baselayout.jsx  # Main layout
│   ├── Header.jsx      # Header
│   ├── Footer.jsx      # Footer
│   └── SideBar.jsx     # Side menu
├── views/              # Main pages/views
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Teams.jsx
│   ├── Users.jsx
│   ├── Tasks.jsx
│   ├── Comments.jsx
│   └── Kanban.jsx
├── routes/             # Route configuration
├── utils/              # Utilities
│   └── api.js          # HTTP calls helper (fetch wrapper)
├── App.jsx             # Main component
└── main.jsx            # Entry point
```

---

## Requirements

- **Node.js** >= 18
- **npm** or **yarn**
- Tira backend running (see `tira-backend/README.md`)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gasparin52/tira-frontend.git
cd tira-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:  
Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:3000
```

---

## Available Commands

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Preview production build
npm run preview
```

Development server runs by default on `http://localhost:5173`

---

## Backend Connection

The frontend communicates with the backend through a REST API. The base URL is configured in the `VITE_API_URL` environment variable.

All HTTP requests are managed through the `callAPI()` wrapper function located in `src/utils/api.js`, which uses the browser's **native Fetch API**.

Available methods:
- `GET(url)` - Fetch resources
- `POST(url, data)` - Create resources
- `PATCH(url, data)` - Update resources
- `DELETE(url)` - Delete resources

---

## Important Notes

⚠️ **The frontend is completely written in JavaScript (.jsx)**  
Despite having a `tsconfig.json` in the project, **TypeScript is NOT being used**. All files are `.jsx` and `.js`.

---

## Possible Improvements

### High Priority
- 🔄 **Migrate all code from JavaScript to TypeScript**
  - Rename `.jsx` files to `.tsx` and `.js` to `.ts`
  - Add types to components, props, and functions
  - Properly configure `tsconfig.json` for React
  - Add types for API responses

### Other Improvements
- Implement authentication with JWT and localStorage/sessionStorage
- Add loading states and skeletons
- Implement more robust error handling
- Add unit tests (Jest/Vitest + React Testing Library)
- Implement lazy loading for routes
- Add internationalization (i18n)
- Optimize bundle size

---

## License

This project is part of an academic/personal development.
