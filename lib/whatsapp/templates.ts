export interface WhatsAppTemplatePayload {
  name: string;
  language: {
    code: string;
  };
  components?: Array<{
    type: 'body' | 'header';
    parameters?: Array<{
      type: 'text';
      text: string;
    }>;
  }>;
}

export function buildSubmissionSuccessTemplate(
  leaderName: string,
  projectTitle: string,
  submissionId: string
): WhatsAppTemplatePayload {
  return {
    name: 'cse_expo_registration_success',
    language: { code: 'en_US' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: leaderName },
          { type: 'text', text: submissionId },
          { type: 'text', text: projectTitle },
        ],
      },
    ],
  };
}

export function buildShortlistedTemplate(
  leaderName: string,
  teamName: string,
  projectTitle: string
): WhatsAppTemplatePayload {
  return {
    name: 'project_shortlisted',
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: leaderName },
          { type: 'text', text: teamName },
          { type: 'text', text: projectTitle },
        ],
      },
    ],
  };
}

export function buildNotShortlistedTemplate(
  leaderName: string,
  projectTitle: string
): WhatsAppTemplatePayload {
  return {
    name: 'project_not_shortlisted',
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: leaderName },
          { type: 'text', text: projectTitle },
        ],
      },
    ],
  };
}

export function buildCustomAnnouncementTemplate(
  leaderName: string,
  messageContent: string
): WhatsAppTemplatePayload {
  return {
    name: 'expo_custom_announcement',
    language: { code: 'en_US' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: leaderName || 'Participant' },
          { type: 'text', text: messageContent },
        ],
      },
    ],
  };
}

