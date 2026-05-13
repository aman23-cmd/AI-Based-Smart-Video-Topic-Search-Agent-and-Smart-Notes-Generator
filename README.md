# 🧠 AI-Based Smart Video Topic Search Agent & Notes Generator

![Project Status](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Flask](https://img.shields.io/badge/Flask-3.1-black)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

An ultra-premium, full-stack web application designed to supercharge your learning from YouTube videos. This platform allows you to extract full transcripts from any YouTube video, perform AI-powered semantic searches to find exact topic timestamps, and automatically generate smart, contextual study notes using LLMs (OpenAI or local Ollama).

---

## ✨ Key Features

- 🎥 **YouTube Transcript Extraction:** Instantly fetch and segment full transcripts from any public YouTube video.
- 🔍 **Semantic Topic Search:** Uses `sentence-transformers` vector embeddings to find *contextual* matches (not just exact keywords).
- ⏱️ **Timestamp Navigation:** Search results are ranked by relevance and provide direct links to the exact moment in the video.
- 📝 **Smart Notes Generation:** Leverages LLMs to digest transcript segments and generate concise bullet-point study notes.
- 🔐 **Secure Authentication:** JWT-based stateless authentication with strict password hashing (Bcrypt).
- 🎨 **Glassmorphism UI:** A sleek, modern, dark-themed responsive dashboard built with Tailwind CSS and Framer Motion.

---

## 🏗️ Architecture Design

This application uses a decoupled frontend/backend architecture to ensure scalability and maintainability:

### **Frontend (Vite + React + Tailwind)**
Adheres strictly to the **MVP (Model-View-Presenter)** design pattern to separate business logic from UI rendering:
- **Models** (`src/models/`): Manage state data shapes (e.g., `UserModel`, `SearchModel`).
- **Presenters** (`src/presenters/`): Handle the business logic and API orchestration (e.g., `SearchPresenter`).
- **Views** (`src/components/`, `src/pages/`): Dumb UI components that rely entirely on the presenter for data (e.g., `TranscriptViewer`, `Dashboard`).
- **Services** (`src/services/`): Pure Axios HTTP request wrappers handling JWT interceptors.

### **Backend (Python + Flask + MySQL)**
Implements the robust **Service-Controller-Model** pattern leveraging Flask Application Factories:
- **Controllers** (`app/controllers/`): Route handlers that parse incoming JSON requests and return structured HTTP responses.
- **Services** (`app/services/`): The core engine room (e.g., `youtube_service.py`, `ai_service.py`, `transcript_service.py`).
- **Models** (`app/models/`): Data access layer executing native MySQL queries and managing CRUD operations.

---

## 🚀 Getting Started

Follow these instructions to get both the frontend and backend running locally on your machine.

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.8+ recommended)
- **MySQL Server** (Running locally on default port `3306`)
- *(Optional)* **OpenAI API Key** (Required for AI note generation, unless switching to a local `ollama` model)

### 1. Database Setup
Ensure your local MySQL server is running. You do **not** need to manually run the SQL scripts. The Flask backend is configured to auto-initialize the database (`ai_video_search`) and build all required tables on its very first run.

### 2. Backend Setup
Open a terminal and navigate to the `backend/` directory:

```bash
# 1. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Configure Environment Variables
# Open the backend/.env file and provide:
# DB_PASSWORD=<your_mysql_root_password> 
# OPENAI_API_KEY=<your_openai_api_key>

# 4. Start the Flask server
python run.py
```
*The backend will now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a **new** terminal window and navigate to the `frontend/` directory:

```bash
# 1. Install Node modules
npm install

# 2. Start the Vite development server
npm run dev
```
*The frontend will now be running on `http://localhost:5173`.*

---

## 🛠️ Tech Stack Deep Dive

**Frontend:**
- **React.js**: UI Library
- **Vite**: Ultra-fast build tool and dev server
- **Tailwind CSS v3**: Utility-first CSS framework (Custom Glassmorphism extensions)
- **Framer Motion**: Fluid, physics-based UI animations
- **Lucide React**: Clean, consistent icon set
- **Axios**: Promise-based HTTP client

**Backend:**
- **Python / Flask**: Lightweight WSGI web application framework
- **MySQL Connector**: Native Python database driver
- **Flask-JWT-Extended**: Secure route protection and token blacklisting
- **Sentence-Transformers**: HuggingFace library used to generate dense vector embeddings for semantic search.
- **YouTube Transcript API**: Scrapes auto-generated and manual captions directly from YouTube.
- **OpenAI / Ollama**: Dynamic dispatcher supporting both cloud LLMs (GPT-4/3.5) and local, privacy-first LLMs.

---

## 👨‍💻 Developer Notes

- **JWT Security**: The app uses stateless JWTs. When a user logs out, the token's JTI is added to a database-backed blacklist to ensure it cannot be reused.
- **Embedding Cache**: The semantic search relies on `all-MiniLM-L6-v2`. Upon the first search request, the backend will download this model (~90MB) from HuggingFace and cache it locally in your Python environment. Subsequent searches will be near-instantaneous.
- **Presenter Instantiation**: Presenters in React should always be wrapped in a `useRef` to prevent infinite re-render loops (e.g., `const presenter = useRef(new AuthPresenter(setState)).current;`).

---
*Built with ❤️ for advanced AI-driven video analysis.*
