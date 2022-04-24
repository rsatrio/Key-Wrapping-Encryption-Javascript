
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Button } from 'react-bootstrap';
import { encode } from 'base64-arraybuffer';


function App() {

  var publicKey = null;
  var privateKey = null;    
  var encrypted2 = null;
  var symKey = null;

  function generateAESKey() {

    window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    ).then(a => {

      window.crypto.subtle.exportKey("jwk", a).then(b => {

        symKey = b;        
        document.getElementById('aesKey').value = JSON.stringify(symKey);
      })

    });



  }
  function generateKey() {

    window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    ).then(a => {      
      console.log("Public Key2:", a.publicKey);

      publicKey = a.publicKey;
      privateKey = a.privateKey;
      window.crypto.subtle.exportKey("jwk", a.publicKey).then(b => {

        document.getElementById('pubKey').value = JSON.stringify(b);
      })

    });

  }

  function encrypt() {
    let encrypted1 = window.crypto.subtle.encrypt({
      name: "RSA-OAEP"
    }, publicKey, new TextEncoder().encode(JSON.stringify(symKey)));
    encrypted1.then(a => {
      
      encrypted2 = JSON.stringify(Array.from(new Uint8Array(a)));

      document.getElementById('encryptResult').value = encode(a);      
    })


  }

  function decrypt() {
    window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      new Uint8Array(JSON.parse(encrypted2)).buffer
    ).then(a => {      
      
      let key1 = JSON.parse(new TextDecoder().decode(a));
      document.getElementById('decryptResult').value = JSON.stringify(key1);      

      window.crypto.subtle.importKey("jwk", JSON.parse(
        new TextDecoder().decode(a)), "AES-GCM", true,
        ["encrypt", "decrypt"]).then(a => {
          console.log("Algorithm: " + a.algorithm.name);
        })
    });
  }
  return (
    <div className="App">

      <header className='App-header'>

        <h1 className='text-white mb-2'>Key Wrapping Javascript</h1>
      </header>
      <div className="container">

        <div className="row">
          
          <div className=" d-md-block d-sm-none col-lg-4 "></div>
          

          <div className=" col-lg-4 col-sm-12 pb-5">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <Button className='mt-2' onClick={() => generateAESKey()}>Generate AES Key</Button>
              </div>
              <div className="col-lg-6 col-sm-12">
                <textarea className='mt-2' id="aesKey" rows="6" readOnly="{true}"></textarea>

              </div>
              <div className="col-lg-6 col-sm-12">
                <Button className='mt-2' onClick={() => generateKey()}>Generate RSA Key</Button>
              </div>
              <div className="col-lg-6 col-sm-12">
                <textarea className='mt-2' id="pubKey" rows="6" readOnly="{true}"></textarea>

              </div>
              <div className="col-lg-6 col-sm-12">
                <Button className='mt-2' onClick={() => encrypt()}>Encrypt </Button>
              </div>
              <div className="col-lg-6 col-sm-12">
                <textarea className='mt-2' id="encryptResult" rows="6" readOnly="{true}"></textarea>

              </div>

              <div className="col-lg-6 mt-2 col-sm-12">
                <Button className='mt-2' onClick={() => decrypt()}>Decrypt </Button>
              </div>
              <div className="col-lg-6 col-sm-12">
                <textarea className='mt-2' id="decryptResult" rows="6" readOnly="{true}"></textarea>

              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;
