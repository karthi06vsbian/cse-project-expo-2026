import { WhatsAppTemplatePayload } from './templates';

export interface WhatsAppSendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
  isMock?: boolean;
}

export async function sendWhatsAppTemplateMessage(
  recipientPhone: string,
  templatePayload: WhatsAppTemplatePayload,
  fallbackText?: string
): Promise<WhatsAppSendResult> {
  const token = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.META_WHATSAPP_API_VERSION || 'v21.0';

  // Format recipient phone to digits only (e.g. 919876543210)
  const formattedTo = recipientPhone.replace(/\D/g, '');

  if (!token || !phoneNumberId) {
    console.warn(
      `[WhatsApp Client] Meta WhatsApp credentials are not configured. Mocking transmission to ${formattedTo} for template '${templatePayload.name}'.`
    );
    return {
      success: true,
      providerMessageId: `mock_wamid_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      isMock: true,
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'template',
        template: templatePayload,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If template fails (e.g. pending approval or template error) and fallbackText is provided, send direct text message
      if (fallbackText) {
        console.warn(
          `[WhatsApp Client] Template '${templatePayload.name}' not accepted (${data?.error?.message}). Falling back to direct WhatsApp text message...`
        );
        return sendWhatsAppTextMessage(recipientPhone, fallbackText);
      }

      const errorMessage = data?.error?.message || `HTTP ${response.status}: Failed to dispatch WhatsApp message`;
      console.error('[WhatsApp Client] Meta API Error:', data);
      return {
        success: false,
        error: errorMessage,
      };
    }

    const messageId = data?.messages?.[0]?.id;
    return {
      success: true,
      providerMessageId: messageId,
    };
  } catch (err: any) {
    console.error('[WhatsApp Client] Network/Fetch Exception:', err);
    if (fallbackText) {
      return sendWhatsAppTextMessage(recipientPhone, fallbackText);
    }
    return {
      success: false,
      error: err?.message || 'Unexpected network error dispatching WhatsApp message',
    };
  }
}

export async function sendWhatsAppTextMessage(
  recipientPhone: string,
  text: string
): Promise<WhatsAppSendResult> {
  const token = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.META_WHATSAPP_API_VERSION || 'v21.0';

  const formattedTo = recipientPhone.replace(/\D/g, '');

  if (!token || !phoneNumberId) {
    console.warn(`[WhatsApp Client] Meta WhatsApp credentials are not configured. Mocking transmission to ${formattedTo}.`);
    return {
      success: true,
      providerMessageId: `mock_wamid_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      isMock: true,
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'text',
        text: {
          body: text,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || `HTTP ${response.status}: Failed to dispatch WhatsApp text message`;
      console.error('[WhatsApp Client] Meta API Error (text):', data);
      return {
        success: false,
        error: errorMessage,
      };
    }

    const messageId = data?.messages?.[0]?.id;
    return {
      success: true,
      providerMessageId: messageId,
    };
  } catch (err: any) {
    console.error('[WhatsApp Client] Network Exception:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected network error dispatching WhatsApp text message',
    };
  }
}
