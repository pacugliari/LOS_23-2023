import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltaClienteComponent } from './components/alta-cliente/alta-cliente.component';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { AltaDuenioComponent } from './components/alta-duenio/alta-duenio.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './components/home/home.component';
import { Vibration } from '@ionic-native/vibration/ngx';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginComponent,
    AltaDuenioComponent,
    SpinnerComponent,
    HomeComponent,
    AltaClienteComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule ,
  ],
  providers: [
    BarcodeScanner,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
