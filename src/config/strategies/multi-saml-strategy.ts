import { MultiSamlStrategy, Profile, VerifiedCallback } from 'passport-saml';
import setupUser from './setup-user';
import { PassAuthAppConfig } from '../../@types';
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
          // @ts-ignore TODO only available variable is jhu at the moment. We will have to decide wtd.
          ...config.passport.multiSaml[idpId],
          ...config.passport.multiSaml.sp,
        };

        return done(null, samlConfig);
      },
    },
    async (
      req: Request,
      profile: Profile | null | undefined,
      done: VerifiedCallback
    ) => {
      return setupUser(req, profile, done, config);
    }
  );
}
