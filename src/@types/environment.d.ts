export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_PORT: string;
      ALLOW_ORIGIN: string;
      ALLOW_METHODS: string;
      AUTH_LOGIN: string;
      AUTH_LOGIN_SUCCESS: string;
      AUTH_LOGIN_FAILURE: string;
      AUTH_LOGOUT: string;
      AUTH_LOGOUT_REDIRECT: string;
      PASS_CORE_API_URL: string;
      PASS_CORE_NAMESPACE: string;
      PASS_UI_URL: string;
      PASS_UI_ROOT_URL: string;
      PASSPORT_STRATEGY: string;
      SAML_ENTRY_POINT: string;
      ACS_URL: string;
      METADATA_URL: string;
      IDENTIFIER_FORMAT: string;
      SAML_ISSUER: string;
      FORCE_AUTHN: string;
    }
  }
}
