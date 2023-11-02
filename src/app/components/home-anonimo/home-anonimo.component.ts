import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home-anonimo',
  templateUrl: './home-anonimo.component.html',
  styleUrls: ['./home-anonimo.component.scss'],
})
export class HomeAnonimoComponent  implements OnInit {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  leerDocumento(){
    
  }
  salir() {
    this.usuarioService.salir();
  }
  ngOnInit() {}

}
