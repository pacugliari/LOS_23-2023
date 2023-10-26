import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor(private usuarioService:UsuarioService,private router:Router) { }

  ngOnInit() {}

  altaSupervisor(){
    this.router.navigate(["alta/dueño"], { replaceUrl: true })
  }
  altaCliente(){
    this.router.navigate(["alta/cliente"], { replaceUrl: true })
  }

  salir(){
    this.usuarioService.salir();
  }
}
