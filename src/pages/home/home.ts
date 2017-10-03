import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { FirebaseProvider  } from '../../providers/firebase/firebasepro';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  nombre;
  admin;

  users: Observable<any[]>;
  home;
  isAdmin;

  constructor(private db: AngularFireDatabase, public fire:FirebaseProvider, public navCtrl: NavController) {

  }

  ionViewDidLoad(){
    this.users = this.db.object(`/users/${this.fire.currentUserId}`);

    this.users.subscribe((data)=>{
      this.home = data;

      if(this.home.admin===true){
        this.isAdmin = 'Sí.';
      }else{
        this.isAdmin = 'No.';
      }
    });





  
  }

}
