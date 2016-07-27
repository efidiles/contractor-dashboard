import request from 'axios';

import {
  BASE_API_URL,
  URLS
} from '../config';

import loggerFactory from '../utils/logger';

const logger = loggerFactory('From data-service.dist');

request.defaults.baseURL = BASE_API_URL;

export const saveAppConfig = newData => request.put(URLS.CONFIG.APP, newData);
export const getAppConfig = () => request.get(URLS.CONFIG.APP);
export const getAgentEmailConfig = () => request.get(URLS.CONFIG.AGENT_EMAIL);
export const saveAgentEmailConfig = data => {
  logger.debug('Inside saveAgentEmailConfig');
  logger.trace('data', data);

  return request.put(URLS.CONFIG.AGENT_EMAIL, data);
};

export const sendAgentEmail = data => {
  logger.debug('Inside sendAgentEmail');
  logger.trace('data', data);

  return request.post(URLS.EMAIL, data);
};
