import faceIO from '@faceio/fiojs'

const faceio = new faceIO('fioa90ff');


  function enrollNewUser(){
    faceio.enroll({
      "locale": "auto",
      "payload": {
          "whoami": 123456,
          "email": "john.doe@example.com"
          }
      }).then(userInfo => {
          alert(
              `User Successfully Enrolled! Details:
             Unique Facial ID: ${userInfo.facialId}
             Enrollment Date: ${userInfo.timestamp}
             Gender: ${userInfo.details.gender}
             Age Approximation: ${userInfo.details.age}`
          );
         console.log(userInfo);
      }).catch(errCode => {
         handleError(errCode);
      })
    }

async function authenticateUser(){
  await faceio.authenticate({
      "locale": "auto"
  }).then(userData => {
      console.log("Success, user identified")
      console.log("Linked facial Id: " + userData.facialId)
      console.log("Payload: " + JSON.stringify(userData.payload)) 
  }).catch(errCode => {
      handleError(errCode)
  })
}

function handleError(errCode){
    const fioErrs = faceio.fetchAllErrorCodes();
    switch (errCode) {
    case fioErrs.PERMISSION_REFUSED:
        console.log("Access to the Camera stream was denied by the end user");
    break;
    case fioErrs.NO_FACES_DETECTED:
        console.log("No faces were detected during the enroll or authentication process");
    break;
    case fioErrs.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index");
    break;
    case fioErrs.MANY_FACES:
        console.log("Two or more faces were detected during the scan process");
    break;
    case fioErrs.FACE_DUPLICATION:
        console.log("User enrolled previously (facial features already recorded). Cannot enroll again!");
    break;
    case fioErrs.MINORS_NOT_ALLOWED:
        console.log("Minors are not allowed to enroll on this application!");
    break;
    case fioErrs.PAD_ATTACK:
        console.log("Presentation (Spoof) Attack (PAD) detected during the scan process");
    break;
    case fioErrs.FACE_MISMATCH:
        console.log("Calculated Facial Vectors of the user being enrolled do not matches");
    break;
    case fioErrs.WRONG_PIN_CODE:
        console.log("Wrong PIN code supplied by the user being authenticated");
    break;
    default:
      break;
    }
}

export {
    enrollNewUser,
    authenticateUser
};