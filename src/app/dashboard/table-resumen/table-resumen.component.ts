import { Component, Input, OnInit } from '@angular/core';
import Producto_resumen from 'src/app/models/Producto_resumen';
import Venta from 'src/app/models/Venta';
import VentasResumen from 'src/app/models/Ventas_resumen';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-table-resumen',
  templateUrl: './table-resumen.component.html',
  styleUrls: ['./table-resumen.component.css']
})
export class TableResumenComponent implements OnInit {

  constructor(
    public API: ApiService,
    public CORE: CoreService,
  ) { }

  DT_Ventas: VentasResumen[] = [];
  DT_Semanas: string[] = [];
  DT_SemanasNumeracion: string[] = [];
  DT_Productos: Producto_resumen[] = [];
  DT_Totales: number[] = [];
  total_general: number = 0;

  DT_Categorias: string[] = [];
  DT_Ventas_resumen:
    {
      tienda: string,
      empresa: string,
      periodo: string,
      semana: number,
      categorias: {
        soles: number,
        cantidad: number,
        categoria: string
      }[],
      lista_categorias: string[]
    }[] = []

  ActualizarTabla() {
    this.ngOnInit()
  }
  imprimir() {
    //console.log('prueba');
  }
  toggleSpinner_resumen() {
    var spinner = document.getElementById('spinner_carga_tabla_resumen') as HTMLDivElement;
    spinner.classList.toggle('visually-hidden');
  }
  BuscarSemana(ventas: Venta[], semana: string): boolean {
    var respuesta: boolean = false;
    ventas.forEach(v => {
      v.semana == semana ? respuesta = true : '';
    });
    return respuesta;
  }
  ObtenerSemana(ventas: Venta[], semana: string): Venta {
    var venta: Venta = new Venta(0, 0, '');
    ventas.forEach(v => {
      v.semana == semana ? venta = v : '';
    });
    return venta;
  }
  Seleccionar(fila: HTMLElement) { fila.classList.toggle('linea_seleccion') }

  ObtenerVentaResumen(posicion: number) {
    return this.DT_Ventas_resumen[posicion];
  }
  ObtenerValorCategoria(Ventas_resumen:
    {
      tienda: string,
      empresa: string,
      periodo: string,
      semana: number,
      categorias: {
        soles: number,
        cantidad: number,
        categoria: string
      }[],
      lista_categorias: string[]
    }, categoria: string) {
    var valor = 0;
    Ventas_resumen.categorias.forEach(cat => {
      if (cat.categoria == categoria) {
        if (this.CORE.tipo_dato == 'Soles') {
          valor = cat.soles;
        } else {
          valor = cat.cantidad;
        }
      }
    });
    return valor;
  }
  ObtenerTotalCategoria(categoria: string) {
    var total_semana = 0;
    this.DT_Ventas_resumen.forEach(venta => {
      venta.categorias.forEach(cat => {
        if (cat.categoria == categoria) {
          if (this.CORE.tipo_dato == 'Soles') {
            total_semana += cat.soles;
          } else {
            total_semana += cat.cantidad;
          }
        }
      });
    });
    return total_semana;
  }
  ObtenerParticipacionCategoria(categoria: string) {
    var total_semanal = this.ObtenerTotalSemanal();
    var total_categoria = this.ObtenerTotalCategoria(categoria);
    var participacion = (total_categoria * 100) / total_semanal;

    return Number(participacion.toFixed(2));
  }
  ObtenerTotalParticipacion() {
    var total_participacion: number = 0;
    this.DT_Categorias.forEach(categoria => {
      total_participacion += this.ObtenerParticipacionCategoria(categoria.toLocaleLowerCase())
    });
    return total_participacion.toFixed(0);
  }
  ObtenerTotalSemana(periodo: string) {
    var total_semana = 0;
    this.DT_Ventas_resumen.forEach(venta => {
      if (venta.periodo == periodo) {
        venta.categorias.forEach(cat => {
          if (this.CORE.tipo_dato == 'Soles') {
            total_semana += cat.soles;
          } else {
            total_semana += cat.cantidad;
          }
        });
      }
    });
    return total_semana;
  }
  ObtenerTotalSemanal() {
    var total: number = 0;
    this.DT_Semanas.forEach(semana => {
      total += this.ObtenerTotalSemana(semana);
    });
    return total;
  }
  ObtenerPromedioSemanal() {
    var promedio: number = 0;
    this.DT_Semanas.forEach(semana => {
      promedio += this.ObtenerTotalSemana(semana);
    });
    return promedio / this.DT_Semanas.length;
  }
  ObtenerPromedioCategoria(categoria: string, longitud_semanas: number) {
    var promedio_semana = 0;
    this.DT_Ventas_resumen.forEach(venta => {
      venta.categorias.forEach(cat => {
        if (cat.categoria == categoria) {
          if (this.CORE.tipo_dato == 'Soles') {
            promedio_semana += cat.soles;
          } else {
            promedio_semana += cat.cantidad;
          }
        }
      });
    });
    promedio_semana = promedio_semana / longitud_semanas
    return Number(promedio_semana.toFixed(0));
  }

