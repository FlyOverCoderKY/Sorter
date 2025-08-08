# Sorter App.UI

A modern React application built with Vite, TypeScript, and Headless UI, part of the Sorter project.

## Features

- ⚡️ Fast development with Vite
- 🎯 TypeScript for type safety
- 🎨 Headless UI for accessible components
- 📱 Responsive design
- 🔧 ESLint configuration
- 🚀 Hot Module Replacement (HMR)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the App.UI directory:
```bash
cd Sorter/App.UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Headless UI Components

This project uses Headless UI for its component library. Here are some key features and guidelines:

### Theme Configuration

We use a custom theme system with CSS variables and Headless UI components. The theme is configured through CSS custom properties:

```tsx
<div data-theme="dark" data-accent="violet">
  {/* Your components */}
</div>
```

### Component Usage

1. **Buttons**
```tsx
// Custom button component with Headless UI styling
<button className="btn btn-solid">Click me</button>
<button className="btn btn-soft">Click me</button>
```

2. **Layout Components**
```tsx
// Semantic HTML with utility classes
<div className="container">
  <div className="card">
    <div className="flex flex-col gap-3">
      {/* Content */}
    </div>
  </div>
</div>
```

3. **Typography**
```tsx
// Semantic HTML with utility classes
<h1 className="text-2xl font-bold">Heading</h1>
<p className="text-sm text-gray-500">Subtitle</p>
```

### Styling Guidelines

1. **Theme Integration**
- Use CSS custom properties for consistency
- Override theme variables in CSS when needed
- Use the provided color scales

2. **Custom Styling**
```css
/* Example of custom component styling */
.btn {
  transition: transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
```

3. **Responsive Design**
- Use CSS Grid and Flexbox for responsive layouts
- Add custom breakpoints when needed
- Follow mobile-first approach

### Best Practices

1. **Accessibility**
- Utilize Headless UI's built-in accessibility features
- Maintain proper heading hierarchy
- Ensure sufficient color contrast
- Test with screen readers

2. **Performance**
- Import only needed components
- Use proper component composition
- Implement proper error boundaries

3. **Component Organization**
- Group related components
- Keep components small and focused
- Use proper TypeScript types

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
App.UI/
├── src/
│   ├── components/        # React components
│   ├── App.tsx           # Main application component
│   ├── App.css           # Component styles
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Contributing

1. Follow the Headless UI component patterns
2. Maintain accessibility standards
3. Test components thoroughly
4. Update documentation as needed

## License

This project is open source and available under the [MIT License](LICENSE).