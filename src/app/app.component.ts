import { Component, ViewChild  } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirstRunPage, MainPage, WelcomeInitPage } from '../pages/pages'; // that is introduction page
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import {  AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Category {
  nombre_categoria: string;
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  loader: any;

  private categoryCollections: AngularFirestoreCollection<Category>;
  
  categories: Observable<Category[]>;



  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth, public storage: Storage, public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen) {
    
    this.categoryCollections = this.firestore.collection<Category>('categories');
    
    this.categories = this.categoryCollections.valueChanges();

 


    
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


  openCategory(category) {   
    
    this.nav.setRoot(MainPage, {category: category });

  }

}
