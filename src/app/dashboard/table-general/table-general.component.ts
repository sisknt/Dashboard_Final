import { Component, OnInit } from '@angular/core';
import { TotalCategoriaTiendaComparativo } from 'src/app/models/TotalCategoriaTiendaComparativo';
import { ApiService } from 'src/app/services/api.service';
import * as XLSX from 'xlsx';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-table-general',
  templateUrl: './table-general.component.html',
  styleUrls: ['./table-general.component.css']
})
export class TableGeneralComponent implements OnInit {

  constructor(public API: ApiService, public CORE: CoreService) { }

  tabla_total_categoria_tienda: TotalCategoriaTiendaComparativo[] = []
  semanas: string[] = [];

  tipo_dato: string = 'soles';

  year_actual: number = 0;
  year_old: number = 0;

  CargarData(year_old: string, year_actual: string, semana_inicial: string, semana_final: string) {
    this.tabla_total_categoria_tienda = [];
    this.API.ObtenerComparativoTabla(this.CORE.Empresa_Actual, year_old, year_actual, semana_inicial, semana_final).subscribe(
      (data: any) => {
        this.tabla_total_categoria_tienda = (data["tabla"] as []).reverse();
      }
    );
  }

  CambiarTipoDato(dato: string) {
    this.tipo_dato = dato;
  }

  ConvertirACadena(numero: number) { return String(numero) }

  DescargarExcel(tabla: HTMLTableElement) {
    var Excel_Exportado: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);

    var libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, Excel_Exportado, 'Ventas');
    XLSX.writeFile(libro, `General categorias.xlsx`);
  }

  ngOnInit(): void {

    const fecha_actual = new Date();
    this.year_actual = fecha_actual.getFullYear();
    this.year_old = this.year_actual - 1;
    
    this.API.ObtenerSemanas(String(this.year_actual), this.CORE.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
      (data: any) => {
        this.semanas = data["semanas"]
        this.CargarData(String(this.year_old), String(this.year_actual), this.semanas[this.semanas.length - 8].split(' ')[1], this.semanas[this.semanas.length - 1].split(' ')[1]);
      }
    );
  }

}
