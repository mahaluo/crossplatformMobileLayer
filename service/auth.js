import * as firebase from "firebase";
import "firebase/firestore";

export async function RegisterUser(email, password) {
  console.log("registering user... ");
  console.log(email);
  console.log(password);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("registered user.. ");
      console.log("credentials: " + email);
    })
    .catch((error) => {
      console.log(error);
      console.log("register error.. ");
    });
}

export async function SignIn(email, password) {
  console.log("signing in user.. ");
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log("user signed in.. ");
      console.log(user.uid);
    })
    .catch(function (error) {
      console.log(error);
      console.log("sign in error.. ");
    });
}
