import multiStrategy from './strategies/multi-saml-strategy';
import { PassportStatic } from 'passport';
import { IIndexable, PassAuthAppConfig } from '../@types';
import { MultiSamlStrategy } from 'passport-saml';

export default function (passport: PassportStatic, config: PassAuthAppConfig) {
  passport.serializeUser(function (user: Express.User, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.deserializeUser(function (user: Express.User, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  const strategies = {
    multiSaml: multiStrategy(config),
  };

  const strategy = (strategies as IIndexable<MultiSamlStrategy>)[
    config.passport.strategy
  ];

  passport.use(strategy);

  return strategy;
}
