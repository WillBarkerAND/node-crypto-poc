Manual signing proof of concept using Node Crypto

To run: `npm start` - reset manually upon any changes. PORT is 3000

This is a basic API to act as a proof of concept that we can generate key pairs, sign data digitally and verify that signature using a basic API and node crypto.

In `routes/index` you will find 3 endpoints

- GET `/generate-key-pair` returns a public & private key generated using rsa and hardcoded types and formats and base64 encoded. There are a LOT of different types of encoding algorithms that could possibly be used here. This creates a problem for us when it comes to consuming keys as we have to know which protocol was used. We can either hardcode them or accept them as arguments.

- POST `/sign` Endpoint for digitally signing data. Takes data in the body (this would be the PDF that needs signing) as well as the generated private key. Here we use the private key to create a signature using SHA256 and update the data/pdf with the digital signature and return the newly signed data and the signature.

- POST `/verify` Endpoint for verifying a digital signature. Receives the data/document, the generated public key and the previously generated signature. The crypto module comes with a `verify` method that once instatiated with, in this case, SHA256 - can be used to verify data passed in using `verify.update(data)`. It then uses a `.verify` method using the public key and signature to determine whether everything matches and whether the signature is valid. `verify.verify(publicKey, signature)`


Conclusion

This is a significanly more manual approach and would involve more "hoops" however this also allows us to fully control the validity of data coming in.