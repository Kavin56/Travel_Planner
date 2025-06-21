# ✈️ AI Travel Quest Builder

An intelligent travel planning application powered by Google's Gemini AI. This tool allows users to generate detailed, day-by-day travel itineraries, get support from an AI-powered chatbot, and even interact with a voice-controlled travel assistant.

![Travel Quest Builder Demo](./public/demo.gif)
*(Note: Add a `demo.gif` to the `/public` directory to see it here.)*

---

## ✨ Key Features

- **🤖 AI-Powered Itinerary Generation**: Automatically create comprehensive travel plans using Google's Gemini AI.
- **🗣️ Conversational AI Voice Agent**: Talk to an AI assistant in a natural, human-like voice to plan your trip. The agent can understand commands and take action.
- **💬 AI Support Chatbot**: Get instant help and travel advice from a friendly, markdown-enabled chatbot.
- **🎤 Voice-Controlled Forms**: Fill out the destination and duration fields simply by speaking.
- **🔐 User Authentication**: Secure sign-up and login functionality using Firebase.
- **📜 Trip History**: Automatically saves your generated itineraries for future reference.
- **📄 Multiple Export Formats**: Export your travel plans as beautifully formatted PDF, HTML, or simple Text files.
- **🗺️ Interactive Map Links**: All locations in the itinerary and exports are clickable and open directly in Google Maps.
- **😎 Modern & Responsive UI**: Built with React, TypeScript, and styled with Tailwind CSS and shadcn/ui.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or any other package manager
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/travel-quest-builder.git
    cd travel-quest-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    You can get a key from [Google AI Studio](https://makersuite.google.com/app/apikey).

4.  **Set up Firebase:**
    This project uses Firebase for user authentication. You will need to:
    - Create a project on the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Google Authentication** in the "Authentication > Sign-in method" tab.
    - Get your Firebase configuration object and replace the placeholder in `src/config/firebase.ts`.

---

## Usage

To run the application in development mode:

```bash
npm run dev
```

This will start the development server, and you can view the application at `http://localhost:5173`.

### Other Scripts

-   **Build for production:**
    ```bash
    npm run build
    ```
-   **Lint the code:**
    ```bash
    npm run lint
    ```
-   **Preview the production build:**
    ```bash
    npm run preview
    ```

---

## 🛠️ Technology Stack

-   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **AI**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
-   **UI Framework**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
-   **Voice Interaction**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
-   **Routing**: [React Router](https://reactrouter.com/)

---

## 📂 Project Structure

The project follows a standard component-based structure.

```
/
├── public/              # Static assets and demo gif
├── src/
│   ├── components/      # Reusable UI components (including shadcn/ui)
│   ├── config/          # Firebase configuration
│   ├── contexts/        # React contexts (e.g., AuthContext)
│   ├── hooks/           # Custom React hooks (e.g., useVoiceForm)
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components for routing
│   ├── services/        # Business logic & API services (Gemini, Voice, etc.)
│   └── main.tsx         # Main application entry point
├── .env                 # Environment variables (needs to be created)
├── package.json         # Project dependencies and scripts
└── README.md            # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5.  Push to the branch (`git push origin feature/AmazingFeature`).
6.  Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (if one exists).
