import { Component, ViewChild  } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirstRunPage, MainPage, WelcomeInitPage } from '../pages/pages'; // that is introduction page
import { Storage } from '@ionic/storage';
import {  AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FirebaseProvider } from '../providers/firebase/firebasepro';

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
  
   public categories: Observable<Category[]>;



  constructor(private fireS:FirebaseProvider, private firestore: AngularFirestore, public storage: Storage, public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen) {
    
    this.categoryCollections = this.firestore.collection<Category>('categories');
    
    this.categories = this.categoryCollections.valueChanges();

 


    
      this.storage.get('introShown').then((result) => { // con la respuesta de esta promise verificacmos si se ha cargado la aplicación una vez
        if (result) {
        //  debugger
         this.fireS.user.subscribe(data => {
           if(data) {
             this.rootPage = MainPage;

           }else {
             this.rootPage = WelcomeInitPage;
           }
         })
       
        } else {
          this.storage.set('introShown', true); //y ponemos el introShown en true es decir que ya hemos entrado en la app
          this.rootPage = FirstRunPage; // si no vamos a los sliders
        }

        this.platformReady()


    });
  }


  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      // this.statusBar.styleDefault();
    });
  }

  openCategory(category) {   
    
    this.nav.setRoot(MainPage, {category: category });

  }

}
