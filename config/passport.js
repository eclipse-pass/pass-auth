import multiStrategy from './strategies/multi-saml-strategy.js';

export default function (passport, config) {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  const strategies = {
    multiSaml: multiStrategy(config),
  };

  const strategy = strategies[config.passport.strategy];

  passport.use(strategy);

  return strategy;
}
