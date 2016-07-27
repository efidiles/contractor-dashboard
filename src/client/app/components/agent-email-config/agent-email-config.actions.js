import loggerFactory from '../../utils/logger';

const logger = loggerFactory('From agent-email-actions');

export const isValidAgentEmailConfig = () => (dispatch, getState) => {
  logger.debug('Inside isValidAgentEmailConfig');

  const state = getState();
  const agentEmailConfig = state.agentEmail.config;

  return Promise.resolve(
    agentEmailConfig.from &&
    agentEmailConfig.receipients &&
    agentEmailConfig.subjectTemplate &&
    agentEmailConfig.bodyTemplate
  );
};
