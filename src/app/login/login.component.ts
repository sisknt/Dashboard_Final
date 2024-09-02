import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {Router} from '@angular/router';
import { CoreService } from '../services/core.service';
import { Usuario } from '../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private api: ApiService,
    private router: Router,
    public core: CoreService
  ) { }
  Swal = require('sweetalert2');

  ValidarUsuario() {
    var TxbUsuario =  document.getElementById('TxbUsuario') as HTMLInputElement;
    var TxbPass =  document.getElementById('TxbPass') as HTMLInputElement;
    var spinner_carga = document.getElementById('spinner_carga') as HTMLElement;

    spinner_carga.classList.toggle('visually-hidden');    
    TxbUsuario.disabled = true;
    TxbPass.disabled = true;

    var envioPOST: any = {
      "login": TxbUsuario.value,
      "passw": TxbPass.value
    }

    this.api.ValidarUsuario(envioPOST).subscribe((data: any) =>{
      if (data["respuesta"] == 'false') {
        spinner_carga.classList.toggle('visually-hidden');    
        TxbUsuario.disabled = false;
        TxbPass.disabled = false;
        alert('Usuario o contraseña incorrectos');
        TxbUsuario.value = '';
        TxbPass.value = '';
      } else {
        alert('Aceptado');
        localStorage.setItem('ingreso', 'aceptado');
        localStorage.setItem('usuario', TxbUsuario.value);
        window.location.href = `${this.core.host}/`
      }
    });
  }

  IniciarSesion() {
    var TxbUsuario =  document.getElementById('TxbUsuario') as HTMLInputElement;
    var TxbPass =  document.getElementById('TxbPass') as HTMLInputElement;
    var spinner_carga = document.getElementById('spinner_carga') as HTMLElement;

    spinner_carga.classList.toggle('visually-hidden');    
    TxbUsuario.disabled = true;
    TxbPass.disabled = true;

    var usuario: Usuario = {
      user: TxbUsuario.value,
      password: TxbPass.value
    }
    this.api.IniciarSesion(usuario).subscribe(
      (data: any) => {
        var respuesta = data["result"]
        console.log(respuesta)
        const swallWithBootstrapButtons = this.Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-cancel"
          },
          buttonsStyle: false
        });
        if (respuesta["mensaje"] == "conectado") {
          this.core.token = respuesta["token"];
          localStorage.setItem('token', respuesta["token"]);
          localStorage.setItem('ingreso', 'aceptado');
          localStorage.setItem('usuario', respuesta["nombre"]);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Bienvenido a Dashboard B2B!",
            showConfirmButton: false,
            timer: 1500
          });
          //alert(`Usuario identificado - conexion aceptada \n
          //Bienvenido - ${respuesta["nombre"]}
          //`)
          window.location.href = `${this.core.host}/`
        } else {
          spinner_carga.classList.toggle('visually-hidden');    
          TxbUsuario.disabled = false;
          TxbPass.disabled = false;
          TxbPass.value = '';
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incorrectos",
            confirmButtonColor: "#384CFF",
          });
        }
      }
    );
  }

  ngOnInit(): void {
    
  }
  

}
