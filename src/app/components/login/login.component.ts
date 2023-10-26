import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Usuario } from 'src/app/models/usuario';
import { MensajeService } from 'src/app/services/mensaje.service';
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
    private mensajesService:MensajeService
  ) {
    
  }

  async ngOnInit() {
  }


  async onLogin() {
    this.cargando = true;
    this.usuario.usuario =this.userForm.value.usuario ? this.userForm.value.usuario : "";
    this.usuario.clave = this.userForm.value.clave  ? this.userForm.value.clave : "";
    this.userForm.reset();

    let esValido = (await this.usuarioSrv.verificarUsuario(this.usuario));
    this.cargando = false;

    if(!esValido){
      this.mensajesService.mostrar("ERROR","Usuario no autorizado","error")
     }else{
      this.router.navigate(['home'], { replaceUrl: true });
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
    alert("implementar el registro de cliente-beta")
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
