# Netlify CMS Deployment Checklist

## Before First Deploy

1. **Ensure all files are committed to Git:**
   ```bash
   git add .
   git commit -m "Add Netlify CMS setup"
   git push origin main
   ```

2. **Required files in repository:**
   - ✅ `admin/config.yml`
   - ✅ `admin/index.html` 
   - ✅ `_data/` folder with all YAML files
   - ✅ `cms-loader.js`
   - ✅ Modified `index.html` with CMS scripts

## After Deploy to Netlify

1. **Enable Identity:**
   - Site Settings > Identity > Enable Identity
   - Registration preferences: "Invite only"

2. **Enable Git Gateway:**
   - Site Settings > Identity > Git Gateway > Enable Git Gateway

3. **Create Admin User:**
   - Identity tab > Invite users
   - Use your email address
   - Check email and set password

4. **Test CMS Access:**
   - Go to `yoursite.netlify.app/admin/`
   - Login with your credentials
   - You should see the CMS interface

## Expected Behavior

### On Fresh Deploy (Before CMS Setup)
- Site displays with default content
- Hero title shows typewriter effect with fallback text
- All sections show default content
- **No "[object Object]" should appear**

### After CMS Setup
- Content can be edited through `/admin/` interface
- Changes automatically deploy to site
- Custom content replaces default content

## Troubleshooting Deploy Issues

### If you see "[object Object]"
This indicates a JavaScript error. Check:
1. Browser console for errors
2. Ensure `cms-loader.js` is loading correctly
3. Clear browser cache (Ctrl+F5)

### If CMS admin doesn't work
1. Check Identity is enabled
2. Check Git Gateway is enabled  
3. Verify admin user has access
4. Check repository permissions

### If content doesn't update
1. Make changes in CMS interface
2. Check if changes are committed to Git
3. Wait for Netlify rebuild to complete
4. Clear browser cache

## Quick Verification Commands

```bash
# Check if all CMS files are in repo
ls -la admin/
ls -la _data/

# Verify no syntax errors
grep -r "object Object" .
```

## Support Resources

- [Netlify CMS Docs](https://www.netlifycms.org/docs/)
- [Netlify Identity Docs](https://docs.netlify.com/visitor-access/identity/)
- [Git Gateway Docs](https://docs.netlify.com/visitor-access/git-gateway/)
