# Setup and account settings

## Supabase

1. Create a Supabase project. In its **Connect** dialog, copy the project URL and publishable key to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Set `APP_URL` to the application URL.
2. On a new project, apply the SQL files in [supabase/migrations](../supabase/migrations) in filename order. For an existing project, apply only the migrations that are missing. Use the linked CLI workflow for tracked migrations. If the project was set up by pasting SQL into SQL Editor, follow the existing-project steps below. [Supabase migration guide](https://supabase.com/docs/guides/deployment/database-migrations)
3. Under **Authentication**, enable email confirmation and set the Site URL to `APP_URL`. Use the following destinations in the signup and reset email templates. [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates)

   - Signup confirmation: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
   - Password recovery: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`

4. Configure custom SMTP for signup verification and password recovery. For admin alerts, set `RESEND_API_KEY`, `SIGNUP_EMAIL_FROM`, `SIGNUP_EMAIL_TO`, `SUPABASE_SECRET_KEY`, and `CRON_SECRET` in the server environment. The notification job retries queued signup alerts. [Supabase SMTP setup](https://supabase.com/docs/guides/auth/auth-smtp)
5. Request access in the app and verify your email. In Supabase **SQL Editor**, replace the example address with the verified owner email and run this query. Subsequent mentor approvals happen in the app under **Accounts**.

   ```sql
   update public.profiles p
   set role = 'admin', status = 'approved'
   from auth.users u
   where p.id = u.id
     and u.email_confirmed_at is not null
     and u.email = 'owner@example.com'
   returning p.email, p.role, p.status;
   ```

## Update an existing project

For a project that already has the workspace and catalogue tables from the first two migrations:

1. Open **SQL Editor → New query** in the project's Supabase dashboard.
2. Paste the full [nickname migration](../supabase/migrations/202611140003_profile_nickname.sql) and click **Run**.
3. Open a new query, paste the full [follow-up migration](../supabase/migrations/202611140004_follow_up_completion.sql), and click **Run**.
4. Reload the app. Open the profile icon in the top-right corner, choose **Profile**, enter a nickname, and click **Save nickname**. The greeting updates after saving.

## Change your password

1. Sign in. Open the profile icon, then choose **Password**.
2. Enter your current password, then enter and confirm a new password of 10–72 characters.
3. Click **Change password** and look for the confirmation. If Supabase requires recent authentication, sign out, sign back in, and retry.
4. If you forgot your current password, use **Reset password** on the sign-in screen and follow the email link.

Password changes use Supabase Auth. The nickname and follow-up migrations can be applied independently of the password flow. [Supabase password-based Auth](https://supabase.com/docs/guides/auth/passwords)

## Hosting and older records

Set the production app URL and authentication redirects before deploying. Keep server secrets in the hosting provider's environment settings. The repository includes a Vercel schedule for retrying signup email.

To transfer records from the original local-only build, open **Mentees → Recover earlier records** from the original browser profile and address. Check the destination account and review the preview before importing.
