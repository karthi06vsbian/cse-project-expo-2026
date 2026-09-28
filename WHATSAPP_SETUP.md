# Meta WhatsApp Cloud API Setup Guide

This guide covers registering and configuring the **Meta WhatsApp Business Cloud API** to send automated project submission confirmations, shortlist alerts, and rejection notices for the **CSE Project Expo 2026**.

---

## 1. Create a Meta for Developers Account

1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with your Facebook account.
2. Click **Get Started** or **My Apps** in the top right corner.
3. Complete developer onboarding verification.

---

## 2. Create a Meta App

1. Click **Create App**.
2. Select **Other** as the use case → Click **Next**.
3. Select app type: **Business** → Click **Next**.
4. Set:
   - **App Name**: `CSE Project Expo Notifications`
   - **App Contact Email**: your official email address.
   - **Business Account**: Select your college/department Meta Business Account (or create one).
5. Click **Create App**.

---

## 3. Add the WhatsApp Product

1. On the App Dashboard, scroll to **Add products to your app**.
2. Find **WhatsApp** and click **Set up**.
3. You will be redirected to the **API Setup** page.

---

## 4. Obtain Test Credentials & Phone Number ID

On the **WhatsApp** → **API Setup** panel, Meta provides a sandbox test environment:
- **Temporary Access Token**: Valid for 24 hours (use for immediate testing).
- **Phone Number ID**: A numeric ID (e.g., `109283746592837`). Copy this to `META_WHATSAPP_PHONE_NUMBER_ID`.
- **WhatsApp Business Account ID**: Copy to `META_WHATSAPP_BUSINESS_ACCOUNT_ID`.

> **Note for Sandbox Testing**: In test mode, add recipient phone numbers in the **To** field dropdown before sending messages.

---

## 5. Register Required Message Templates

In Meta WhatsApp Manager (**WhatsApp** → **Configuration** → **Manage message templates**):

### Template 1: Submission Confirmation
- **Name**: `project_submission_success`
- **Category**: `Utility`
- **Language**: `English (en)`
- **Body Text**:
  ```text
  Hello {{1}},

  Your project {{2}} has been successfully submitted for the CSE Project Expo 2026.

  Submission ID: {{3}}
  Status: Under Review

  Our team will review your project. Shortlist/results will be updated soon.

  Thank you for participating!
  — CSE Department
  ```
- **Sample Values**:
  - `{{1}}`: `Aarav Sharma`
  - `{{2}}`: `Smart Soil Irrigation`
  - `{{3}}`: `CSEEXPO-2026-0001`

---

### Template 2: Shortlist Notification
- **Name**: `project_shortlisted`
- **Category**: `Utility`
- **Language**: `English (en)`
- **Body Text**:
  ```text
  Congratulations {{1}}!

  Your team {{2}} has been shortlisted for the CSE Project Expo 2026.

  Project: {{3}}
  Status: SHORTLISTED

  Further details regarding presentation schedule and venue will be shared soon.

  All the best!
  — CSE Department
  ```
- **Sample Values**:
  - `{{1}}`: `Aarav Sharma`
  - `{{2}}`: `AgriSense IoT`
  - `{{3}}`: `Precision Soil Health`

---

### Template 3: Rejection Notice (Optional)
- **Name**: `project_not_shortlisted`
- **Category**: `Utility`
- **Language**: `English (en)`
- **Body Text**:
  ```text
  Hello {{1}},

  Thank you for participating in the CSE Project Expo 2026.

  After the review process, your project {{2}} has not been shortlisted for the final expo.

  We appreciate your effort and participation.
  — CSE Department
  ```
- **Sample Values**:
  - `{{1}}`: `Aarav Sharma`
  - `{{2}}`: `Precision Soil Health`

Click **Submit** on each template. Utility templates are typically approved within 1 to 5 minutes.

---

## 6. Generate Permanent System User Access Token

For production (temporary tokens expire in 24 hours):
1. Go to [business.facebook.com/settings](https://business.facebook.com/settings).
2. Go to **Users** → **System Users** → Click **Add**.
3. Name: `Expo Bot Admin`, Role: **Admin**.
4. Click **Generate New Token**:
   - Select your App (`CSE Project Expo Notifications`).
   - Check permissions: `whatsapp_business_messaging`, `whatsapp_business_management`.
   - Token expiration: **Never**.
5. Copy the generated permanent token and save it safely.

---

## 7. Configure Environment Variables

In your `.env.local` and in Vercel:

```env
META_WHATSAPP_ACCESS_TOKEN=EAAG...
META_WHATSAPP_PHONE_NUMBER_ID=109283746592837
META_WHATSAPP_BUSINESS_ACCOUNT_ID=982736451928374
META_WHATSAPP_API_VERSION=v21.0
```

> **Development Mode Graceful Fallback**: If these environment variables are left blank, the application automatically runs in mock mode, safely logging template requests to the terminal and `whatsapp_logs` table without crashing.

---

## 8. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Template does not exist` | Template name or language mismatch | Ensure template name in Meta is exact lowercase: `project_submission_success` and language is `en`. |
| `(#131030) Recipient phone number not in allowed list` | Using Sandbox test number without whitelist | Add the test recipient's phone number in Meta App Dashboard under API Setup. |
| `(#190) Invalid OAuth access token` | Token expired or invalid | Generate a permanent System User token with `whatsapp_business_messaging` permission. |
