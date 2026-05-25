# Amsterdam Home Exchange Portfolio

A sophisticated, multi-page website for presenting an Amsterdam apartment for home exchange opportunities.

## Design Philosophy

Elegant European editorial style with warm, refined aesthetics inspired by Amsterdam attic living: white beams, dark parquet, warm wood, soft stone, and muted accents.

## Features

✨ **Elegant Design**
- Sophisticated typography: Playfair Display + Inter
- Warm neutral color palette with muted accents
- Generous spacing and refined layout
- European editorial aesthetic

📸 **Dynamic Gallery**
- Automatic photo detection from `/photos` folder
- Lightbox viewer with keyboard navigation
- Works with any number of photos
- Responsive image grid

📑 **Multi-Page Structure**
- Home page with hero, intro, and highlights
- Gallery page with full photo showcase
- Neighborhood information
- Exchange preferences
- Contact page

🎯 **Homepage Highlights**
- Full-height hero section with main photo
- Asymmetrical photo grid on intro section
- "At a Glance" highlights with icons
- Clear call-to-action

🔒 **Privacy-Focused**
- No exact address displayed
- No external tracking
- Clean, static HTML

## Customization Guide

### Custom Domain

To use a custom domain instead of `github.io`:

1. **Buy a domain** from a registrar (Namecheap, GoDaddy, etc.)
2. **Go to your repo Settings → Pages**
3. **Add your custom domain** in the "Custom domain" field
4. **Create a CNAME file** in your repo root with your domain name
5. **Update DNS records** at your registrar:
   - Add an `A` record pointing to GitHub's servers: `185.199.108.153`
   - Add a `CNAME` record: `www` → `your-domain.com`
6. **Wait 24 hours** for DNS to propagate

### Edit Content

Edit these files in your repo:
- `index.html` - Homepage content
- `gallery.html` - Gallery page
- `neighborhood.html` - Neighborhood info
- `exchange.html` - Exchange preferences
- `contact.html` - Contact page

Look for `<!-- EDIT -->` comments to find sections to customize.

### Add Photos

1. Upload photos to the `/photos` folder
2. Gallery auto-detects and displays all images
3. Supports: jpg, jpeg, png, gif, webp

### Customize Colors

Edit `style.css` and modify the CSS variables:
```css
:root {
  --bg-primary: #f5f3f0;  /* Main background */
  --text-primary: #2a2622; /* Main text */
  --accent-primary: #a89066; /* Main accent */
  /* etc... */
}
```

## Pages

- **index.html** - Home page with hero, intro, and highlights
- **gallery.html** - Full photo gallery with lightbox
- **neighborhood.html** - Neighborhood information
- **exchange.html** - Exchange preferences
- **contact.html** - Contact information

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Technical Details

- Pure HTML, CSS, JavaScript (no frameworks)
- Responsive design (mobile-first)
- Semantic HTML for accessibility
- CSS variables for easy customization
- Dark mode support
