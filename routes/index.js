var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { route } = require('express/lib/application');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// generates a private & public key encoded to our specs - there are DOZENS of ways to encode the keys - this is a problem
router.get('/generate-key-pair', (req, res) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // key size in bits
    publicKeyEncoding: {
      type: 'spki',
      format: 'der'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der'
    },
  })

  res.send({ publicKey: publicKey.toString('base64'), privateKey: privateKey.toString('base64') })
})


// get signature generated with private key
router.post('/sign', (req, res) => {
  const data = req.body.data; // data would be the PDF
  let privateKey = req.body.privateKey

  // decode private key from base64
  privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKey, 'base64'),
    type: 'pkcs8', // type and format must be the same as what was initially used for generating the private key
    format: 'der'
  })

  const sign = crypto.createSign('sha256');
  sign.update(data); // digitally sign pdf
  sign.end();

  const signature = sign.sign(privateKey).toString('base64');

  res.send({ signature, data })
})

// verify signature using public key
router.post('/verify', (req, res) => {
  let { data, publicKey, signature } = req.body;

  publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKey, 'base64'),
    type: 'spki', // type and format must be the same as what was initially used for generating the public key
    format: 'der'
  })

  const verify = crypto.createVerify('SHA256')
  verify.update(data)
  verify.end()

  const result = verify.verify(publicKey, Buffer.from(signature, 'base64'))

  res.send({ verify: result })
})

module.exports = router;