  year_actual: string = this.CORE.Year_Actual;

  ngOnInit(): void {
    this.toggleSpinner_resumen();
    var years_none: string[] = [];
    this.API.ObtenerYears().subscribe((years: any) => {
      (years["years"] as []).forEach(year => {
        years_none.push(year)
      });
      this.year_actual == '0' ? this.year_actual = years_none[years_none.length - 1] : this.year_actual = this.CORE.Year_Actual;
      this.API.ObtenerSemanas(this.CORE.Year_Actual, this.CORE.Empresa_Actual, this.CORE.Tienda_Actual).subscribe(
        (data: any) => {
          this.CORE.DT_Semanas = data["semanas"]
          if (this.CORE.primeraCargaResumen === 'Cargado') {
            this.CORE.semana_inicial_primera_carga_resumen = this.CORE.DT_Semanas.length - 8;
            this.CORE.semana_final_primera_carga_resumen = this.CORE.DT_Semanas.length;
            this.CORE.primeraCargaResumen = 'Descargado';
            //console.log(this.CORE.primeraCargaResumen, this.CORE.semana_inicial_primera_carga_resumen, this.CORE.semana_final_primera_carga_resumen)
            this.API.ObtenerVentasResumenLimitado(this.year_actual, this.CORE.Empresa_Actual, this.CORE.Tienda_Actual, this.CORE.Categoria_actual, this.CORE.semana_inicial_primera_carga_resumen, this.CORE.semana_final_primera_carga_resumen, this.CORE.locales_url).subscribe(
              (data: any) => {
                this.DT_Semanas = [];
                this.DT_Ventas_resumen = [];
                (data["ventas_resumen"] as []).forEach(element => {
                  this.DT_Semanas.push(element["periodo"]);
                  this.DT_Ventas_resumen.push({
                    tienda: element["tienda"],
                    empresa: element["empresa"],
                    periodo: element["periodo"],
                    semana: element["semana"],
                    categorias: element["categorias"],
                    lista_categorias: element["lista_categorias"],
                  });
  
                  this.DT_Ventas_resumen.forEach(venta => {
                    venta.lista_categorias.forEach(cat => {
                      if (!this.DT_Categorias.includes(cat)) {
                        this.DT_Categorias.push(cat)
                      }
                    })
                  });
  
                  if (this.CORE.Categoria_actual != 'TODO_CATEGORIAS') {
                    this.DT_Categorias = this.CORE.Categoria_actual.split('+');
                    if (this.CORE.Tienda_Actual == 'PROMART') {
                      this.DT_Categorias = this.DT_Categorias.filter((cat_ele => cat_ele != 'LISTELOS_OLIVIA'));
                    }
                  }
                });
                this.toggleSpinner_resumen();
              }
            );
          } else {
            this.API.ObtenerVentasResumenLimitado(this.year_actual, this.CORE.Empresa_Actual, this.CORE.Tienda_Actual, this.CORE.Categoria_actual, this.CORE.semana_inicial, this.CORE.semana_final, this.CORE.locales_url).subscribe(
              (data: any) => {
                this.DT_Semanas = [];
                this.DT_Ventas_resumen = [];
                (data["ventas_resumen"] as []).forEach(element => {
                  this.DT_Semanas.push(element["periodo"]);
                  this.DT_Ventas_resumen.push({
                    tienda: element["tienda"],
                    empresa: element["empresa"],
                    periodo: element["periodo"],
                    semana: element["semana"],
                    categorias: element["categorias"],
                    lista_categorias: element["lista_categorias"],
                  });
  
                  this.DT_Ventas_resumen.forEach(venta => {
                    venta.lista_categorias.forEach(cat => {
                      if (!this.DT_Categorias.includes(cat)) {
                        this.DT_Categorias.push(cat)
                      }
                    })
                  });
  
                  if (this.CORE.Categoria_actual != 'TODO_CATEGORIAS') {
                    this.DT_Categorias = this.CORE.Categoria_actual.split('+');
                    if (this.CORE.Tienda_Actual == 'PROMART') {
                      this.DT_Categorias = this.DT_Categorias.filter((cat_ele => cat_ele != 'LISTELOS_OLIVIA'));
                    }
                  }
                });
                this.toggleSpinner_resumen();
              }
            );
          }
        }
      );
    })
  }

}
