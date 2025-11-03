# Environment Variables Setup Guide

This guide explains how to set up EmailJS credentials using environment variables to keep them secure when pushing to GitHub and deploying to Netlify.

## Local Development Setup

### Step 1: Create a `.env` file

Create a `.env` file in the root directory of your project (same level as `package.json`):

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Optional: Recipient email address (if not set in EmailJS template)
# VITE_EMAILJS_TO_EMAIL=your-email@example.com
```

### Step 2: Get your EmailJS Credentials

1. **Service ID**: Go to EmailJS Dashboard > Integrations > Your Service
2. **Template ID**: Go to EmailJS Dashboard > Email Templates > Your Template
3. **Public Key**: Go to EmailJS Dashboard > Account > API Keys > Public Key

### Step 3: Fill in the values

Replace the placeholder values in your `.env` file with your actual EmailJS credentials.

**Important**: The `.env` file is already in `.gitignore`, so it won't be committed to GitHub.

## Netlify Deployment Setup

### Option 1: Using Netlify Dashboard (Recommended)

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable** for each of the following:
   - `VITE_EMAILJS_SERVICE_ID` = Your EmailJS Service ID
   - `VITE_EMAILJS_TEMPLATE_ID` = Your EmailJS Template ID
   - `VITE_EMAILJS_PUBLIC_KEY` = Your EmailJS Public Key
   - `VITE_EMAILJS_TO_EMAIL` = Your email (optional)

4. After adding all variables, **Redeploy** your site for the changes to take effect

### Option 2: Using Netlify CLI

If you're using Netlify CLI, you can set environment variables using:

```bash
netlify env:set VITE_EMAILJS_SERVICE_ID "your_service_id"
netlify env:set VITE_EMAILJS_TEMPLATE_ID "your_template_id"
netlify env:set VITE_EMAILJS_PUBLIC_KEY "your_public_key"
netlify env:set VITE_EMAILJS_TO_EMAIL "your-email@example.com"
```

## Security Notes

✅ **DO:**
- Keep your `.env` file local and never commit it
- Use Netlify's environment variables for production
- Use different EmailJS accounts for development and production if possible

❌ **DON'T:**
- Commit `.env` files to GitHub
- Share your EmailJS credentials publicly
- Use production credentials in development

## Troubleshooting

If you get an error: "EmailJS configuration is missing":
- Make sure your `.env` file exists in the project root
- Verify all environment variables start with `VITE_` prefix
- Restart your development server after creating/modifying `.env`
- Check that variables are set correctly in Netlify (for production)

## Testing

After setting up environment variables:
1. Restart your development server (`npm run dev`)
2. Test the contact form
3. Check the browser console for any errors

