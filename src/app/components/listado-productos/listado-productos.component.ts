import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-productos', // Cambia el nombre del selector
  templateUrl: './listado-productos.component.html', // Cambia la plantilla HTML
  styleUrls: ['./listado-productos.component.scss'], // Cambia los estilos si es necesario
})
export class ListadoProductosComponent implements OnInit {
  productos: any[] = [];
  comidas: any[] = [];
  postres: any[] = [];
  bebidas: any[] = [];
  indice  = 0;
  usuario : any;
  rutaBack = "/homeEmpleado"
  total = 0;
  demora = 0;
  carrito : any[] = [];
  carritoPedido : any[] = []; 
  public cargando: boolean = false;
  titulo = "Listado productos"
  verPedido : boolean = false;

  constructor(
    private firestoreService: FirestoreService,private usuarioService: UsuarioService,
    private mensajes: MensajeService,private router:Router
  ) {}  

  async ngOnInit() {
    this.cargando = true;
    this.usuario = this.usuarioService.getUsuarioLogueado();
    let pedidos = await this.firestoreService.obtener("pedidos");
    pedidos.forEach((pedido : any)=>{
      if(pedido.data.cliente.id === this.usuario.id && pedido.data.estado !== "Entregado"){
        this.router.navigate(['homeCliente'], { replaceUrl: true });
        this.mensajes.mostrar("OK","Ya realizo el pedido","success")
      }
    }) 
    await this.cargarProductos(); 

    if(this.usuario.data.tipo === "cocinero" || this.usuario.data.tipo === "bartender"){
      this.rutaBack = "/homeEmpleado"
      this.titulo = "Listado productos"
    }else if (this.usuario.data.tipo === "cliente"){
      this.rutaBack = "/homeCliente"
      this.titulo = "Carta"
    }

  }

  seleccionarProducto(){
   // asignacion de productos al pedido de la mesa PUNTO 7 JIRA
  }

  private calcularTotales(){
    this.total = this.demora = 0;

    this.carrito.forEach((item:any) => {
      if(item){
        this.total += item.cantidad*item.producto.precio
        this.demora += item.cantidad*item.producto.tiempo
      }
    });
  }

  async agregar(producto:any){

    const { value: cantidad } = await Swal.fire({
      title: 'Ingrese la cantidad',
      input: 'number',
      inputLabel: 'Cantidad:',
      inputValue: 1,
      heightAuto: false,
      inputAttributes: {
        min: '1',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });

    this.carrito.push ({producto:producto,cantidad:cantidad})

    this.calcularTotales();
  }

  filtrarPorCategoria(tipo:string){
    switch(tipo){
      case "comidas":
        this.productos = this.comidas;
        break;
      case "bebidas":
        this.productos = this.bebidas;
        break;
      case "postres":
        this.productos = this.postres;
        break;
    }
  }

  async cargarProductos() { // Cambia el nombre de la función cargar
    try {

      this.productos = await this.firestoreService.traerProductosBd(); // Cambia 'producto' a 'productos'
      this.comidas = this.productos.filter((producto:any)=> producto.tipo === "comida");
      this.bebidas = this.productos.filter((producto:any)=> producto.tipo === "bebida");
      this.postres = this.productos.filter((producto:any)=> producto.tipo === "postre");
      this.productos = this.comidas

    } catch (error) {
      console.error('Error al cargar productos desde Firestore:', error); // Cambia el mensaje de error
    } finally {
      this.cargando = false;
    }
  }

  verPedidos(){
    this.verPedido = !this.verPedido
    if(this.verPedido)
      this.titulo = "Carrito"
    else
      this.titulo = "Carta"
  }

  eliminar(producto:any){
    for (let i = 0; i < this.carrito.length; i++) {
      let item = this.carrito[i];
      if(item.producto.nombre === producto.producto.nombre){
        this.carrito.splice(i,1)
        break;
      }
    }
    this.calcularTotales();
  }

  async realizarPedido(){
    let data = {
      pedido: this.carrito,
      cliente: this.usuario,
      estado: "NoConfirmado"
    }
    await this.firestoreService.guardar(data,"pedidos")
    this.mensajes.mostrar("OK","Pedido realizado,esta siendo confirmado por un mozo","success")
    this.router.navigate(["homeCliente"], { replaceUrl: true })
  }

}
