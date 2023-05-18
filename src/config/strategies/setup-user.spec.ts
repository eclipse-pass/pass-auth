import { describe, expect, test } from '@jest/globals';
import { PassAuthUser, UserShibbolethAttrs } from '../../@types';

describe('setup-user', () => {
  test('test pass user', () => {
    const shibbolethAttrs: UserShibbolethAttrs = {
      displayName: 'testdn',
      email: 'testem',
      eppn: 'testen',
      givenName: 'testgn',
      surname: 'testsn',
      scopedAffiliation: 'testsa',
      employeeNumber: 'testen',
      uniqueId: 'testuid',
      employeeIdType: 'testeit',
    };

    const testUser: PassAuthUser = {
      id: 'testId',
      shibbolethAttrs,
    };

    expect(testUser.shibbolethAttrs.email).toEqual('testem');
  });
});
