# Enable Email Signups in Supabase

The error "Email signups are disabled" means the Email authentication provider is turned off in your Supabase project. Follow these steps to enable it:

## Steps to Enable Email Signups

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Providers"** tab

3. **Enable Email Provider**
   - Find **"Email"** in the list of providers
   - Click on it to expand the settings
   - Make sure **"Enable Email provider"** is **ON** (toggle should be green/enabled)

4. **Configure Email Settings**
   - **Enable Email Signup**: Make sure this is **ON**
   - **Confirm email**: Turn this **OFF** for immediate access (optional)
   - **Secure email change**: Configure as needed

5. **Save Changes**
   - Click **"Save"** to apply your changes

## Quick Checklist

- [ ] Email provider is enabled
- [ ] Email signup is enabled  
- [ ] (Optional) Email confirmation is disabled for faster onboarding

## After Enabling

Once email signups are enabled:
- Users can create accounts with email/password
- They will be redirected to onboarding after signup
- No additional code changes are needed

## Troubleshooting

If you still see errors after enabling:
1. Wait a few seconds for settings to propagate
2. Clear your browser cache
3. Try in an incognito/private window
4. Check the Supabase logs for more details
