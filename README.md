## Description

An authentication service to be used with the Eclipse PASS project.

## Usage

```bash
$ yarn
$ yarn run start
```

## Building

The only build step required is to bundle this service as a Docker image, which can be done with an yarn command:

```
yarn build
```

This will create a new `ghcr.io/eclipse-pass/pass-auth` image with a tag matching the version number in `package.json`

## Configuration

Environment variables are as follows:

- `AUTH_PORT` - port to serve the express server on,
- `AUTH_LOGIN` - express route that generates an authn request to the IDP (default: "/login/:idpId"),
- `AUTH_LOGIN_SUCCESS` - pass-ui route this service will redirect to after a successful authentication,
- `AUTH_LOGIN_FAILURE` - URL this service will redirect to after an unsuccessful authentication,
- `AUTH_LOGOUT` - express route that destroys the express session,
- `AUTH_LOGOUT_REDIRECT` - URL this service will redirect to after a logout,
- `PASS_CORE_API_URL` - URI of pass-core,
- `PASS_CORE_NAMESPACE` - name space of pass-core,
- `PASS_UI_URL` - base URL of pass-ui,
- `PASS_UI_ROOT_URL` - root URL of pass-ui,
- `FCREPO_URL` - base URL of FCREPO,
- `USER_SERVICE_URL` - base URL of the user service,
- `ELASTIC_SEARCH_URL` - base URL of the elastic search service,
- `SCHEMA_SERVICE_URL` - base URL of the schema service,
- `POLICY_SERVICE_URL` - base URL of the policy service,
- `DOI_SERVICE_URL` - base URL of the DOI service,
- `DOWNLOAD_SERVICE_URL` - base URL of the download service,
- `PASSPORT_STRATEGY` - the passport strategy,
- `SAML_ENTRY_POINT` - the IDP's url at which authn requests can be fired,
- `ACS_URL` - the assertion consumer service URL where the IDP will fire SAML requests (default: "/Shibboleth.sso/SAML2/POST/:idpId"),
- `METADATA_URL` - the URL where the SP metadata can be retrieved (default: "/metadata/:idpId"),
- `IDENTIFIER_FORMAT` - identifierFormat: optional name identifier format to request from identity provider (default: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress),
- `SAML_ISSUER` - identifier for the issuer/SP provided to the IDP,
- `FORCE_AUTHN` - the initial SAML request from the service provider specifies that the IdP should force re-authentication of the user, even if they possess a valid session (default: true)

## License

Licensed under the Apache license
