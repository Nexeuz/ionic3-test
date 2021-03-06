import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BrowserTab } from '@ionic-native/browser-tab';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { FirebaseProvider } from '../providers/firebase/firebasepro';
import { CommunProvider } from '../providers/commun/commun';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FavProvider } from '../providers/fav/fav';





export const firebaseConfig = {
  apiKey: "AIzaSyBEgZQggMH7H2VzWZBJci6ikMm9Iv2GscE",
  authDomain: "nexeuznico.firebaseapp.com",
  databaseURL: "https://nexeuznico.firebaseio.com",
  projectId: "nexeuznico",
  storageBucket: "",
  messagingSenderId: "899182849829"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    HttpModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    FirebaseProvider,
    CommunProvider,
    BrowserTab,
    ThemeableBrowser,
    SocialSharing,
    FavProvider,
    ]
})
export class AppModule {}
