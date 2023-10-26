import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
//import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss'],
})
export class AltaClienteComponent {
  clienteName: string = '';
  clienteLastName: string = '';
  clienteDni: number = -1;
  esAnonimo: boolean = true;
  form!: FormGroup;
  checkError: boolean = false;
  usandoQR: boolean = false;
  errorMessage: string = '';

  scannedBarCode?: any;
  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;
  content_visibility = '';

  constructor(private barcodeScanner: BarcodeScanner) {} //private authService: AuthService

  ngOnInit(): void {
    this.form = new FormGroup({
      clienteName: new FormControl('', [Validators.required]),
      clienteLastName: new FormControl('', [Validators.required]),
      clienteDni: new FormControl('', [Validators.required]),
      esAnonimo: new FormControl(true),
    });
  }

  // async checkPermission():Promise<boolean | undefined>{
  //   try {
  //     // check or request permission
  //     const status = await BarcodeScanner.checkPermission({ force: true });
  //     if (status.granted) {
  //       // the user granted permission
  //       return true;
  //     }
  //     return false;
  //   } catch(e) {
  //     console.log(e);
      
  //     return false;
  //   }
  // }
  leerDocumento() {
    this.barcodeScanner.scan({ formats: "PDF_417" }).then((res:any) => {
      this.scannedBarCode = res;
      let userQR = this.scannedBarCode["text"]
      let data = userQR.split("@");
      if (!(isNaN(Number(data[4])))) {
        this.form.get("nombre")?.setValue(data[2]);
        this.form.get("apellido")?.setValue(data[1]);
        this.form.get("dni")?.setValue(data[4]);
      } else {
        this.form.get("nombre")?.setValue(data[5]);
        this.form.get("apellido")?.setValue(data[4]);
        this.form.get("dni")?.setValue(data[1].trim());
      }
    }).catch((err:any) => {
      console.log(err);
      //this.mensajesService.mostrar("ERROR","Error al leer el QR del documento","error");
    });
  }

  // stopScan() {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   document.querySelector('body')?.classList.remove('scanner-active');
  //   this.content_visibility = '';
  // }

  onSubmit() {
    //   if (this.form.valid && this.selectedCountry != null) {
    //    // console.log(this.form.controls);
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Alta de cliente exitosa',
    //       text: 'cliente agregado',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     })
    //       .then(async () => {
    //         let pais = '';
    //         if (this.selectedCountry != null) {
    //           pais = this.selectedCountry.name;
    //         } else {
    //           pais = this.form.controls['selectedCountry'].value;
    //         }
    //         const cliente = new cliente(
    //           this.form.controls['clienteName'].value,
    //           this.form.controls['clienteLastName'].value,
    //           this.form.controls['clienteEdad'].value,
    //           pais
    //         );
    //         const x = await this.authService.guardarclienteBD(cliente);
    //         if (x) {
    //           this.form.reset();
    //         } else {
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Error al agregar el cliente',
    //             text: this.errorMessage,
    //             timer: 4000,
    //           });
    //         }
    //       })
    //       .catch((error) => {
    //         this.errorMessage = error.message;
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error al agregar xd  el cliente',
    //           text: this.errorMessage,
    //           timer: 4000,
    //         });
    //       });
    //   } else {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error complete los datos!!',
    //       timer: 2500,
    //     });
    //   }
  }
//   ngOnDestroy(): void {
//     this.stopScan();
// }
}
