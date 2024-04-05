// @ts-nocheck
const utils = require("@strapi/utils");
const { getService } = require("../users-permissions/utils");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const {
  validateCallbackBody,
  validateRegisterBody,
} = require("../users-permissions/controllers/validation/auth");
const { concat, compact, isArray } = require("lodash/fp");
const {
  contentTypes: { getNonWritableAttributes },
} = require("@strapi/utils");

const { setMaxListeners } = require("process");
const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

// issue a JWT
const issueJWT = (payload, jwtOptions = {}) => {
  _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
  return jwt.sign(
    _.clone(payload.toJSON ? payload.toJSON() : payload),
    strapi.config.get("plugin.users-permissions.jwtSecret"),
    jwtOptions
  );
};

// verify the refreshToken by using the REFRESH_SECRET from the .env
const verifyRefreshToken = (token) => {
  return new Promise(function (resolve, reject) {
    jwt.verify(
      token,
      process.env.REFRESH_SECRET,
      {},
      function (err, tokenPayload = {}) {
        if (err) {
          return reject(new Error("Invalid token."));
        }
        resolve(tokenPayload);
      }
    );
  });
};

// issue a Refresh token
const issueRefreshToken = (payload, jwtOptions = {}) => {
  _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
  return jwt.sign(
    _.clone(payload.toJSON ? payload.toJSON() : payload),
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

module.exports = (plugin) => {
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;
    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });
    const grantProvider = provider === "local" ? "email" : provider;
    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }
    if (provider === "local") {
      await validateCallbackBody(params);
      const { identifier } = params;
      // Check if the user exists.
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            provider,
            $or: [
              { email: identifier.toLowerCase() },
              { username: identifier },
            ],
          },
        });
      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }
      if (!user.password) {
        throw new ValidationError("Invalid identifier or password");
      }
      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );
      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      } else {
        const jwt = issueJWT(
          { id: user.id },
          { expiresIn: process.env.JWT_SECRET_EXPIRES }
        );

        ctx.cookies.set(
          process.env.REFRESH_TOKEN_NAME,
          issueRefreshToken({ id: user.id }),
          {
            httpOnly: true,
            secure: false,
            signed: true,
            overwrite: true,
            domain: process.env.COOKIE_DOMAIN,
            expires: new Date(
              Date.now() + Number(process.env.REFRESH_COOKIE_EXPIRES)
            ),
          }
        );
        ctx.cookies.set(process.env.AUTH_COOKIE_NAME, jwt, {
          httpOnly: true,
          secure: false,
          signed: true,
          overwrite: true,
          domain: process.env.COOKIE_DOMAIN,
          expires: new Date(
            Date.now() + Number(process.env.AUTH_COOKIE_EXPIRES)
          ),
        });
        ctx.send({
          status: "Authenticated",
          jwt,
          user: await sanitizeUser(user, ctx),
        });
      }
      const advancedSettings = await store.get({ key: "advanced" });
      const requiresConfirmation = _.get(
        advancedSettings,
        "email_confirmation"
      );
      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError("Your account email is not confirmed");
      }
      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }
      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }
    // Connect the user with a third-party provider.
    try {
      // FIXME add cookies code when using third-party providers too
      const user = await getService("providers").connect(provider, ctx.query);
      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };

  plugin.controllers.auth["refreshToken"] = async (ctx) => {
    const store = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });
    const refreshToken = ctx.request.body[process.env.REFRESH_TOKEN_NAME];
    let refreshCookie = ctx.cookies.get(process.env.REFRESH_TOKEN_NAME);

    if (!refreshCookie && !refreshToken) {
      return ctx.badRequest("No Authorization");
    }
    if (!refreshCookie) {
      if (refreshToken) {
        refreshCookie = refreshToken;
      } else {
        return ctx.badRequest("No Authorization");
      }
    }
    try {
      const obj = await verifyRefreshToken(refreshCookie);
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id: obj.id } });
      if (!user) {
        throw new ValidationError("Invalid identifier or password");
      }
      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        throw new ApplicationError("Your account email is not confirmed");
      }
      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }
      const jwt = issueJWT(
        { id: user.id },
        { expiresIn: process.env.JWT_SECRET_EXPIRES }
      );

      ctx.cookies.set(
        process.env.REFRESH_TOKEN_NAME,
        issueRefreshToken({ id: user.id }),
        {
          httpOnly: true,
          secure: false,
          signed: true,
          overwrite: true,
          domain: process.env.COOKIE_DOMAIN,
          expires: new Date(
            Date.now() + Number(process.env.REFRESH_COOKIE_EXPIRES)
          ),
        }
      );
      ctx.cookies.set(process.env.AUTH_COOKIE_NAME, jwt, {
        httpOnly: true,
        secure: false,
        signed: true,
        overwrite: true,
        domain: process.env.COOKIE_DOMAIN,
        expires: new Date(Date.now() + Number(process.env.AUTH_COOKIE_EXPIRES)),
      });
      ctx.send({
        status: "Authenticated",
        jwt,
      });
    } catch (err) {
      return ctx.badRequest(err.toString());
    }
  };

  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore.get({ key: "advanced" });

    if (!settings.allow_register) {
      throw new ApplicationError("Register action is currently disabled");
    }

    const { register } = strapi.config.get("plugin.users-permissions");
    const alwaysAllowedKeys = ["username", "password", "email"];
    const userModel = strapi.contentTypes["plugin::users-permissions.user"];
    const { attributes } = userModel;

    const nonWritable = getNonWritableAttributes(userModel);

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        isArray(register?.allowedFields)
          ? // Note that we do not filter allowedFields in case a user explicitly chooses to allow a private or otherwise omitted field on registration
            register.allowedFields // if null or undefined, compact will remove it
          : // to prevent breaking changes, if allowedFields is not set in config, we only remove private and known dangerous user schema fields
            // TODO V5: allowedFields defaults to [] when undefined and remove this case
            Object.keys(attributes).filter(
              (key) =>
                !nonWritable.includes(key) &&
                !attributes[key].private &&
                ![
                  // many of these are included in nonWritable, but we'll list them again to be safe and since we're removing this code in v5 anyway
                  // Strapi user schema fields
                  "confirmed",
                  "blocked",
                  "confirmationToken",
                  "resetPasswordToken",
                  "provider",
                  "id",
                  "role",
                  // other Strapi fields that might be added
                  "createdAt",
                  "updatedAt",
                  "createdBy",
                  "updatedBy",
                  "publishedAt", // d&p
                  "strapi_reviewWorkflows_stage", // review workflows
                ].includes(key)
            )
      )
    );

    const params = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: "local",
    };

    await validateRegisterBody(params);

    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi
      .query("plugin::users-permissions.user")
      .count({
        where: { ...identifierFilter, provider },
      });

    if (conflictingUserCount > 0) {
      throw new ApplicationError("Email or Username are already taken");
    }

    if (settings.unique_email) {
      const conflictingUserCount = await strapi
        .query("plugin::users-permissions.user")
        .count({
          where: { ...identifierFilter },
        });

      if (conflictingUserCount > 0) {
        throw new ApplicationError("Email or Username are already taken");
      }
    }

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      confirmed: !settings.email_confirmation,
    };

    const user = await getService("user").add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await getService("user").sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService("jwt").issue(
      _.pick(user, ["id"], { expiresIn: process.env.JWT_SECRET_EXPIRES })
    );

    ctx.cookies.set(
      process.env.REFRESH_TOKEN_NAME,
      issueRefreshToken({ id: user.id }),
      {
        httpOnly: true,
        secure: false,
        signed: true,
        overwrite: true,
        domain: process.env.COOKIE_DOMAIN,
        expires: new Date(
          Date.now() + Number(process.env.REFRESH_COOKIE_EXPIRES)
        ),
      }
    );
    ctx.cookies.set(process.env.AUTH_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: false,
      signed: true,
      overwrite: true,
      domain: process.env.COOKIE_DOMAIN,
      expires: new Date(Date.now() + Number(process.env.AUTH_COOKIE_EXPIRES)),
    });
    ctx.send({
      status: "Authenticated",
      jwt,
      user: await sanitizeUser(user, ctx),
    });
  };

  // api/token/refresh
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/token/refresh",
    handler: "auth.refreshToken",
    config: {
      policies: [],
      prefix: "",
    },
  });

  return plugin;
};
