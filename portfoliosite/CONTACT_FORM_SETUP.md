# Contact Form Setup Guide

This guide explains how to set up the contact form to send emails or store submissions.

## 📧 Option 1: EmailJS (Recommended - No Backend Required)

EmailJS is the easiest solution - it sends emails directly from the frontend without needing a backend server.

### Setup Steps:

1. **Create an EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account (allows 200 emails/month)

2. **Add Email Service**
   - Go to Dashboard → Email Services
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions
   - **Copy the Service ID** (e.g., `service_xxxxx`)

3. **Create Email Template**
   - Go to Dashboard → Email Templates
   - Click "Create New Template"
   - Use these template variables:
     ```
     Subject: Contact Form Submission from {{from_name}}
     
     From: {{from_name}} ({{from_email}})
     Message: {{message}}
     
     Purpose: {{message}}
     ```
   - **Copy the Template ID** (e.g., `template_xxxxx`)

4. **Get Public Key**
   - Go to Dashboard → Account → General
   - **Copy your Public Key** (e.g., `xxxxxxxxxxxx`)

5. **Update the Code**
   - Open `src/app.tsx`
   - Find the `handleFormSubmit` function (around line 766)
   - Replace these placeholder values:
     ```typescript
     const serviceId = 'YOUR_SERVICE_ID'      // Your EmailJS Service ID
     const templateId = 'YOUR_TEMPLATE_ID'    // Your EmailJS Template ID
     const publicKey = 'YOUR_PUBLIC_KEY'      // Your EmailJS Public Key
     const to_email = 'your-email@example.com' // Your email address
     ```

### Example:
```typescript
const serviceId = 'service_abc123'
const templateId = 'template_xyz789'
const publicKey = 'abcdefghijklmnop'
```

---

## 🖥️ Option 2: Custom Backend API

If you prefer to use your own backend (Node.js, Python, etc.), follow these steps:

### Backend Setup (Node.js/Express Example):

1. **Create a Backend Endpoint**
   ```javascript
   // Example: server.js
   const express = require('express');
   const nodemailer = require('nodemailer');
   const cors = require('cors');
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   app.post('/api/contact', async (req, res) => {
     const { name, email, purpose } = req.body;
     
     // Send email using nodemailer
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS
       }
     });
     
     const mailOptions = {
       from: email,
       to: process.env.YOUR_EMAIL,
       subject: `Contact Form: ${name}`,
       text: `From: ${name} (${email})\n\nMessage: ${purpose}`
     };
     
     try {
       await transporter.sendMail(mailOptions);
       res.json({ success: true });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   });
   
   app.listen(3000, () => console.log('Server running on port 3000'));
   ```

2. **Update Frontend Code**
   - In `src/app.tsx`, comment out the EmailJS code
   - Uncomment the "Alternative: Backend API endpoint handler" section
   - Replace `YOUR_BACKEND_API_ENDPOINT` with your actual API URL:
     ```typescript
     const response = await fetch('https://your-backend.com/api/contact', {
       // ... rest of the code
     })
     ```

---

## 🔒 Option 3: Serverless Functions (Vercel/Netlify)

### Vercel Serverless Function Example:

1. **Create API Route**
   - Create `api/contact.js` in your project root
   ```javascript
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
     
     const { name, email, purpose } = req.body;
     
     // Send email using your preferred service
     // (e.g., SendGrid, Mailgun, Resend, etc.)
     
     return res.status(200).json({ success: true });
   }
   ```

2. **Update Frontend**
   - Use endpoint: `/api/contact` (relative URL for Vercel)

---

## ✅ Testing

After setup:
1. Fill out the contact form
2. Click "Send Message"
3. Check your email inbox
4. You should see the form submission

---

## 📝 Notes

- **EmailJS Free Tier**: 200 emails/month
- **Security**: Never expose sensitive credentials in frontend code
- **Rate Limiting**: Consider adding rate limiting to prevent spam
- **Backup**: You might want to also store submissions in a database

---

## 🚀 Quick Start (EmailJS)

1. Sign up at emailjs.com
2. Add service → Copy Service ID
3. Create template → Copy Template ID
4. Get Public Key from Account settings
5. Update the 4 values in `src/app.tsx` (line 780-782)
6. Done! Form will start sending emails

For more details, visit: https://www.emailjs.com/docs/
