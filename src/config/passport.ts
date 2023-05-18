import multiStrategy from './strategies/multi-saml-strategy';
import { PassportStatic } from 'passport';
import { PassAuthAppConfig } from '../@types';

export default function (passport: PassportStatic, config: PassAuthAppConfig) {
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
