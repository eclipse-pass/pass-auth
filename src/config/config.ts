import fs from 'fs';
import { PassAuthAppConfig } from '../model/model';

export default function (): PassAuthAppConfig {
  // passport-saml requires the certs to be single line strings in some
  // properties rather than the full cert file.
  const makeSingleLine = (fileData: string) => {
    return fileData
      .replace(/[\n\r]/g, '')
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '');
  };

  let fileData = fs.readFileSync('/run/secrets/idp_cert', 'utf-8');
  const idpCert = makeSingleLine(fileData);

  fileData = fs.readFileSync('/run/secrets/sp_cert', 'utf-8');
  const spCert = makeSingleLine(fileData);

  return {
    app: {
      port: process.env.AUTH_PORT,
      allowOrigin: process.env.ALLOW_ORIGIN,
      allowMethods: process.env.ALLOW_METHODS,
      loginPath: process.env.AUTH_LOGIN,
      loginRedirectSuccess: process.env.AUTH_LOGIN_SUCCESS,
      loginRedirectFailure: process.env.AUTH_LOGIN_FAILURE,
      logoutPath: process.env.AUTH_LOGOUT,
      logoutRedirect: process.env.AUTH_LOGOUT_REDIRECT,
      passCoreUrl: process.env.PASS_CORE_API_URL,
      passCoreNamespace: process.env.PASS_CORE_NAMESPACE,
      passUiUrl: process.env.PASS_UI_URL,
      passUiPath: process.env.PASS_UI_ROOT_URL,
    },

    passport: {
      strategy: process.env.PASSPORT_STRATEGY,
      multiSaml: {
        jhu: {
          entryPoint: process.env.SAML_ENTRY_POINT,
          cert: idpCert,
        },
        sp: {
          acsUrl: process.env.ACS_URL,
          metadataUrl: process.env.METADATA_URL,
          identifierFormat: process.env.IDENTIFIER_FORMAT,
          issuer: process.env.SAML_ISSUER,
          decryptionPvk: fs.readFileSync('/run/secrets/sp_key', 'utf-8'),
          decryptionCert: fs.readFileSync('/run/secrets/sp_cert', 'utf-8'),
          signingCert: spCert,
          forceAuthn: process.env.FORCE_AUTHN,
          signatureAlgorithm: 'sha256',
        },
      },
    },
  };
}
