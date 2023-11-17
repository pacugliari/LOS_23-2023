import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { MensajeService } from './mensaje.service';
import { PushNotificationService } from './push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private firestoreService:FirestoreService,private router:Router,private mensaje: MensajeService,private pushService:PushNotificationService) { }

  async verificarUsuario(usuario: Usuario) {
    let retorno = false;

    enum Errores {
      clientePendiente,
      clienteRechazado,
      ok,
      usuarioNoAutorizado
    }
    
    let error : Errores = Errores.usuarioNoAutorizado;

    let usuarios = await this.firestoreService.obtener("usuarios");
    let usuarioValido : any = null;
    usuarios.forEach(async (element :any)=> {
      if(element.data.usuario === usuario.usuario && element.data.clave === usuario.clave){
        usuarioValido = element;
      }
    });

    if(usuarioValido !== null){

      if(usuarioValido.data.tipo === "cliente" && usuarioValido.data.clientePendiente){
        error = Errores.clientePendiente
      }else if (usuarioValido.data.tipo === "cliente" && !usuarioValido.data.clientePendiente && usuarioValido.data.clienteRechazado){
        error = Errores.clienteRechazado
      }else{
        usuarioValido.data.tokenPush = await this.pushService.generarToken();
        await this.firestoreService.modificar({id:usuarioValido.id,data:usuarioValido.data},"usuarios")
        localStorage.setItem("usuario",JSON.stringify({id:usuarioValido.id,data:usuarioValido.data}))
        error = Errores.ok
        retorno = true;
      }
    }


    switch(+error){
      case Errores.clienteRechazado:
        await this.mensaje.mostrar("ERROR","El cliente fue rechazado","error");
      break;
      case Errores.ok:

      break;
      case Errores.clientePendiente:
        await this.mensaje.mostrar("ERROR","El cliente no se encuentra aprobado","error");
      break;
      case Errores.usuarioNoAutorizado:
        await this.mensaje.mostrar("ERROR", "Usuario no autorizado", "error");
      break;
    }

    //console.log(retorno)
    return retorno;
  }

  salir(){
    localStorage.clear();
    this.router.navigate(["login"], { replaceUrl: true })
  }

  getUsuarioLogueado(){
    let ls = localStorage.getItem("usuario");
    let usuarioLogueado = null;
    if(ls)
      usuarioLogueado = JSON.parse(ls);

    return usuarioLogueado;
  }


}
