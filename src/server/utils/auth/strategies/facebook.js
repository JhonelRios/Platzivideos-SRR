const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const boom = require('@hapi/boom');
const axios = require('axios');

const { config } = require('../../../config');

passport.use(
    new FacebookStrategy(
        {
            clientID: config.facebookClientId,
            clientSecret: config.facebookClientSecret,
            callbackURL: '/auth/facebook/callback'
        },
        async (accessToken, refreshToken, profile, cb) => {
            const { data, status } = await axios({
                url: `${config.apiUrl}/api/auth/sign-provider`,
                method: 'post',
                data: {
                    name: profile.displayName,
                    email: profile.email || `${profile.id}@facebook.com`,
                    password: profile.id,
                    apiKeyToken: config.apiKeyToken
                }
            });

            if (!data || status !== 200) {
                return cb(boom.unauthorized(), false);
            }

            return cb(null, data);
        }
    )
);
