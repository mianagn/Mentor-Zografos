# Mentor Zografos Website - Netlify CMS Setup

This website now includes Netlify CMS for easy content management. Here's how to set it up and use it.

## CMS Setup Instructions

### 1. Deploy to Netlify

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Deploy the site

### 2. Enable Netlify Identity

1. Go to your Netlify dashboard
2. Navigate to **Site Settings > Identity**
3. Click **Enable Identity**
4. Under **Registration preferences**, set to "Invite only"
5. Under **Git Gateway**, click **Enable Git Gateway**

### 3. Add Identity Widget to Your Site

The identity widget is already included in your HTML. You just need to enable it by adding this script before the closing `</body>` tag:

```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

### 4. Create Admin User

1. Go to your site's **Identity** tab in Netlify
2. Click **Invite users**
3. Enter your email address
4. Check your email and set up your password

### 5. Access the CMS

Visit `https://yoursite.netlify.app/admin/` to access the content management system.

## Content Structure

The CMS is organized into the following sections:

### Site Settings
- Site title and meta description
- Logo images

### Hero Section
- Main title (with typewriter effect)
- Subtitle text
- Call-to-action buttons

### Special Offer Popup
- Enable/disable popup
- Popup content and button

### About Section
- Section title and subtitle
- About text paragraphs
- Feature highlights with icons

### Products
- Section headers
- Product categories with:
  - Names and descriptions
  - FontAwesome icons
  - Featured flag

### Contact Information
- Contact details
- Address and phone numbers
- Google Maps embed URL

### Navigation & Footer
- Menu items and order
- Footer content and links

## File Structure

```
├── admin/
│   ├── config.yml         # CMS configuration
│   └── index.html         # CMS admin interface
├── _data/                 # Content data files
│   ├── site.yml          # Site settings
│   ├── hero.yml          # Hero section content
│   ├── about.yml         # About section content
│   ├── products.yml      # Products data
│   ├── contact.yml       # Contact information
│   ├── navigation.yml    # Navigation menu
│   ├── footer.yml        # Footer content
│   └── special_offer.yml # Special offer popup
├── assets/
│   └── uploads/          # CMS uploaded images
├── cms-loader.js         # JavaScript to load CMS data
└── index.html            # Main website
```

## How It Works

1. **Content Storage**: Content is stored in YAML files in the `_data/` folder
2. **CMS Interface**: Netlify CMS provides a user-friendly interface to edit content
3. **Dynamic Loading**: The `cms-loader.js` script loads YAML data and updates the HTML
4. **Git Workflow**: Changes made in the CMS are committed to your repository
5. **Auto-Deploy**: Netlify automatically rebuilds your site when content changes

## Adding New Content Fields

To add new editable fields:

1. Edit `admin/config.yml` to add new fields to the appropriate collection
2. Update the corresponding YAML file in `_data/`
3. Modify `cms-loader.js` to handle the new data
4. Update your HTML template if needed

## Icon Usage

For product categories and features, use FontAwesome icon classes:
- Format: `fas fa-icon-name`
- Example: `fas fa-pills`, `fas fa-shopping-bag`
- Find icons at: https://fontawesome.com/icons

## Troubleshooting

### CMS Not Loading
- Check that Git Gateway is enabled in Netlify
- Verify the repository is connected
- Ensure the admin user has proper permissions

### Content Not Updating
- Clear browser cache
- Check browser console for JavaScript errors
- Verify YAML file syntax is correct

### Images Not Displaying
- Check that images are uploaded through the CMS
- Verify file paths in the YAML files
- Ensure images are in the correct upload folder

## Development Tips

1. **Test Locally**: You can edit YAML files directly for quick testing
2. **Backup**: Always backup your `_data/` folder before major changes
3. **Validation**: Use a YAML validator to check file syntax
4. **Performance**: The CMS loader is lightweight and caches data

## Support

For issues with:
- **Netlify CMS**: Check [Netlify CMS documentation](https://www.netlifycms.org/docs/)
- **Deployment**: Check [Netlify documentation](https://docs.netlify.com/)
- **Custom Features**: Contact your developer

---

*This CMS setup allows non-technical users to easily update website content while maintaining full version control and automatic deployments.*
