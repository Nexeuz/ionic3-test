import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { Platform, AlertController, LoadingController } from 'ionic-angular';


@Injectable()
export class FirebaseProvider {

  authState: any = null;
  fbid: any = null;
  loader:any;

  constructor(public loadingCtrl:LoadingController, public alertCtrl:AlertController, private platform: Platform, private fb: Facebook, public http: Http, private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe((data) => {
      this.authState = data;
    })
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
    return this.authenticated ? this.authState['uid'] : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest'
    } else if (this.currentUserAnonymous) {
      return 'Anonymous'
    } else {
      return this.authState['displayName'] || 'User without a Name'
    }
  }

  //// Social Auth ////
  errorAlertFb(titulo: string, subtitulo: string){
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
    if (this.platform.is('cordova')) {// login with  platform android e ios.
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
        this.errorAlertFb('Error al intentar ingresar por facebook','Es posible que hallas cerrado el diálogo para ingresar con Facebook.')
        return error;
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
          this.errorAlertFb('Error al intentar ingresar por Facebook','Es posible que hallas cerrado el diálogo para ingresar con Facebook.')
          return err;

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
    // debugger
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {

        this.authState = user
        this.updateUserData(nombre)
      }).catch(error => {
        return error
      });
  }

  emailLogin(email: string, password: string) {
   return  this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////

  signOut() {
    return this.afAuth.auth.signOut();
  }



  //// Helpers ////

  private updateUserData(nombre?: string): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    // debugger
    if (!nombre) {
      const IFEXIST = this.db.list(`/users/${this.fbid}`).subscribe((data) => {
        if (data.length == 0) {
          const path = `users/${this.currentUserId}`; // Endpoint on firebase
          const data = {
            email: this.authState['email'],
            nombre: this.authState['displayName'],
            admin: false
          }
          this.db.object(path).update(data).then(() => {
            IFEXIST.unsubscribe();
          }).catch(error => console.log(error));
        } else {
          IFEXIST.unsubscribe()
        }
      })
    } else {
      const path = `users/${this.currentUserId}`; // Endpoint on firebase
      const data = {
        email: this.authState['email'],
        nombre: nombre,
        admin: false
      }
      this.db.object(path).update(data).catch(error => console.log(error));
    }
  }
}
