# StudyFuel - Shopify Meal Planning Platform

##  Project Overview

StudyFuel is a comprehensive meal planning platform built on Shopify, specifically designed for college students. The platform helps students make healthier food choices by providing personalized meal recommendations through an interactive quiz system and offering flexible subscription tiers that fit student budgets and lifestyles.

### Key Features
- **Interactive Quiz System**: Personalized meal plan recommendations based on student needs
- **Four Subscription Tiers**: Free, Basic ($5/month), Premium ($12/month), Elite ($20/month)
- **Mobile-Responsive Design**: Optimized for smartphone and desktop access
- **Customer Account Pages**: Personalized dashboards for subscribers
- **Search Functionality**: Real-time autocomplete for finding meals and recipes
- **Brand-Consistent Design**: Professional color scheme and typography throughout

---

##  Architecture Overview

### Platform
- **E-commerce Platform**: Shopify
- **Theme Base**: Dawn (Shopify's default theme)
- **Templating Language**: Liquid
- **Version Control**: Git/GitHub
- **Deployment**: Shopify CLI

### File Structure
```
studyfuel-theme/
├── assets/                    # CSS, JavaScript, images
│   ├── global.css            # Main stylesheet with brand colors
│   ├── quiz.js               # Interactive quiz functionality
│   ├── search.js             # Search autocomplete functionality
│   └── wishlist.js           # Wishlist feature using localStorage
│
├── config/
│   ├── settings_schema.json  # Theme customization options
│   └── settings_data.json    # Current theme settings
│
├── layout/
│   ├── theme.liquid          # Main layout template
│   └── password.liquid       # Password-protected store layout
│
├── sections/                  # Reusable page sections
│   ├── header.liquid         # Site header with navigation
│   ├── footer.liquid         # Site footer
│   ├── hero-banner.liquid    # Homepage hero section
│   ├── quiz-section.liquid   # Quiz interface section
│   └── product-grid.liquid   # Product display grid
│
├── snippets/                  # Smaller reusable components
│   ├── icon-search.liquid    # Search icon SVG
│   ├── product-card.liquid   # Individual product cards
│   └── breadcrumbs.liquid    # Navigation breadcrumbs
│
├── templates/                 # Page templates
│   ├── index.json            # Homepage template
│   ├── page.quiz.json        # Quiz page template
│   ├── product.json          # Product page template
│   ├── collection.json       # Collection page template
│   └── customers/            # Customer account templates
│       ├── account.liquid    # Account dashboard
│       └── login.liquid      # Login page
│
└── locales/
    └── en.default.json       # English translations
```

---

##  Brand Identity

### Color Scheme
```css
/* Primary Brand Color */
--color-primary: #1d4035;        /* Forest Teal - Health, trust, growth */

/* Secondary Accent Color */
--color-secondary: #b85a1f;      /* Burnt Sienna - Warmth, energy */

/* Background Colors */
--color-background: #fefdfb;     /* Warm White - Clean, inviting */
--color-background-alt: #f7f5f0; /* Cream - Soft alternative */

/* Text Colors */
--color-text-dark: #2c3e50;      /* Primary text */
--color-text-light: #ffffff;     /* Light text on dark backgrounds */
```

### Typography
- **Font Family**: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
- **Headings**: Bold weights (600-700) for hierarchy
- **Body Text**: Regular weight (400) for readability
- **Line Height**: 1.6 for body text, 1.2-1.4 for headings

---

##  Core Features Explained

### 1. Interactive Quiz System

**Purpose**: Assess student needs and recommend appropriate meal plan tiers

**How It Works**:
```
User Journey:
1. Student clicks "Take Quiz" button
2. Answers 5-7 questions about:
   - Available cooking time per week
   - Budget constraints
   - Cooking equipment/kitchen setup
   - Dietary restrictions/preferences
   - Health and fitness goals
3. JavaScript calculates score based on responses
4. Algorithm recommends appropriate subscription tier
5. User redirected to recommended product page
```

**Technical Implementation**:
- **Template**: `page.quiz.json` (assigned to /pages/quiz)
- **JavaScript**: `assets/quiz.js` handles form logic and scoring
- **Styling**: Gradient backgrounds, progress indicators
- **Data Storage**: Responses temporarily stored in sessionStorage
- **Recommendation Logic**: Point-based system assigning values to each answer

**Key Code Flow**:
```javascript
// 1. Question display with progress tracking
// 2. User selects answer → Score accumulates
// 3. All questions answered → Calculate total score
// 4. Score ranges map to subscription tiers:
//    - 0-25 points: Free tier
//    - 26-50 points: Basic tier
//    - 51-75 points: Premium tier
//    - 76-100 points: Elite tier
// 5. Redirect to appropriate product page
```

### 2. Subscription Product Management

**Four Subscription Tiers**:

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/month | Basic meal ideas, weekly tips |
| **Basic** | $5/month | 10 meal plans/month, shopping lists |
| **Premium** | $12/month | 30 meal plans/month, nutrition tracking, recipe videos |
| **Elite** | $20/month | Unlimited meals, 1-on-1 nutrition coaching, custom plans |

**Product Setup**:
- Each tier is a separate Shopify product
- Recurring payment enabled through Shopify subscriptions
- Product variants for different commitment periods (monthly, quarterly, annual)
- Clear feature comparison on product pages

### 3. Navigation System

**Structure**:
```
Homepage
├── Products (All Meal Plans)
│   ├── Free Tier
│   ├── Basic Tier
│   ├── Premium Tier
│   └── Elite Tier
├── Quiz (Interactive Assessment)
├── About (Company Information)
├── Contact (Customer Support)
└── Account (Customer Dashboard)
    ├── Order History
    ├── Subscription Management
    └── Profile Settings
```

**Mobile Responsiveness**:
- Desktop: Full horizontal navigation bar
- Tablet/Mobile: Hamburger menu that expands to drawer
- Touch-optimized button sizes (minimum 44x44px)
- Swipe gestures for mobile menu

**Technical Implementation**:
- **Template**: `sections/header.liquid`
- **JavaScript**: Toggle functionality for mobile menu
- **CSS**: Media queries at 768px breakpoint
- **Accessibility**: ARIA labels, keyboard navigation support

### 4. Search Functionality

**Features**:
- Real-time autocomplete suggestions
- Searches products, collections, and pages
- Highlights matching text in results
- Keyboard navigation (arrow keys, enter)

**How It Works**:
```
User types in search box
    ↓
JavaScript debounces input (300ms delay)
    ↓
Shopify Predictive Search API called
    ↓
Results returned (products, collections, pages)
    ↓
Dropdown populated with formatted results
    ↓
User selects result → Navigate to page
```

**Technical Details**:
- **API**: Shopify Predictive Search API (`/search/suggest.json`)
- **JavaScript**: `assets/search.js` handles debouncing and display
- **Performance**: Limits to 10 results, caches recent searches
- **Styling**: Dropdown positioned absolutely below search input

### 5. Customer Account System

**Features Available**:
- View subscription details and status
- Manage payment methods
- Update delivery preferences
- View order history
- Download invoices
- Modify account information

**Page Structure**:
```
/account                    # Account dashboard (overview)
/account/orders            # Order history
/account/addresses         # Saved addresses
/account/subscriptions     # Subscription management
```

**Customizations**:
- Branded account pages matching site design
- Quick links to frequently needed actions
- Mobile-optimized layout for on-the-go access
- Integration with Shopify customer metafields for preferences

---

##  How Key Components Work

### Theme Customizer Integration

**Customizable Elements** (via Shopify Admin → Online Store → Customize):

1. **Colors**:
   - Primary color (Forest Teal)
   - Secondary color (Burnt Sienna)
   - Background colors
   - Button colors

2. **Typography**:
   - Font families for headings and body
   - Font sizes
   - Letter spacing

3. **Layout**:
   - Container widths
   - Spacing between sections
   - Header style (sticky/static)

4. **Homepage Sections**:
   - Hero banner content and imagery
   - Featured products
   - Quiz section placement
   - Testimonials
   - Call-to-action buttons

**How It Works**:
```
1. Settings defined in config/settings_schema.json
2. User adjusts settings in theme customizer
3. Values saved to config/settings_data.json
4. Liquid templates access via {{ settings.color_primary }}
5. CSS custom properties updated dynamically
6. Changes preview in real-time
```

### Responsive Design Strategy

**Mobile-First Approach**:
```css
/* Base styles: Mobile (320px+) */
.container {
  padding: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Breakpoint Strategy**:
- **320px-767px**: Mobile (single column, stacked content)
- **768px-1023px**: Tablet (two columns where appropriate)
- **1024px+**: Desktop (full multi-column layouts)

**Key Responsive Elements**:
- Flexible grid system using CSS Grid and Flexbox
- Fluid typography with clamp() for scaling
- Responsive images with srcset for different resolutions
- Touch-friendly interface elements on mobile

### Performance Optimization

**Implemented Strategies**:

1. **Asset Optimization**:
   - Minified CSS and JavaScript
   - Compressed images (WebP format with fallbacks)
   - Lazy loading for below-the-fold images
   - Critical CSS inlined in `<head>`

2. **Caching**:
   - Browser caching headers for static assets
   - Service worker for offline functionality (future enhancement)
   - Local storage for user preferences

3. **Loading Strategy**:
   - Deferred JavaScript loading
   - Async loading for non-critical scripts
   - Font display: swap for web fonts

4. **Code Splitting**:
   - Quiz JavaScript only loads on quiz page
   - Search functionality lazy-loaded on first interaction
   - Customer account scripts only on account pages

---

## Security & Privacy

### Data Handling
- **Payment Processing**: Handled entirely by Shopify (PCI compliant)
- **Customer Data**: Encrypted in transit (HTTPS) and at rest
- **Passwords**: Never stored in plain text, hashed by Shopify
- **Quiz Responses**: Stored temporarily in sessionStorage, not persisted

### Privacy Considerations
- GDPR-compliant cookie consent
- Clear privacy policy linked in footer
- Customer data deletion available on request
- No third-party tracking scripts without consent

---

## 📱 User Experience Flow

### First-Time Visitor Journey

```
1. Land on Homepage
   ↓
2. See Hero Banner with value proposition
   ↓
3. Notice "Take Quiz" CTA button
   ↓
4. Complete interactive quiz (5-7 questions)
   ↓
5. Receive personalized tier recommendation
   ↓
6. View recommended product details
   ↓
7. Add to cart or subscribe
   ↓
8. Create account during checkout
   ↓
9. Complete payment (Shopify Checkout)
   ↓
10. Access customer account dashboard
```

### Returning Customer Journey

```
1. Visit site (auto-login if remembered)
   ↓
2. Access account dashboard
   ↓
3. View current subscription status
   ↓
4. Browse new meal plans or recipes
   ↓
5. Use search to find specific meals
   ↓
6. Manage subscription (upgrade/downgrade)
   ↓
7. Update payment method or preferences
```

---

## Educational Context

### Learning Objectives Achieved

1. **Shopify Platform Mastery**:
   - Understanding of Shopify theme architecture
   - Proficiency with Liquid templating language
   - Experience with Shopify CLI and deployment

2. **E-Commerce Fundamentals**:
   - Product management and variants
   - Subscription business models
   - Customer account functionality
   - Payment processing integration

3. **Web Development Skills**:
   - Responsive design implementation
   - JavaScript for interactivity
   - API integration (Predictive Search)
   - Performance optimization

4. **Design Principles**:
   - Brand consistency across platform
   - User-centered design decisions
   - Accessibility considerations
   - Mobile-first approach

### Technical Challenges Overcome

1. **Template Assignment**:
   - **Challenge**: Custom templates not displaying on live pages
   - **Solution**: Explicit template assignment in theme editor
   - **Learning**: Templates must be activated, not just created

2. **Shopify Validation**:
   - **Challenge**: Deployment errors from schema violations
   - **Solution**: Shortened names, corrected field types
   - **Learning**: Platform-specific requirements matter

3. **Rebranding Coordination**:
   - **Challenge**: Converting AI education to nutrition platform
   - **Solution**: Systematic component updates with checklist
   - **Learning**: Importance of maintaining consistency across changes

---

## Future Enhancements

### Planned Features

1. **Advanced Quiz Intelligence**:
   - AI-powered meal recommendations
   - Machine learning from user feedback
   - Integration with nutrition databases
   - Dietary restriction filtering

2. **Enhanced Customer Dashboard**:
   - Meal history tracking
   - Nutrition analytics and charts
   - Favorite recipes collection
   - Weekly meal planning calendar
   - Automated shopping list generation

3. **Social Features**:
   - Share meal plans with friends
   - Community recipe submissions
   - Student success stories
   - Meal prep buddy matching

4. **Business Growth**:
   - A/B testing for conversion optimization
   - Email marketing automation
   - Partnership with campus dining
   - Referral program
   - Mobile app (iOS/Android)

5. **Accessibility Improvements**:
   - Comprehensive keyboard navigation
   - Screen reader optimization
   - High contrast mode
   - Multilingual support

---

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14+)
- Shopify CLI (`npm install -g @shopify/cli`)
- Git for version control
- Text editor (VS Code recommended)

### Local Development Workflow

1. **Clone Repository**:
```bash
git clone https://github.com/your-username/studyfuel-theme.git
cd studyfuel-theme
```

2. **Connect to Shopify Store**:
```bash
shopify login --store your-store.myshopify.com
```

3. **Start Development Server**:
```bash
shopify theme dev
```
This creates a development theme and provides a preview URL.

4. **Make Changes**:
- Edit files in your code editor
- Changes sync automatically to development theme
- Preview updates in browser (hot reload enabled)

5. **Test Changes**:
- Test on multiple devices/browsers
- Verify responsive behavior
- Check console for JavaScript errors
- Validate accessibility with browser tools

6. **Commit Changes**:
```bash
git add .
git commit -m "Descriptive commit message"
git push origin main
```

7. **Deploy to Production**:
```bash
shopify theme push --theme YOUR_THEME_ID
```

### Best Practices

1. **Code Organization**:
   - Keep related code together
   - Use meaningful file and variable names
   - Comment complex logic
   - Follow Shopify theme structure conventions

2. **Version Control**:
   - Commit frequently with clear messages
   - Create branches for major features
   - Use pull requests for code review
   - Tag releases (v1.0, v1.1, etc.)

3. **Testing**:
   - Test on actual mobile devices, not just browser tools
   - Verify in multiple browsers (Chrome, Firefox, Safari, Edge)
   - Check performance with Lighthouse
   - Validate HTML/CSS with W3C validators

4. **Documentation**:
   - Keep README updated
   - Document custom functions and complex sections
   - Maintain changelog for version history
   - Create style guide for design consistency

---

## Resources & Documentation

### Official Documentation
- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Shopify Ajax API](https://shopify.dev/api/ajax)
- [Theme Kit Documentation](https://shopify.dev/themes/tools/theme-kit)

### Learning Resources
- [Shopify Partners Academy](https://www.shopify.com/partners/academy)
- [CSS-Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

### Design Inspiration
- [Dribbble - E-commerce Designs](https://dribbble.com/tags/ecommerce)
- [Awwwards - E-commerce Sites](https://www.awwwards.com/websites/ecommerce/)
- [Shopify Design Gallery](https://www.shopify.com/partners/blog/web-design-gallery)

---

## Contributing

This is an educational project, but feedback and suggestions are welcome!

### How to Provide Feedback
1. Open an issue describing the suggestion or bug
2. Include screenshots if reporting a visual issue
3. Provide steps to reproduce if reporting a bug
4. Suggest improvements with rationale

---

## License

This project is for educational purposes as part of web development coursework.

---

## Author

**Samuel**  
Web Development Student  
Fall 2024

---

## Acknowledgments

- **Shopify** for providing an excellent e-commerce platform
- **Course Instructor** for guidance throughout the project
- **Dawn Theme** as the foundation for customization
- **StudyFuel Concept** inspired by real student nutrition challenges

---

## Support & Contact

For questions about this project:
- **Project Documentation**: See this README
- **Code Questions**: Review inline comments in source files
- **Feature Requests**: Open an issue with [FEATURE] tag
- **Bug Reports**: Open an issue with [BUG] tag

---

**Last Updated**: October 31, 2024  
**Version**: 1.0  
**Status**: Active Development
