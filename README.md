# Torah Client - Biblia Comunidad Menorah

A Progressive Web Application (PWA) for reading the Bible with offline capabilities, built with React and Bootstrap. This application provides access to biblical texts from both the Old and New Testaments, with features like offline storage, version control, and a modern responsive interface.

## 📱 Features

- **📖 Bible Reading**: Access to complete biblical texts with chapter and verse navigation
- **🔄 Offline Support**: Full offline functionality using IndexedDB for local storage
- **📱 Progressive Web App**: Installable on mobile devices and desktop
- **🌐 Online/Offline Sync**: Automatic synchronization when online
- **📚 Testament Navigation**: Easy switching between Old and New Testaments
- **🔍 Glossary & Dedication**: Additional content sections
- **📊 Version Control**: Automatic updates when new versions are available
- **🎨 Responsive Design**: Mobile-first design with Bootstrap

## 🛠️ Technology Stack

- **Frontend**: React 18.0.0
- **UI Framework**: Bootstrap 5.3.3, React Bootstrap 2.10.7
- **Routing**: React Router DOM 7.5.1
- **Icons**: React Bootstrap Icons 1.11.5
- **Notifications**: React Toastify 11.0.2
- **Database**: IndexedDB (via idb library)
- **PWA**: Service Worker with Workbox
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TorahCliente
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── BibliaComponent.jsx      # Main Bible interface
│   ├── LibroComponent.jsx       # Individual book reader
│   ├── LibrosGridComponent.jsx    # Books grid layout
│   ├── BottomMenuComponent.jsx   # Navigation menu
│   ├── DedicatoriaComponent.jsx  # Dedication page
│   └── GlosarioComponent.jsx     # Glossary page
├── hooks/               # Custom React hooks
│   ├── useDb.js                 # IndexedDB operations
│   ├── useAPILibro.js           # Bible API integration
│   ├── useAPIVersion.js         # Version control API
│   └── useHttpCodes.js          # HTTP status codes
├── App.js               # Main application component
├── App.css              # Application styles
└── service-worker.js    # PWA service worker
```

## 🔧 Key Components

### BibliaComponent
Main interface displaying the Bible with testament selection and book grid.

### LibroComponent
Individual book reader with chapter/verse navigation using accordion layout.

### useDb Hook
Manages IndexedDB operations for offline storage:
- `queryTorah()`: Retrieves stored Bible data
- `insertTorah()`: Stores Bible data locally
- `queryVersion()`: Gets current version
- `insertUltimaVersion()`: Updates version information

### API Integration
- **Bible API**: `https://bibliaapi.comunidadmenorah.com/api/Libro/get/torah`
- **Version API**: `https://bibliaapi.comunidadmenorah.com/api/VersionControlador/ultimaversion`

## 📱 PWA Features

- **Service Worker**: Caches resources for offline use
- **Manifest**: App installation support
- **Offline Storage**: IndexedDB for Bible content
- **Background Sync**: Automatic updates when online

## 🎨 Styling

The application uses a custom color scheme:
- **Primary Blue**: `#193F73` (rgb(25, 63, 115))
- **Accent Gold**: `#E0D3AF`
- **Responsive Design**: Mobile-first approach with Bootstrap grid

## 🔄 Data Flow

1. **Initial Load**: App checks for local data in IndexedDB
2. **Online Check**: If online, fetches latest version from API
3. **Version Comparison**: Compares local vs remote versions
4. **Data Sync**: Downloads new content if version is newer
5. **Offline Storage**: Stores content locally for offline access

## 📊 Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (irreversible)

## 🌐 API Endpoints

- **Bible Content**: `GET /api/Libro/get/torah`
- **Version Info**: `GET /api/VersionControlador/ultimaversion`

## 📱 Browser Support

- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Comunidad Menorah.

## 📞 Support

For support and questions, please contact the development team.

---

**Biblia Comunidad Menorah** - Bringing the Word of God to your devices with modern technology.
