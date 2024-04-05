module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.headers.cookie) {
      const cookieName = process.env.AUTH_COOKIE_NAME;
      const cookie = require("cookie");
      const cookies = cookie.parse(ctx.request.headers.cookie);
      if (cookies[cookieName]) {
        ctx.request.headers["authorization"] = "Bearer " + cookies[cookieName];
      }
    }

    await next();
  };
};
