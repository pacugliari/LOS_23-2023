import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Usuario } from 'src/app/models/usuario';
import { EmailService } from 'src/app/services/email.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  
  public usuario : Usuario =new Usuario();
  cargando : boolean = false;
  mostrar : boolean = false;

  userForm = this.fb.group({
    usuario: ['', [Validators.required]],
    clave: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioSrv: UsuarioService,
    private emailService:EmailService
  ) {
    
  }

  async ngOnInit() {

    /*this.emailService.enviarMail("los23.email@gmail.com","PROBANDO SERVICIO","PROBANDO SERVICIO").subscribe((resultado)=>{
      console.log(resultado);
    })*/
  }



async onLogin() {
  this.cargando = true;
  this.usuario.usuario = this.userForm.value.usuario ? this.userForm.value.usuario : "";
  this.usuario.clave = this.userForm.value.clave ? this.userForm.value.clave : "";
  this.userForm.reset();

  let esValido = await this.usuarioSrv.verificarUsuario(this.usuario);
  this.cargando = false;

  if (esValido){
    const usuarioLogueado = this.usuarioSrv.getUsuarioLogueado();
    if (usuarioLogueado.tipo === "cocinero" || usuarioLogueado.tipo === "bartender") {
      this.router.navigate(['homeEmpleado'], { replaceUrl: true });
    }else if (usuarioLogueado.tipo === "duenio" || usuarioLogueado.tipo === "supervisor"){
      this.router.navigate(['home'], { replaceUrl: true });
    }else if (usuarioLogueado.tipo === "cliente"){
      this.router.navigate(['homeCliente'], { replaceUrl: true });
    }
  }
}


    accesoAnonimo(){
      this.mostrar = !this.mostrar;
    }


  selecCuenta(cuenta:any) {
    switch (cuenta) {
      case "duenio": {
        this.userForm?.setValue({usuario:'dueño',clave: "dueño"});
        break;
      }
      case "cocinero": {
        this.userForm?.setValue({usuario:'cocinero',clave: "cocinero"});
        break;
      }
      case "bartender": {
        this.userForm?.setValue({usuario:'bartender',clave: "bartender"});
        break;
      }
      case "supervisor": {
        this.userForm?.setValue({usuario:'supervisor',clave: "supervisor"});
        break;
      }
      default: {
        break;
      }
    }
    this.accesoAnonimo();
  }

  registroCliente(){
    //this.router.navigate(['alta/dueño'], { replaceUrl: true });
    this.router.navigate(['registroCliente'], { replaceUrl: true });
  }


  isValidField(field: string): string {
    const validateField = this.userForm?.get(field);
    return !validateField?.valid && validateField?.touched
      ? 'is-invalid'
      : validateField?.touched
      ? 'is-valid'
      : '';
  }

}
