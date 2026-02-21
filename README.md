
# Travel Itinerary Planner Frontend

A beautiful, responsive React.js frontend for planning travel itineraries. Create personalized day-by-day travel plans and view your travel history.

## Features

- **Home Page**: Create new itineraries with destination and duration
- **History Page**: View and revisit past itinerary requests
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: Graceful error messages and fallbacks
- **Local Caching**: Recent itineraries cached in localStorage
- **Export Ready**: PDF export functionality prepared
- **Modern UI**: Clean, gradient-based design with smooth animations

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Shadcn/UI** for components
- **Lucide React** for icons
- **Vite** for development and building

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-itinerary-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout with navigation
│   ├── ItineraryDisplay.tsx  # Itinerary cards display
│   └── ItineraryModal.tsx    # Modal for viewing itineraries
├── pages/               # Page components
│   ├── Home.tsx         # Home page with form
│   ├── History.tsx      # History page
│   └── NotFound.tsx     # 404 page
├── services/            # API services
│   └── api.ts           # API client and types
├── hooks/               # Custom hooks
└── lib/                 # Utility functions
```

## API Integration

The frontend expects a backend API with the following endpoints:

- `POST /api/itinerary/` - Create new itinerary
- `GET /api/history/` - Get itinerary history
- `GET /api/itinerary/:id` - Get specific itinerary

### Request/Response Types

```typescript
// Create itinerary request
{
  destination: string;
  numberOfDays: number;
}

// Itinerary response
{
  id: string;
  destination: string;
  numberOfDays: number;
  itinerary: DayItinerary[];
  createdAt: string;
}

// Day itinerary structure
{
  day: number;
  activities: Activity[];
}

// Activity structure
{
  time: string;
  activity: string;
  description: string;
  location?: string;
}
```

## Features in Detail

### Home Page
- Clean form with destination input and day selection
- Form validation with error messages
- Loading state during API calls
- Beautiful itinerary display with day-by-day breakdown
- Export button (ready for PDF implementation)

### History Page
- Grid layout of past itineraries
- Click to view full itinerary in modal
- Fallback to cached data if API is unavailable
- Empty state with call-to-action

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
- Optimized typography scaling

### Error Handling
- Network error recovery
- Graceful degradation with cached data
- User-friendly error messages
- Toast notifications for feedback

## Customization

### Styling
The app uses Tailwind CSS with a custom design system. Key colors and gradients can be modified in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration

### API Configuration
Update the API base URL in your environment variables:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Adding Features
The codebase is structured for easy extension:
- Add new pages in `src/pages/`
- Create reusable components in `src/components/`
- Extend API service in `src/services/api.ts`

## Performance Optimizations

- React Query for efficient data fetching and caching
- localStorage for offline functionality
- Lazy loading ready structure
- Optimized bundle size with tree-shaking
- Responsive images and assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
