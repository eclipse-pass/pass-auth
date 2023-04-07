import { MultiSamlStrategy } from 'passport-saml';
import setupUser from './setup-user.js';

export default function (config) {
  return new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions: (request, done) => {
        const { idpId } = request.params;

        const samlConfig = {
          callbackUrl: `https://${request.headers.host}/Shibboleth.sso/SAML2/POST/${idpId}`,
          ...config.passport.multiSaml[idpId],
          ...config.passport.multiSaml.sp,
        };

        return done(null, samlConfig);
      },
    },
    async (req, profile, done) => {
      return setupUser(req, profile, done, config);
    }
  );
}
