import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestoreService:FirestoreService,private router:Router) { }

  async verificarUsuario(usuario: Usuario) {
    let retorno = false;
    let usuarios = await this.firestoreService.obtener("usuarios");
    usuarios.forEach(element => {
      if(element.data.usuario === usuario.usuario && element.data.clave === usuario.clave){
        localStorage.setItem("usuario",JSON.stringify(element.data))
        retorno = true;
      }
    });
    console.log(retorno)
    return retorno;
  }

  salir(){
    localStorage.clear();
    this.router.navigate(["login"], { replaceUrl: true })
  }


}
