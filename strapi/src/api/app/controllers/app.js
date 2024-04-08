"use strict";

/**
 * app controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

let lastTimeUpdated = null;
let cache = null;

async function updateStates() {
  const service = strapi.service("api::app.app");

  const { results, pagination } = await service.find({ hidden: "false" });

  const requestStack = [];
  // Map through apps and prepare the requests to check if they are actually online
  results.map((app) => {
    if (app.status !== 2) {
      async function request() {
        try {
          const response = await fetch(app.url + "/ping");
          if (response.status === 200) {
            await service.update(app.id, {
              data: {
                status: 3,
              },
            });
            return;
          } else {
            await service.update(app.id, {
              data: {
                status: 0,
              },
            });
            return;
          }
        } catch (err) {
          await service.update(app.id, {
            data: {
              status: 1,
            },
          });
          return;
        }
      }

      requestStack.push(request());
    }
  });

  // Do all requests
  await Promise.all(requestStack);
}

module.exports = createCoreController("api::app.app", ({ strapi }) => ({
  async find(ctx) {
    // This route is cached, and only updates it's data each 20 seconds
    const now = Date.now();
    const _20seconds = 20 * 1000;
    const _20secondsAgo = now - _20seconds;

    const moreThan20SecondsAgo =
      lastTimeUpdated === null || lastTimeUpdated < _20secondsAgo;

    if (!moreThan20SecondsAgo && cache !== null) {
      return cache;
    }

    await updateStates();
    lastTimeUpdated = Date.now();

    // validateQuery throws an error if any of the query params used are inaccessible to ctx.user
    // That is, trying to access private fields, fields they don't have permission for, wrong data type, etc
    await this.validateQuery(ctx);

    // sanitizeQuery silently removes any query params that are invalid or the user does not have access to
    // It is recommended to use sanitizeQuery even if validateQuery is used, as validateQuery allows
    // a number of non-security-related cases such as empty objects in string fields to pass, while sanitizeQuery
    // will remove them completely
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);

    const userFilters = sanitizedQueryParams.filters
      ? sanitizedQueryParams.filters
      : {};

    sanitizedQueryParams.filters = {
      // @ts-ignore
      ...userFilters,
      hidden: "false",
    };
    // Perform whatever custom actions are needed
    const { results, pagination } = await strapi
      .service("api::app.app")
      .find(sanitizedQueryParams);

    // sanitizeOutput removes any data that was returned by our query that the ctx.user should not have access to
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    // transformResponse correctly formats the data and meta fields of your results to return to the API
    cache = this.transformResponse(sanitizedResults, { pagination });
    return cache;
  },
}));
