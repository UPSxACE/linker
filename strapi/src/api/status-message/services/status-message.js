'use strict';

/**
 * status-message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::status-message.status-message');
