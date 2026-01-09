# Shopping List PWA

A Progressive Web Application for managing shopping lists with offline capability and file-based storage.

## Features

- **Offline-First**: Works completely offline once installed as a PWA
- **File-Based Storage**: Your data is stored in a YAML file you control
- **Cloud Sync Ready**: Place your file in Google Drive, Dropbox, or any cloud-synced folder
- **Dual-Category System**:
  - Home categories for organizing items at home (e.g., Fridge, Cupboard)
  - Shop-specific categories for each store (e.g., Dairy, Meat)
- **Smart Shopping**: See only selected items available at each shop
- **Auto-Save**: Changes automatically save after 2 seconds
- **Mobile-First**: Optimized for mobile devices with touch-friendly interface

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A modern browser with File System Access API support:
  - Chrome/Edge (recommended)
  - Safari 15.2+ on iOS/macOS

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Usage

### First Time Setup

1. Open the app in your browser
2. Click "Create New File" to create a shopping list YAML file
3. Choose a location for your file (optionally in a cloud-synced folder)
4. Add items using the + button on the Home List view
5. Add shops using the + button on the Shops view
6. Go to Settings to configure item-shop mappings

### Managing Items and Shops

**Home List (Main View)**
- Click the **+ button** (bottom-right) to add new items
- Click the **edit icon** next to any item to edit or delete it
- Items include: name, home category, and optional notes
- New items are automatically selected

**Shops View**
- Click the **+ button** (bottom-right) to add new shops
- Click the **edit icon** on any shop card to edit or delete it
- Shops display how many items you need from each location

**Settings > Item-Shop Mapping**
- Select an item
- Add which shops carry that item
- Assign shop-specific categories (e.g., "Dairy" at Sainsburys)

**Reordering Categories**
- Use the **up/down arrow buttons** in category headers to reorder them
- Works in both Home List and Shop views
- Custom order is automatically saved to your YAML file

### At Home

**Home List View**
- See all items organized by home categories
- Check items you need to purchase
- New items are automatically selected

### Shopping

**Shops View**
- Choose which shop you're visiting
- See only the items you selected that are available at that shop
- Items are organized by shop-specific categories
- Uncheck items as you add them to your basket
- Unchecking in shop view also removes selection from home view

### Settings

The Settings page has two tabs:

1. **Item-Shop Mapping** - Configure which items are available at which shops and their categories
2. **File Location** - Manage your YAML file (view, open, create, save)

## File Format

The shopping list is stored in human-readable YAML format:

```yaml
items:
  - id: butter
    name: Butter
    homeCategory: Fridge
    notes: Unsalted preferred
    shopAvailability:
      - shopId: sainsburys
        shopCategory: Dairy

shops:
  - id: sainsburys
    name: Sainsburys
    categoryOrder:
      - name: Dairy
        order: 1
      - name: Meat
        order: 2

homeCategoryOrder:
  - name: Fridge
    order: 1
  - name: Cupboard 1
    order: 2

selection:
  selectedItemIds:
    - butter
```

You can edit this file manually if needed!

## Testing with Sample Data

A `test-data.yaml` file is included with sample items and shops. Use "Open File" in the app to load it.

## Development

### Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # AppBar, AppDrawer, Layout
│   ├── home/        # Home list view
│   ├── shop/        # Shop views
│   ├── settings/    # Settings tabs
│   └── common/      # Shared components
├── hooks/           # Custom React hooks
├── services/        # File system and YAML services
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

### Tech Stack

- **React 18** with TypeScript
- **Material UI** for components
- **Zustand** for state management
- **Vite** for build tooling
- **React Router** for navigation
- **js-yaml** for YAML parsing
- **File System Access API** for file operations
- **vite-plugin-pwa** for PWA functionality

## Browser Compatibility

### File System Access API

The app requires the File System Access API, which is supported in:

- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Safari 15.2+ (iOS and macOS)
- ❌ Firefox (not yet supported)

### Fallback

If the File System Access API is not available, the app will display a warning message.

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment:

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Access at `https://[username].github.io/shopping-list/`

### Manual Deployment

```bash
npm run deploy
```

This builds the app and pushes to the `gh-pages` branch.

## PWA Installation

### On Mobile

1. Open the app in your browser
2. Look for "Add to Home Screen" prompt or browser menu option
3. Confirm installation
4. App icon will appear on your home screen

### On Desktop

1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install
4. App will open in its own window

## Cloud Synchronization

To sync your shopping list across devices:

1. Create your shopping list file in a cloud-synced folder:
   - Google Drive
   - Dropbox
   - iCloud Drive
   - OneDrive
2. On each device, use "Open File" to select the same file
3. Changes made on any device will sync through your cloud provider

**Note**: The app doesn't sync directly - it relies on your cloud provider to sync the file.

## Troubleshooting

### Permission Denied

If you get "Permission denied" errors:
- The browser requires you to re-grant file permissions when you reload the app
- Click "Open File" again and select your file
- Grant both read and write permissions

### File Not Saving

- Check that auto-save is enabled (status indicator in top-right)
- Try manually saving via Settings > File Location > Save Now
- Verify you have write permissions to the file location

### Items Not Appearing in Shop View

- Make sure items are selected in the Home List view
- Verify the item is mapped to that shop in Settings > Item-Shop Mapping
- Check that the item has a shop category assigned for that shop

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
