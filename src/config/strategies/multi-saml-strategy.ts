import { MultiSamlStrategy, Profile, VerifiedCallback } from 'passport-saml';
import setupUser from './setup-user';
import { PassAuthAppConfig } from '../../model/model';
import { SamlOptionsCallback } from 'passport-saml/lib/passport-saml/types';
import { Request } from 'express';

export default function (config: PassAuthAppConfig): MultiSamlStrategy {
  return new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions: (request: Request, done: SamlOptionsCallback) => {
        const { idpId } = request.params;

        const samlConfig = {
          callbackUrl: `https://${request.headers.host}/Shibboleth.sso/SAML2/POST/${idpId}`,
          ...config.passport.multiSaml[idpId],
          ...config.passport.multiSaml.sp,
        };

        return done(null, samlConfig);
      },
    },
    async (req: Request, profile: Profile, done: VerifiedCallback) => {
      return setupUser(req, profile, done, config);
    }
  );
}
