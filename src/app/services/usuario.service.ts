import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { MensajeService } from './mensaje.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private firestoreService:FirestoreService,private router:Router,private mensaje: MensajeService) { }

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
    usuarios.forEach(async element => {
      if(element.data.usuario === usuario.usuario && element.data.clave === usuario.clave){
        if(element.data.tipo === "cliente" && element.data.clientePendiente){
          error = Errores.clientePendiente
        }else if (element.data.tipo === "cliente" && !element.data.clientePendiente && element.data.clienteRechazado){
          error = Errores.clienteRechazado
        }else{
          localStorage.setItem("usuario",JSON.stringify(element.data))
          error = Errores.ok
          retorno = true;
        }
      }
    });

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
