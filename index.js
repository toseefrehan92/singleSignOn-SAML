const express = require('express');
const saml2 = require('saml2-js');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/sso/saml/redirecturl', (req, res) => {
  try {
    const idpOptions = {
      allow_unencrypted_assertion: true,
      certificates: [process.env.samlConfig.certificate,],
      entity_id: process.env.samlConfig.entity_id,
      sso_login_url: process.env.samlConfig.sso_login_url,
      sso_logout_url: process.env.samlConfig.sso_logout_url,
    };
    const spOptions = {
      allow_unencrypted_assertion: true,
      assert_endpoint: process.env.samlConfig.assert_endpoint,
      certificate: process.env.samlConfig.certificate,
      entity_id: process.env.samlConfig.entity_id,
      responseType: 'id_token code',
    };
    const idp = new saml2.IdentityProvider(idpOptions);
    const sp = new saml2.ServiceProvider(spOptions);
    sp.create_login_request_url(idp, { 
      // relay_state: 'Any String' // This is optional you can send this if you want this in callback
     }, async (err, loginUrl) => {
      if (err != null) {
        reject(err);
      }
      const response = {
        redirect: true,
        redirectUrl: loginUrl,
      };
      res.send(response)
    }
    );
  } catch (error) {
    throw error;
  }
})


// This api will be used to add in Identity Provider you are configuring

app.post('/sso/saml/assert', (req, res) => {
  try {
    const idpOptions = {
      allow_unencrypted_assertion: true,
      certificates: [process.env.samlConfig.certificate,],
      entity_id: process.env.samlConfig.entity_id,
      sso_login_url: process.env.samlConfig.sso_login_url,
      sso_logout_url: process.env.samlConfig.sso_logout_url,
    };
    const spOptions = {
      allow_unencrypted_assertion: true,
      assert_endpoint: process.env.samlConfig.assert_endpoint,
      certificate: process.env.samlConfig.certificate,
      entity_id: process.env.samlConfig.entity_id,
      responseType: 'id_token code',    
    };
    const idp = new saml2.IdentityProvider(idpOptions);
    const sp = new saml2.ServiceProvider(spOptions);

    const options = { request_body: payload.body }

    sp.post_assert(idp, options, async (err, samlResponse) => {
      if (err) {
        reject(err);
      } else {
            // Verify your payload here for incoming user
            const url = 'https://www.aapUrl.com';
            const loginData = {
              redirect: true,
              redirectUrl: url,
            };
            res.send(loginData)

          .catch((err) => {
            return err;
          });
      }
    });

  } catch (error) {
    throw error;
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})