import ensureAuthenticated from '../middleware/ensure-auth.js';
import { Application, Request, Response } from 'express';
import httpProxy from 'http-proxy';
import { PassAuthAppConfig } from '../model/model';
import { ClientRequest, IncomingMessage } from 'http';

export default function (
  app: Application,
  apiProxy: httpProxy,
  config: PassAuthAppConfig
) {
  app.all(
    `/${config.app.passCoreNamespace}*`,
    ensureAuthenticated,
    function (req: Request, res: Response) {
      apiProxy.web(req, res, { target: config.app.passCoreUrl });
    }
  );

  app.all(
    `${config.app.passUiPath}*`,
    ensureAuthenticated,
    function (req: Request, res: Response) {
      apiProxy.web(req, res, { target: config.app.passUiUrl });
    }
  );

  /////////////////////////////////// PROXIED SERVICES IN PASS DOCKER ///////////////////////////////

  /**
   * This 'proxyReq' section was intended for use with the User Service
   * Commented out for now until the service is ported to the new v2 infra,
   * at which point it should be properly scoped to the service's route
   * The mapping may also be helpful for the future port/impl
   */
  apiProxy.on(
    'proxyReq',
    function (proxyReq: ClientRequest, req: IncomingMessage) {
      // @ts-ignore TODO check this for user prop
      const user = req.user;

      proxyReq.setHeader('Displayname', user.shibbolethAttrs.displayName);
      proxyReq.setHeader('Mail', user.shibbolethAttrs.email);
      proxyReq.setHeader('Eppn', user.shibbolethAttrs.eppn);
      proxyReq.setHeader('Givenname', user.shibbolethAttrs.givenName);
      proxyReq.setHeader('Sn', user.shibbolethAttrs.surname);
      proxyReq.setHeader('Affiliation', user.shibbolethAttrs.scopedAffiliation);
      proxyReq.setHeader('Employeenumber', user.shibbolethAttrs.employeeNumber);
      proxyReq.setHeader('unique-id', user.shibbolethAttrs.uniqueId);
      proxyReq.setHeader('employeeid', user.shibbolethAttrs.employeeIdType);

      // warning: bodyParser middleware and http-proxy
      // do not play well together with POST requests
      // see this issue if bodyParser usage becomes global and we
      // need to operate on post bodies
      // https://github.com/http-party/node-http-proxy/issues/180
    }
  );

  app.all(
    '/schema',
    ensureAuthenticated,
    function (req: Request, res: Response) {
      apiProxy.web(req, res, { target: config.app.passCoreUrl });
    }
  );

  app.all(
    '/policy*',
    ensureAuthenticated,
    function (req: Request, res: Response) {
      apiProxy.web(req, res, { target: config.app.passCoreUrl });
    }
  );

  app.all('/doi*', ensureAuthenticated, function (req: Request, res: Response) {
    apiProxy.web(req, res, { target: config.app.passCoreUrl });
  });

  app.all('/file*', function (req: Request, res: Response) {
    apiProxy.web(req, res, {
      target: config.app.passCoreUrl,
    });
  });
}
