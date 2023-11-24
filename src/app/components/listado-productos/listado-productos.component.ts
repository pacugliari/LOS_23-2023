import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
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
  seCargoCocina : boolean = false;
  seCargoBebida : boolean = false;
  cantidad = 0;

  constructor(
    private firestoreService: FirestoreService,private usuarioService: UsuarioService,
    private mensajes: MensajeService,private router:Router,private route:ActivatedRoute
    ,private pushService:PushNotificationService
  ) {}  

  async ngOnInit() {
    this.route.url.subscribe(async () => {
      this.verPedido = false;
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
      }else if (this.usuario.data.tipo === "cliente" || this.usuario.data.tipo === "anonimo" ){
        this.rutaBack = "/homeCliente"
        this.titulo = "Carta"
      }
    })
  }

  atras(){
    this.router.navigate([this.rutaBack,1], { replaceUrl: true });
  }

  private calcularTotales(){
    this.total = this.demora = 0;

    this.carrito.forEach((item:any) => {
      if(item){
        this.total += item.cantidad*item.producto.precio
        if(this.demora < item.cantidad*item.producto.tiempo){
          this.demora = item.cantidad*item.producto.tiempo
        }
      }
    });
  }

  buscarProductoEnElCarrito(producto : any){
    let posicion = -1;
    for (let i = 0; i < this.carrito.length; i++) {
      let element = this.carrito[i];
      if(element.producto.nombre === producto.nombre){
        posicion = i;
        break;
      }
    }
    return posicion;
  }

  verificarSeCargo(){

    this.seCargoBebida = false;
    this.seCargoCocina = false;

    for (let i = 0; i < this.carrito.length; i++) {
      let element = this.carrito[i];
      if(element.producto.tipo === "comida" || element.producto.tipo === "postre"){
        this.seCargoCocina = true;
      }else if (element.producto.tipo === "bebida"){
        this.seCargoBebida = true;
      }
    }

  }

  async quitar(producto:any){
    let indice = this.buscarProductoEnElCarrito(producto);

    if(indice !== -1){
      if (this.carrito[indice].cantidad > 0){
        this.carrito[indice].cantidad--;
        if(this.carrito[indice].cantidad === 0){ 
          this.carrito.splice(indice,1);
          this.verificarSeCargo();
        }
      }
    }
    this.calcularTotales();
  }


  async agregar(producto:any){
    
    let indice = this.buscarProductoEnElCarrito(producto);

    if(indice === -1){

      if(producto.tipo === "comida" || producto.tipo === "postre"){
        this.seCargoCocina = true;
      }
      if(producto.tipo === "bebida"){
        this.seCargoBebida = true;
      }

      this.carrito.push ({producto:producto,cantidad:1})
    }else{
      this.carrito[indice].cantidad++;
    }
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

  private async buscarMesa(pedido: any) {
    let mesas = await this.firestoreService.obtener("mesas")
    for (let mesa of mesas) {
      if (pedido.cliente.id === mesa.data.cliente.id) {
        return mesa;
      }
    }
  }

  async realizarPedido(){
    this.cargando = true;
    if(this.carrito.length > 0){
      let data = {
        pedido: this.carrito,
        cliente: this.usuario,
        estado: "NoConfirmado",
        estadoBebidas : this.seCargoBebida ? null : "No hubo pedido",
        estadoComidas : this.seCargoCocina ? null : "No hubo pedido",
      }

      let mozos = await this.firestoreService.obtener('usuarios');
      mozos = mozos.filter((element) => {
        return element.data.tipo === 'Mozo';
      });

      let mesa = await this.buscarMesa(data);

      this.pushService
      .sendPushNotification({
        registration_ids: mozos.map((mozo)=> mozo.data.tokenPush),
        notification: {
          title: `Pedido nuevo`,
          body: `Hay un pedido de la mesa ${mesa.data.numeroMesa} a ser confirmado`,
        },
        data: {
          ruta: "homeEmpleado"
        }
      })
      .subscribe((data) => {
        console.log(JSON.stringify(data));
      });

      await this.firestoreService.guardar(data,"pedidos")
      this.mensajes.mostrar("OK","Pedido realizado,esta siendo confirmado por un mozo","success")
      this.router.navigate(["homeCliente"], { replaceUrl: true })
    }else{
      this.mensajes.mostrar("ERROR","Debe seleccionar al menos una cosa","error")
    }
    this.cargando = false;
  }

}
