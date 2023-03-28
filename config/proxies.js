const ensureAuthenticated = require('../middleware/ensure-auth');

module.exports = function (app, apiProxy, config) {
  app.all(
    `/${config.app.passCoreNamespace}*`,
    ensureAuthenticated,
    function (req, res) {
      apiProxy.web(req, res, { target: config.app.passCoreUrl });
    }
  );

  app.all(
    `${config.app.passUiPath}*`,
    ensureAuthenticated,
    function (req, res) {
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
  apiProxy.on('proxyReq', function (proxyReq, req) {
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

    // this is necessary because the bodyParser middleware and http-proxy
    // do not play well together with POST requests
    // https://github.com/http-party/node-http-proxy/issues/180
    // Updated note: this seems to not be necessary with all posts, but might be
    // required for things like the file service
    //   if (req.body) {
    //     let bodyData = JSON.stringify(req.body);
    //     // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    //     proxyReq.setHeader('Content-Type', 'application/json');
    //     proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    //     // stream the content
    //     proxyReq.write(bodyData);
    //   }
  });

  app.all('/pass-user-service/*', ensureAuthenticated, function (req, res) {
    apiProxy.web(req, res, { target: config.app.serviceUrls.userServiceUrl });
  });

  app.all('/schemaservice/*', ensureAuthenticated, function (req, res) {
    apiProxy.web(req, res, { target: config.app.serviceUrls.schemaServiceUrl });
  });

  app.all('/policyservice/*', ensureAuthenticated, function (req, res) {
    apiProxy.web(req, res, { target: config.app.serviceUrls.policyServiceUrl });
  });

  // This points to the doi service in core
  app.all('/doi/journal', ensureAuthenticated, function (req, res) {
    apiProxy.web(req, res, { target: config.app.serviceUrls.doiServiceUrl });
  });

  app.all('/doi/manuscript', ensureAuthenticated, function (req, res) {
    apiProxy.web(req, res, {
      target: config.app.serviceUrls.downloadServiceUrl,
    });
  });
};
