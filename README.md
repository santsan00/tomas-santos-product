# Tomas Santos - Portfolio Website

A modern, responsive portfolio website built with Figma integration and Vibe Code automation.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Figma account with API access
- Figma Personal Access Token

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/santsan00/tomas-santos-product.git
   cd tomas-santos-product
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your Figma token and file ID
   nano .env  # or use your preferred editor
   ```

   Your `.env` file should look like:
   ```
   FIGMA_API_TOKEN=your_personal_access_token_here
   FIGMA_FILE_ID=6ByJL76V2sXnwg2K1beBBD
   ```

4. **Sync from Figma:**
   ```bash
   npm run sync:all
   ```
   This will:
   - Extract design tokens (colors, typography, spacing)
   - Download assets (images, SVGs)
   - Generate component stubs

5. **Start the development server:**
   ```bash
   npm start
   ```
   
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
tomas-santos-product/
├── public/                  # Static files (HTML, CSS, JS, assets)
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   └── main.js          # Main JavaScript
│   └── assets/              # Images and SVGs from Figma
├── src/
│   ├── components/          # React/Vue components (auto-generated)
│   │   └── figma/           # Figma-generated components
│   ├── styles/              # Design tokens and CSS
│   │   └── design-tokens.css # Auto-generated from Figma
│   └── utils/
│       └── figma/           # Figma API utilities
│           ├── figma-client.js
│           ├── extract-design-tokens.js
│           ├── extract-assets.js
│           └── extract-components.js
├── scripts/                 # Automation scripts
│   └── sync-figma.js        # Main sync script
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Node.js dependencies
└── README.md
```

## 🎨 Figma Integration

### Getting Your Figma API Token

1. Go to [Figma Account Settings](https://www.figma.com/developers/api#access-tokens)
2. Scroll down to "Personal Access Tokens"
3. Click "Create new personal access token"
4. Copy the token and add it to your `.env` file

### Finding Your File ID

Your Figma file URL looks like:
```
https://www.figma.com/file/6ByJL76V2sXnwg2K1beBBD/Website
```

The file ID is: `6ByJL76V2sXnwg2K1beBBD`

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run the main sync script |
| `npm run sync:design-tokens` | Extract colors, typography, and spacing |
| `npm run sync:assets` | Download images and SVGs |
| `npm run sync:components` | Generate HTML stubs for Figma components |
| `npm run sync:all` | Run all sync operations |
| `npm start` | Start the development server |

## 🎯 Features

### Design Tokens
- **Colors**: Auto-extracted from Figma color styles
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners scale
- **Shadows**: Predefined shadow styles
- **Transitions**: Smooth animation durations

### Components
- Auto-generated HTML components from Figma frames
- Responsive design patterns
- Accessibility best practices

### Assets
- Automatic image and SVG extraction
- Optimized for web delivery
- Organized in the `public/assets/` directory

## 🛠 Customization

### Adding New Pages
1. Create a new HTML file in `public/`
2. Link it in the navigation (`public/index.html`)
3. Add corresponding CSS in `public/css/main.css`

### Modifying Styles
- Edit `public/css/main.css` for global styles
- Edit `src/styles/design-tokens.css` for design tokens (auto-generated)
- Run `npm run sync:design-tokens` to update tokens from Figma

### Adding New Components
1. Create components in Figma
2. Name them with a "Component" suffix (e.g., "Button Component")
3. Run `npm run sync:all` to generate HTML stubs
4. Customize the generated files in `src/components/figma/`

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints at:
- **768px**: Tablet view
- **480px**: Mobile view

### Mobile Features
- Hamburger menu for navigation
- Touch-friendly buttons
- Optimized layouts for small screens

## 🎭 Theming

To change the color scheme:
1. Update colors in your Figma file
2. Run `npm run sync:design-tokens`
3. The CSS variables in `design-tokens.css` will be updated

### Default Color Variables
```css
:root {
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  --color-text: #333333;
  --color-text-muted: #64748b;
  --color-heading: #1a1a1a;
  --color-background: #ffffff;
  --color-card-bg: #ffffff;
  --color-border: #e2e8f0;
  /* ... more colors from Figma */
}
```

## 🚀 Deployment

### Netlify
1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/) and sign in
3. Click "New site from Git"
4. Select your repository
5. Set build command to `npm run sync:all` (optional)
6. Set publish directory to `public`
7. Deploy!

### Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set the output directory to `public`

### GitHub Pages
1. Run: `npm run sync:all`
2. Push all changes to GitHub
3. Go to repository settings → Pages
4. Select `main` branch and `/public` folder
5. Save

## 🔒 Security

**⚠️ IMPORTANT: Never commit your Figma token!**

The `.gitignore` file is configured to exclude:
- `.env` files
- `.env.local` files
- Any file containing `figma-token`

Always keep your API tokens secret!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run sync:all` to update from Figma
5. Commit your changes
6. Push to your fork
7. Open a pull request

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 🙏 Credits

- Built with [Vibe Code](https://vibecode.com)
- Design tokens from [Figma API](https://www.figma.com/developers/api)
- Icons from various sources

## 📞 Support

For issues or questions:
1. Check the [Figma API Documentation](https://www.figma.com/developers/api)
2. Open an issue in this repository
3. Contact the maintainer

---

**Happy coding! 🎨✨**
