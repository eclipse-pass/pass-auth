import axios from 'axios';

export default async function (_req, profile, done, config) {
  if (!profile) {
    return done(new Error('Empty SAML profile returned!'));
  }

  // Attributes sent from the pass-docker idp (these may OR may not be the same
  // attributes sent by the actual JHU idp):
  ///  attributes: {

  //   'urn:oid:0.9.2342.19200300.100.1.1': 'nih-user',

  //   'urn:oid:0.9.2342.19200300.100.1.3': 'nihuser@jhu.edu',

  //   'urn:oid:1.3.6.1.4.1.5923.1.1.1.9': 'FACULTY@johnshopkins.edu',

  //   'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': 'FACULTY',

  //   'urn:oid:2.5.4.4': 'Ser',

  //   'urn:oid:2.16.840.1.113730.3.1.241': 'Nihu Ser',

  //   'urn:oid:2.5.4.42': 'Nihu',

  //   'urn:oid:1.3.6.1.4.1.5923.1.1.1.6': 'nih-user@johnshopkins.edu',

  //   'urn:oid:1.3.6.1.4.1.5923.1.1.1.13': 'KYWJIT@johnshopkins.edu',

  //   'urn:oid:2.16.840.1.113730.3.1.3': '00001421'

  // },

  //map of possible profile attributes and display values
  const profileAttrs = {
    'urn:oid:2.16.840.1.113730.3.1.241': 'displayName',
    'urn:oid:1.3.6.1.4.1.5923.1.1.1.9': 'scopedAffiliation',
    'urn:oid:0.9.2342.19200300.100.1.3': 'email',
    'urn:oid:2.16.840.1.113730.3.1.3': 'employeeNumber',
    'urn:oid:1.3.6.1.4.1.5923.1.1.1.1': 'employeeIdType',
    'urn:oid:1.3.6.1.4.1.5923.1.1.1.6': 'eppn',
    'urn:oid:2.5.4.42': 'givenName',
    'urn:oid:2.5.4.4': 'surname',
    'urn:oid:1.3.6.1.4.1.5923.1.1.1.13': 'uniqueId',
    'urn:oid:0.9.2342.19200300.100.1.1': 'uniqueIdType',
  };

  const convertProfileToUser = function (profile) {
    let user = {};
    let niceName;
    let idx;
    let keys = Object.keys(profile);
    let key;

    for (idx = 0; idx < keys.length; ++idx) {
      key = keys[idx];
      niceName = profileAttrs[key];
      if (niceName) {
        user[niceName] = profile[key];
      }
    }

    return user;
  };

  const shibbolethAttrs = convertProfileToUser(profile);

  try {
    const { data: user } = await axios.get(
      `${config.app.passCoreUrl}user/whoami`,
      {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Displayname: shibbolethAttrs.displayName,
          Mail: shibbolethAttrs.email,
          Eppn: shibbolethAttrs.eppn,
          Givenname: shibbolethAttrs.givenName,
          Sn: shibbolethAttrs.surname,
          Affiliation: shibbolethAttrs.scopedAffiliation,
          Employeenumber: shibbolethAttrs.employeeNumber,
          'unique-id': shibbolethAttrs.uniqueId,
          employeeid: shibbolethAttrs.employeeIdType,
        },
      }
    );

    if (!user) {
      return done(null, false, {
        message: 'User not found.',
      });
    }

    return done(null, {
      id: user.id,
      shibbolethAttrs,
    });
  } catch (err) {
    console.log(err);

    return done(null, false, {
      message: err.message,
    });
  }
}
