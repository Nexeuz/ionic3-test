import { Component } from '@angular/core';
import { App, IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { CommunProvider } from '../../providers/commun/commun';

import { MainPage } from '../pages'


@IonicPage()
@Component({
  selector: 'page-create-account-email',
  templateUrl: 'create-account-email.html',
})
export class CreateAccountEmailPage {

  registrerForm: FormGroup;
  closeObservable: any;

  constructor(public commun: CommunProvider, public app: App, public AlertCrl: AlertController, public loadingCtrl: LoadingController, public fire: FirebaseProvider, public fb: FormBuilder, public navCtrl: NavController) {
    this.buildForm();

    
  }

  ionViewDidLoad() { // antes que carge la vista........

    console.log('ionViewDidLoad CreateAccountEmailPage');
  }

  ionViewWillLeave() {
    this.closeObservable.unsubscribe();
  }

  ionViewCanEnter() {
    
    if(this.fire.authenticated === true) {
      console.log('usuario logeado');

    }

    return !this.fire.authenticated;
  }

  buildForm(): void {
    this.registrerForm = this.fb.group({
      'nombre': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ]
      ],
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
      'password-reconfirm': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
      'terms-and-conditions': [false, [
        CreateAccountEmailPage.mustBeTruthy
      ]
      ],
    });

    this.closeObservable = this.registrerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  static mustBeTruthy(checkbox: AbstractControl): { [key: string]: boolean } {
    const rv: { [key: string]: boolean } = {};
    if (!checkbox.value) {
      rv['notChecked'] = true;
    }
    return rv;
  }

  irTerms() {
    const TERMS = this.AlertCrl.create({
      title: 'Leer terminos y condiciones',
      subTitle: '¿Deseas leer términos y condiciones?',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.navCtrl.push('TermsAndConditionsPage')
          }
        },
        {
          text: 'Cancelar',
        }]
    });

    TERMS.present();



  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.registrerForm) { return; } // creo que es para evitar hacks.
    const form = this.registrerForm;// metemos nuestro formulario en una variable
    for (const field in this.formErrors) { // iteramos el JSON this formsErrors.
      // clear previous error message (if any)
      this.formErrors[field] = ''; // limpiamos los errores si los hay.
      const control = form.get(field); // obtenemos el control por ese campo iterado.
      if (control && control.dirty && control.invalid) { // verificamos si hay control && no esta sucio && no es invalido si alguna de estas codiciones no se cumple no entra aqui, todo tiene que ser true.
        const messages = this.validationMessages[field];// buscamos el mensaje por el campo en el JSON.
        for (const key in control.errors) { // ultimo for para interar los errores por ese control, control.errors retorna un booleano
          this.formErrors[field] += messages[key] + ' '; // buscar el error que concida con el key en true en el JSON formErrors, concaternarlo y asignarlo. 
        }
      }
    }
  }

  formErrors = {
    'nombre': '',
    'email': '',
    'password': ''
  };
  validationMessages = {
    'nombre': {
      'required': 'El nombre es obligatorio.',
      'minlength': 'El nombre debe tener al menos 4 carácteres.',
      'maxlength': 'El nombre no puede tener más de 40 caracteres.',
    },
    'email': {
      'required': 'El correo electrónico es obligatorio.',
      'email': 'El correo electrónico debe ser valido.'
    },
    'password': {
      'required': 'La contraseña es obligatoria.',
      'pattern': 'La contraseña debe tener al menos un número y una letra.',
      'minlength': 'La contraseña debe tener al menos 4 carácteres.',
      'maxlength': 'La contraseña no puede tener más de 40 caracteres.',
    }
  };

  signup() {

    const loader = this.loadingCtrl.create({
      content: 'Un momento por favor te estamos registrando...'
    });
    loader.present();

    const CORREO = this.registrerForm.value.email;
    const PASSWORD = this.registrerForm.value.password;
    const NOMBRE = this.registrerForm.value.nombre;

    this.fire.emailSignUp(NOMBRE, CORREO, PASSWORD).then((data) => {
      if (data) {
        loader.dismiss();
        this.commun.communAlert('A ocurrido un error','El correo introducido ya se encuentra registrado, si olvidaste tu contraseña ve a la sección de Iniciar sesión para recuperarla.')
      } else {
        const root = this.app.getRootNav();
        root.popToRoot();
        root.setRoot(MainPage).then(() => {
          loader.dismiss();
        });
      }
    })
  }

}
