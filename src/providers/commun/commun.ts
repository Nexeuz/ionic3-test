import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';


/*
  Generated class for the CommunProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunProvider {


  constructor(public fire: FirebaseProvider, public alertCtrl: AlertController) {
    console.log('Hello CommunProvider Provider');
  }

	/**
	 * Show a native loading popup in ionic 
	 * @param {string} msg
	 * @returns {Loading} isntancia de la ventana de cargando
	 * @memberOf ComunService
	 */
  communAlert(title: string, msg: string) {
    const ALERT = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons:['Ok']
    });

    ALERT.present();
}

}
