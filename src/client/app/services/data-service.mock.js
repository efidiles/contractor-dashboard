const REQUEST_TIME = 2000;

export const saveAppConfig = () => new Promise(resolve => setTimeout(resolve, REQUEST_TIME));

export const getAppConfig = () => Promise.resolve({
  data: {
    firstName: 'Mike',
    lastName: 'Taylor',
    companyName: 'VisionTech',
    googleApiId: '4ub34gs20ve3',
    googleApiSecret: '4ub34gs20ve34ub34gs20ve3',
    googleApiRedirectUrl: 'http://localhost:8066/auth/callback'
  }
});

export const getAgentEmailConfig = () => Promise.resolve({
  data: {
    from: 'eduard@example.org',
    receipients: 'recipient1@example.org',
    subjectTemplate: 'Timesheet - ${ name } (${ company }) - period ending ${ period }',
    bodyTemplate: 'Hi,\n\nPlease find attached the timesheet ${ invoice } for ' +
      'period ending ${ period }.\n\nRegards,\n${ name }'
  }
});

export const saveAgentEmailConfig = () => new Promise(resolve => setTimeout(resolve, REQUEST_TIME));

export const sendAgentEmail = () => new Promise(resolve => setTimeout(resolve, REQUEST_TIME));
