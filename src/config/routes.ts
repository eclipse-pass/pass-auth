import { Application, Request, RequestHandler, Response } from 'express';
import { PassportStatic } from 'passport';
import { PassAuthAppConfig } from '../@types';
import { MultiSamlStrategy } from 'passport-saml';

export default function (
  app: Application,
  passport: PassportStatic,
  config: PassAuthAppConfig,
  strategy: MultiSamlStrategy,
  urlencodedParser: RequestHandler
): void {
  app.get(
    config.app.loginPath,
    passport.authenticate('saml', {
      successRedirect: config.app.loginRedirectSuccess,
      failureRedirect: config.app.loginRedirectFailure,
      scope: ['email profile'],
    })
  );

  app.get(config.app.logoutPath, function (req: Request, res: Response) {
    // TODO check this for logout
    // @ts-ignore
    req.logout();
    res.redirect(config.app.logoutRedirect);
  });

  app.post(
    config.passport.multiSaml.sp.acsUrl,
    urlencodedParser,
    passport.authenticate('saml', {
      successRedirect: config.app.loginRedirectSuccess,
      failureRedirect: config.app.loginRedirectFailure,
    })
  );

  app.get('/authenticated', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.status(200).send({
        user: req.user,
      });
    } else {
      res.status(401).send('You are not authenticated');
    }
  });

  app.get(
    config.passport.multiSaml.sp.metadataUrl,
    function (req: Request, res: Response) {
      const decryptionCert = config.passport.multiSaml.sp.decryptionCert;
      const signingCert = config.passport.multiSaml.sp.signingCert;

      strategy.generateServiceProviderMetadata(
        req,
        decryptionCert,
        signingCert,
        (_, meta) => {
          res.type('application/xml');
          res.status(200).send(meta);
        }
      );
    }
  );
}
