import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider  } from '../../providers/firebase/firebasepro';
import { MainPage } from '../pages'

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  loader: any;
  
  constructor(public app:App, public fire:FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
    
  }

  signInWithEmail() {
    this.navCtrl.push('SignInEmailPage');
  }
  createAccountwithEmail(){
    this.navCtrl.push('CreateAccountEmailPage');
  }

  facebook() {
    this.fire.signInWithFacebook().then((data)=>{
      if(!data){
        const root = this.app.getRootNav();
        root.popToRoot();
        root.setRoot(MainPage);
      }
    });
  }



}
