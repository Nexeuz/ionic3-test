import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirstRunPage, MainPage, WelcomeInitPage } from '../pages/pages'; // that is introduction page
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  loader: any;

  constructor(private afAuth: AngularFireAuth, public storage: Storage, public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.storage.get('introShown').then((result) => { // con la respuesta de esta promise verificacmos si se ha cargado la aplicación una vez
        if (result) {
          this.afAuth.authState.subscribe(auth => {
            return (!auth) ? this.rootPage = WelcomeInitPage : this.rootPage = MainPage;
          });
        } else {
          this.storage.set('introShown', true); //y ponemos el introShown en true es decir que ya hemos entrado en la app
          this.rootPage = FirstRunPage; // si no vamos a los sliders
        }


      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
