import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { User } from '../interfaces';


import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';



@Injectable()
export class FirebaseProvider {

  authState: any = null;
  loader: any;
  fbid: any = null;

  
  user: Observable<User>;


  constructor(private firestore: AngularFirestore, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private platform: Platform, private fb: Facebook, public http: Http, public afAuth: AngularFireAuth) {

    this.user = this.afAuth.authState
    .pipe(
      switchMap(
       user => {
      this.authState = user;
      if (user) {
        return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    })
  );


  }
  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    if(this.authState.uid == null) {
      return this.authenticated ? this.authState.user.uid : '';
    }else {
      return this.authenticated ? this.authState.uid : '';
    }
  }

  // Returns current user Facebook UID
  get currentUserFacebookId(): string {
    return this.fbid ? this.fbid : '';
  }


  get currentEmail(): string {
    if (!this.authState.email) {
      return this.authState.user.email;
    } else {
      return this.authState.email;
    }
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    // debugger
    if (!this.authState.displayName) {
      return this.authState.user.displayName;
    } else {
      return this.authState.displayName;
    }

  }

  //// Social Auth ////
  errorAlertFb(titulo: string, subtitulo: string) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['Ok']
    });
    alert.present();
  }
  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Ingresando con Facebook..."
    });
    this.loader.present();

  }

  signInWithFacebook(): any {
    // debugger
    this.presentLoading()
    const cordova = this.platform.is('cordova');
    if (cordova) {// login with  platform android e ios.
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then((data) => {
          this.loader.dismiss();
          this.authState = data;
          this.fbid = data.uid;
          this.updateUserData();
        });
      }).catch((error) => {
        this.loader.dismiss();
        this.errorAlertFb('Error al intentar ingresar por facebook', 'Es posible que hallas cerrado el diálogo para ingresar con Facebook.')
        return console.log(error);
        ;
      });
    } else { // login with web.
      return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.loader.dismiss();
          this.authState = res;
          this.fbid = res.user.uid;
          this.updateUserData();
        }
        ).catch((err) => {
          this.loader.dismiss();
          this.errorAlertFb('Error al intentar ingresar por Facebook', 'Es posible que hallas cerrado el diálogo para ingresar con Facebook.')
          return console.log(err);

        });

    }
  };

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }


  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(nombre: string, email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      this.authState = user
      this.updateUserData(nombre);
    }).catch(error => {
      return error
    });
  }

  emailLogin(email: string, password: string) {
    // debugger
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(data => {
         this.authState = data; 
    }).catch(error => {
        console.log(error);
        return error;
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => { return error })
  }


  //// Sign Out ////

  signOut() {
    return this.afAuth.auth.signOut();
  }



  //// Helpers ////

  private updateUserData(nombre?: string) {

    if (!nombre) {
      const userRef = this.firestore.doc(`users/${this.currentUserId}`).ref; // estoy creando una referencia o apuntando a ellla si no existe.

      userRef.get().then(doc => {
        if (doc.exists) {

        } else {
          const user: User = {
            uid: this.currentUserId,
            name: this.currentUserDisplayName,
            admin: false,
            email: this.currentEmail
          }
          userRef.set(user);
        }
      });
    } else {

      const userRef = this.firestore.doc(`users/${this.currentUserId}`).ref; // estoy creando una referencia o apuntando a ellla si no existe.
      
      userRef.get().then(() => {
        const user: User = {
          uid:  this.currentUserId,
          name:  nombre,
          admin: false,
          email: this.currentEmail
        }
        userRef.set(user);
      })
    }
  }


}
