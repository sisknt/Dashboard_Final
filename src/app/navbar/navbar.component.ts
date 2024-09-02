import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private api: ApiService, public core: CoreService, private router: Router) { }

  empresas: string[] = [];

  CambiarEmpresa(empresa: string){
    this.core.Empresa_Actual = empresa;
    localStorage.setItem('empresa', empresa);
    if (empresa == 'KANTU') {
      localStorage.setItem('categoria', 'TODO_CATEGORIAS');
      localStorage.setItem('logo', '../../assets/svg/logo-kantu.svg');
    } else {
      this.core.Logo_actual = '../../assets/svg/logo-decor.svg';
      localStorage.setItem('categoria', 'TODO_CATEGORIAS');
      localStorage.setItem('logo', '../../assets/svg/logo-decor.svg');
    }
  }

  eliminarCredenciales() {
    localStorage.setItem('ingreso', '');
    localStorage.setItem('usuario', '');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    if (String(localStorage.getItem('ingreso')) != 'aceptado' && this.router.url != '') {
      this.router.navigate(['login']);
    }
    if (String(localStorage.getItem('empresa')) != 'null') {
      this.core.Empresa_Actual = String(localStorage.getItem('empresa'));
    }
    if (String(localStorage.getItem('logo')) != 'null') {
      this.core.Logo_actual = String(localStorage.getItem('logo'));
    }
    
    this.core.usuario_actual = String(localStorage.getItem('usuario'));

    this.api.ObtenerEmpresas().subscribe(
      (data: any) => {
        (data["empresas"] as []).forEach(
          empresa => {
            this.empresas.push(empresa["empresa"]);
          }
        );
      }
    );
  }

}
