'use strict';

/**
 * status-message router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::status-message.status-message');
