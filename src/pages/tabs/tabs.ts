import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Card, User } from '../../providers/interfaces';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { Observable } from "rxjs/observable";



@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root =  Tab1Root;
  tab2Root = Tab2Root;

  categoria: any;


  private UserCollection: AngularFirestoreCollection<Card>;
  public cardsUsers: Observable<Card[]>;

  constructor(private firestore: AngularFirestore, private fire: FirebaseProvider, public params: NavParams) {
  
  }

  ionViewDidLoad() {
    
      this.cardsUsers = this.fire.afAuth.authState.switchMap(data => {
            this.UserCollection = this.firestore.collection<User>('users').doc(data.uid).collection('saved_cards');
            return this.UserCollection.valueChanges();
          });  


   
  }


  // ionViewCanEnter(): Observable<boolean> {


  //   const verifyauth =  this.fire.afAuth.authState.map(data => {
  //     if(data) {
  //       return true;
  //     }else {
  //       console.log('Usuario debe estar logeado primero');
  //       return false;
        
  //     }
  //    });
 
  //   return verifyauth;
  // }


}
