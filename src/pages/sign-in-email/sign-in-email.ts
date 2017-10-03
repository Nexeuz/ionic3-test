import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { CommunProvider } from '../../providers/commun/commun';

import { MainPage } from '../pages'

@IonicPage()
@Component({
  selector: 'page-sign-in-email',
  templateUrl: 'sign-in-email.html',
})
export class SignInEmailPage {

  displayName;
  myForm: FormGroup;
  constructor(public app: App, public commun: CommunProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public fire: FirebaseProvider, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    this.myForm = fb.group({
      'correo': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }


  SubmitForm() {
    // debugger

    const loader = this.loadingCtrl.create({
      content: 'Iniciando sesión...'
    });

    loader.present();



    const EMAIL = this.myForm.value.correo;
    const PASSWORD = this.myForm.value.password;

    this.fire.emailLogin(EMAIL, PASSWORD).then(data => {
      debugger
      if (data.email) {
        const root = this.app.getRootNav();
        root.popToRoot();
        root.setRoot(MainPage).then(() => {
          loader.dismiss();
        });
      } else {
          switch (data.code) {
            case 'auth/wrong-password': {
              this.commun.communAlert('Error al intentar iniciar sesión', 'La contraseña es incorrecta o el usuario no tiene contraseña.');
              break
            }
            case 'auth/user-not-found':{
              this.commun.communAlert('Error al intentar iniciar sesión', 'El correo ingresado no existe.');              
            }

          }

        loader.dismiss();
      }
    })

  }

  resetPassword() {
    const alert = this.alertCtrl.create({
      title: 'Confirmar Acción',
      message: '¿Deseas que enviemos un correo electrónico a '+this.myForm.value.correo+' para restablecer tu contraseña?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.fire.resetPassword(this.myForm.value['correo'])
            .then(() => this.commun.communAlert('¡Formulario de recuperación de contraseña enviado!','Hemos enviado un correo electrónico a '+this.myForm.value.correo+' con un formulario para restablecer tu contraseña.'))
          }
        },
      ]
    });
    alert.present();

  }


}
