# A Whatsapp Web clone with Mockapi's
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Dan5py/react-vite-ui/blob/main/LICENSE)

Implemented a low level frontend design of whatsapp web clone using zustand, with the ability to manage to states for unread messages, read messages, bookmarking messages. 
## 🎉 Features

**Real-time chat functionality**
**Responsive design for mobile and desktop**
**Dark mode support**
**Message bookmarking**
**Unread message indicators**
**Chat pinning**
**TypeScript for type safety**
**Fast development with Vite**

## Frontend System Design
![image](https://github.com/user-attachments/assets/fd546add-609e-4d71-a10a-38d309ded105)


### Components

1. **App Component**
   - Manages state for `activeTab` and `isMobileMenuOpen`.
   - Renders `ChatList`, `ChatWindow`, and `BookmarksTab` based on `activeTab` selection.

2. **ChatList Component**
   - Uses `useChatStore` for state management and actions.
   - Fetches and displays chats from `ChatStore`.
   - Handles chat selection, pinning, and marking as unread.

3. **ChatWindow Component**
   - Utilizes `useChatStore` for state management and actions.
   - Displays messages for the selected chat from `ChatStore`.
   - Handles sending messages and bookmarking actions.

4. **BookmarksTab Component**
   - Displays bookmarked messages fetched from `ChatStore` using `useChatStore`.

5. **ChatStore (Zustand store)**
   - Centralized state management for chat and message data.
   - Provides actions and updates for chats and messages.
   - Triggers re-renders in connected components upon state changes.

6. **API Service**
   - Simulates API calls for fetching chats and messages.
   - Integrates with `ChatStore` to update data upon API responses.

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 16 or above)
- pnpm (package manager)

## 🚀 Getting Started

Follow these steps to get started with the react-vite-ui template:

1. Clone the repository:

   ```bash
   git clone https://github.com/dan5py/react-vite-ui.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-vite-ui
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

## 📜 Available Scripts

- pnpm dev - Starts the development server.
- pnpm build - Builds the production-ready code.
- pnpm lint - Runs ESLint to analyze and lint the code.
- pnpm preview - Starts the Vite development server in preview mode.

## 📂 Project Structure

The project structure follows a standard React application layout:

```python
  react-vite-ui/
  ├── src/
  │   ├── components/
  │   │   ├── ui/
  │   │   ├── BookmarksTab.tsx
  │   │   ├── ChatList.tsx
  │   │   └── ChatWindow.tsx
  │   ├── store/
  │   │   └── chatStore.tsx
  │   ├── styles/
  │   │   └── globals.css
  │   ├── types/
  │   │   └── chat.tsx
  │   ├── lib/
  │   │   └── utils.ts
  │   ├── services/
  │   │   └── api.ts
  │   ├── App.tsx
  │   └── main.tsx
  ├── public/
  ├── index.html
  ├── tailwind.config.js
  ├── vite.config.ts
  └── package.json
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
