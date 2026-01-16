# GoDaddy Deployment Guide - Fix "Site Can't Be Reached" Error

## Quick Diagnosis Checklist

### 1. Check Domain Status
- Log into [GoDaddy Account](https://account.godaddy.com)
- Go to **My Products** → **Domains**
- Verify domain is **Active** (not expired)
- Check DNS is properly configured

### 2. Check Hosting Status
- Go to **My Products** → **Web Hosting**
- Ensure hosting plan is **Active** and not expired
- Note your hosting type (cPanel, WordPress, etc.)

---

## Deploying Your React App to GoDaddy

### Step 1: Build Your App Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with your compiled site.

### Step 2: Upload to GoDaddy cPanel Hosting

1. Log into GoDaddy → **My Products** → **Web Hosting** → **Manage**
2. Open **cPanel** or **File Manager**
3. Navigate to `public_html` folder
4. **Delete** existing files (backup first if needed)
5. Upload ALL contents from your local `dist` folder
6. Ensure `index.html` is in the root of `public_html`

### Step 3: Create .htaccess for React Router

Create a file named `.htaccess` in `public_html` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures React Router works correctly for all routes.

---

## Common Issues & Fixes

### Issue: "Site Can't Be Reached"

**Possible Causes:**
1. **Domain expired** → Renew domain in GoDaddy
2. **Hosting expired** → Renew hosting plan
3. **DNS not configured** → Point domain to hosting
4. **No files uploaded** → Upload dist folder contents
5. **SSL certificate issue** → Enable SSL in GoDaddy

### Fix DNS Settings

1. Go to **Domains** → Select your domain → **DNS**
2. Ensure these records exist:
   - **A Record**: Points to your hosting IP
   - **CNAME (www)**: Points to your domain

### Enable SSL (HTTPS)

1. In cPanel, find **SSL/TLS** or **Security**
2. Enable **Free SSL Certificate**
3. Wait 24-48 hours for propagation

---

## Alternative: Use GoDaddy's Static Site Hosting

If using GoDaddy's newer hosting:

1. Go to **Websites** → **Create Website**
2. Choose **Upload your own site**
3. Upload your `dist` folder as a ZIP
4. Connect your domain

---

## Verify Deployment

After uploading, check:
- [ ] `https://yourdomain.com` loads the site
- [ ] `https://yourdomain.com/login` works (React Router)
- [ ] No console errors in browser DevTools
- [ ] SSL certificate is valid (padlock icon)

---

## Need More Help?

Contact GoDaddy Support: 1-480-505-8877 (24/7)
Or use live chat at godaddy.com/help
