import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import { DiferenciasPorcentuales } from '../models/diferencias-porcentuales';

@Component({
  selector: 'tabla-comparativa',
  templateUrl: './tabla-comparativa.component.html',
  styleUrls: ['./tabla-comparativa.component.css']
})
export class TablaComparativaComponent implements OnInit {

  constructor(public API: ApiService, public CORE: CoreService) { }

  diferencias!: DiferenciasPorcentuales;
  semanas: string[] = [];

  year_actual: number = 0;
  year_old: number = 0;

  GenerarCalculo(semana_inicial: string, semana_final: string) {
    this.API.ObtenerDiferenciaPorcentual(this.CORE.Empresa_Actual, semana_inicial, semana_final).subscribe(
      (data: any) => {
        this.diferencias = data["diferencia"];
      }
    );
  }
  

  ngOnInit(): void {
    const fecha_actual = new Date();
    this.year_actual = fecha_actual.getFullYear();
    this.year_old = this.year_actual - 1;
    
    this.API.ObtenerSemanas(String(this.year_actual), this.CORE.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
      (data: any) => {
        this.semanas = data["semanas"]
        this.GenerarCalculo('1', this.semanas[this.semanas.length - 1].split(' ')[1]);
      }
    );
  }

}
