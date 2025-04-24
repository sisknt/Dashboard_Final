import { Component, OnInit } from '@angular/core';
import Producto from 'src/app/models/Producto';
import Venta from 'src/app/models/Venta';
import Ventas from 'src/app/models/Ventas';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
    public CORE: CoreService,
    public API: ApiService,
  ) { }

  DT_Ventas: Ventas[] = [];
  DT_Semanas: string[] = [];
  DT_SemanasNumeracion: string[] = [];
  DT_Totales: number[] = [];
  DT_Totales_ventas: number[] = [];

  total_general: number = 0;
  total_general_venta: number = 0;
  Productos_lista: any[] = [];
  Productos: Producto[] = [];

  estado_ordenamiento_total: string = '';

  ActualizarTabla() {
    this.ngOnInit();
  }

  CambiarCategoria(categoria: string) {
    this.CORE.Categoria_actual = categoria;
    this.CORE.botonActivoDecor = categoria;
    this.CORE.botonActivoKantu = categoria;
    this.ngOnInit();
  }
  ObtenerFila(venta: Venta[]) {
    const fila: number[] = [];
    const arrayVentasSemanas: number[] = venta.map(v => Number(v.semana));
    var arrayVentasCantidad: number[] = [];
    if (this.CORE.tipo_dato == 'Soles') {
      arrayVentasCantidad = venta.map(v => v.soles);
    } else {
      arrayVentasCantidad = venta.map(v => v.cantidad);
    }
    this.DT_SemanasNumeracion.forEach(semana => {
      const semanaIndex = arrayVentasSemanas.indexOf(Number(semana));
      fila.push(semanaIndex != -1 ? arrayVentasCantidad[semanaIndex] : 0);
    });
    return fila;
  }
  Seleccionar(fila: HTMLElement) {
    fila.classList.toggle('linea_seleccion');
  }

  OrdenarTotal() {
    switch (this.estado_ordenamiento_total) {
      case '':
        this.Productos.sort((a, b) => {
          if (a.GetTotal(this.CORE.tipo_dato) < b.GetTotal(this.CORE.tipo_dato)) { return -1 }
          else { return 1 }
        });
        this.estado_ordenamiento_total = 'descendente';
        break;
      case 'descendente':
        this.Productos.sort((a, b) => {
          if (b.GetTotal(this.CORE.tipo_dato) < a.GetTotal(this.CORE.tipo_dato)) { return -1 }
          else { return 1 }
        });
        this.estado_ordenamiento_total = 'ascendente';
        break;
      case 'ascendente':
        this.Productos.sort((a, b) => {
          if (a.GetTotal(this.CORE.tipo_dato) < b.GetTotal(this.CORE.tipo_dato)) { return -1 }
          else { return 1 }
        });
        this.estado_ordenamiento_total = 'descendente';
        break;
    }
  }
  year_actual: string = this.CORE.Year_Actual;
  sku_seleccionados: string[] = [];

  estado_tipologia: number = 4;

  cambiar_limite_tipologia(tipo: number) {
    this.estado_tipologia = tipo;
  }

  ConvertirNumero(numero: string) {
    return Number(numero);
  }

  GenerarTabla(inicial: number, final: number) {
    //console.log(`DEBUG INFO: -------- ${this.CORE.busqueda_actual}`);
    this.API.ObtenerVentasLimitado(this.year_actual, this.CORE.Empresa_Actual, this.CORE.Tienda_Actual, this.CORE.Categoria_actual, inicial, final, this.CORE.busqueda_actual, this.CORE.locales_url).subscribe(
      (data: any) => {
        this.DT_Ventas = [];
        this.DT_Semanas = [];
        this.DT_SemanasNumeracion = [];
        this.DT_Totales = [];
        this.DT_Totales_ventas = [];
        this.total_general = 0;
        this.total_general_venta = 0;
        this.Productos_lista = [];
        this.Productos = [];
        this.CORE.SetVentas(data["ventas"], this.DT_Ventas);
        this.CORE.SetSemanas(data["semanas"], this.DT_Semanas, this.DT_SemanasNumeracion);
        /* Calcula los totales */
        this.DT_Semanas.forEach(
          semana => {
            var total_semana: number = 0;
            this.DT_Ventas.forEach(
              venta => {
                if (semana == venta.periodo) {
                  if (this.CORE.tipo_dato == 'Soles') {
                    total_semana += Math.floor(Number(venta.soles));
                  } else {
                    total_semana += Number(venta.cantidad);
                  }
                }
              }
            );
            this.DT_Totales.push(total_semana);
          }
        );

        this.DT_Totales.forEach(
          total => {
            this.total_general += total;
          }
        );
        this.DT_Totales.push(this.total_general);
        this.DT_Totales.push(this.total_general / (this.DT_Totales.length - 1));
        /*  */
        /* Se establecen los modelos */

        this.DT_Ventas.forEach(
          venta => {
            if (!this.Productos_lista.includes(venta.sku)) {
              this.Productos_lista.push(venta.sku);
              this.CORE.ArrayDeProductosBuscar.push(venta.sku);
              this.CORE.ArrayDeProductosBuscar.push(venta.nombre);
              var producto: Producto = new Producto(venta.sku, venta.nombre, venta.precio, [], venta.categoria, venta.estado)
              this.Productos.push(producto)
            }
            this.Productos.forEach(
              producto => {
                if (venta.sku == producto.sku) {
                  var venta_obj = new Venta(Number(venta.cantidad), Number(venta.soles), venta.semana)
                  producto.ventas.push(venta_obj)
                }
              }
            );
          }
        );
        this.CORE.ArrayDeProductosBuscar = this.CORE.ordenarArrayAlfabeticamente(this.CORE.ArrayDeProductosBuscar);
        /*  */
        /* Calculo la participacion */
        var Participacion_total: number = 0;
        var contador1: number = 0;
        var contador2: number = 0;
        var contador3: number = 0;
        this.Productos.sort((a, b) => {
          if (b.GetTotal(this.CORE.tipo_dato) < a.GetTotal(this.CORE.tipo_dato)) { return -1 }
          else { return 1 }
        });
        this.estado_ordenamiento_total = 'ascendente';
        this.Productos.forEach(
          (producto, i) => {
            Participacion_total += Number(producto.GetParticipacion(this.total_general, this.CORE.tipo_dato));
            producto.participacion_acumulada = Math.min(Participacion_total, 100).toFixed(2);
            if (Number(producto.participacion_acumulada) < 50) {
              producto.tipologia = 'TIPOLOGIA 1';
            } else {
              if (Number(producto.participacion_acumulada) < 80) {
                contador1++;
                if (contador1 == 1) {
                  producto.tipologia = 'TIPOLOGIA 1';
                } else {
                  producto.tipologia = 'TIPOLOGIA 2';
                }
              } else {
                if (Number(producto.participacion_acumulada) < 94) {
                  contador2++;
                  if (contador2 == 1) {
                    producto.tipologia = 'TIPOLOGIA 2';
                  } else {
                    producto.tipologia = 'TIPOLOGIA 3';
                  }
                } else {
                  if (Number(producto.participacion_acumulada) <= 100) {
                    contador3++;
                    if (contador3 == 1) {
                      producto.tipologia = 'TIPOLOGIA 3';
                    } else {
                      producto.tipologia = 'TIPOLOGIA 4';
                    }
                  }
                }
              }
            }
          }
        );
        this.CargarTotales();
        this.DT_Totales.push(Participacion_total);
        this.ObtenerSKU8020();
        /*  */
        /* Llamados Estilos */
        setTimeout(
          () => {
            var fila = document.querySelectorAll('#fila');
            fila.forEach(
              efec => {
                efec.addEventListener('click', () => {
                  efec.classList.toggle('efecto');
                });
              }
            );
          }, 1000
        );
        this.toggleSpinner();
      }
    );
  }

  CargarTotales() {
    var Participacion_total: number = 0;
    this.total_general_venta = 0;
    this.DT_Totales_ventas = [];


    this.DT_Semanas.forEach(
      semana => {
        var total_semana: number = 0;
        this.Productos.forEach(item => {
          item.ventas.forEach(venta => {
            if (Number(item.tipologia.split(' ')[1]) <= this.estado_tipologia) {
              if (semana.split(' ')[1] == venta.semana) {
                if (this.CORE.tipo_dato == 'Soles') {
                  total_semana += Number(venta.soles)
                } else {
                  total_semana += Number(venta.cantidad)
                }
              }
            }
          });
        });
        this.DT_Totales_ventas.push(total_semana);
      }
    );
    this.DT_Totales_ventas.forEach(
      total => {
        this.total_general_venta += total;
      }
    );
    this.DT_Totales_ventas.push(this.total_general_venta);
    this.DT_Totales_ventas.push(this.total_general_venta / (this.DT_Totales_ventas.length - 1));
    this.Productos.forEach(item => {
      if (Number(item.tipologia.split(' ')[1]) <= this.estado_tipologia) {
        Participacion_total += item.GetParticipacion(this.total_general, this.CORE.tipo_dato);
      }
    });
    this.DT_Totales_ventas.push(Participacion_total);
  }



  ngOnInit(): void {
    this.CORE.ArrayDeProductosBuscar = [];
    this.toggleSpinner();
    var years_none: string[] = []
    this.API.ObtenerYears().subscribe((years: any) => {
      (years["years"] as []).forEach(year => {
        years_none.push(year)
      });
      this.year_actual == '0' ? this.year_actual = years_none[years_none.length - 1] : this.year_actual = this.CORE.Year_Actual;
      this.API.ObtenerSemanas(this.CORE.Year_Actual, this.CORE.Empresa_Actual, this.CORE.Tienda_Actual).subscribe(
        (data: any) => {
          this.CORE.DT_Semanas = data["semanas"]
          if (this.CORE.primeraCargaPrincipal === 'Cargado') {
            this.CORE.semana_inicial_primera_carga_principal = this.CORE.DT_Semanas.length - 8;
            this.CORE.semana_final_primera_carga_principal = this.CORE.DT_Semanas.length;
            this.CORE.primeraCargaPrincipal = 'Descargado';
            this.GenerarTabla(this.CORE.semana_inicial_primera_carga_principal, this.CORE.semana_final_primera_carga_principal);
          } else {
            this.GenerarTabla(this.CORE.semana_inicial, this.CORE.semana_final);
          }
        }
      );
    });
  }
  toggleSpinner() {
    /* var spinner = document.getElementById('spinner_carga_tabla_detallada') as HTMLDivElement;
    spinner.classList.toggle('visually-hidden'); */
  }

  arraySku_50_50: string[] = [];
  arraySku_80_20: string[] = [];
  arraySku_95_5: string[] = [];

  FormatearCadenaSKU(array: string[]) {
    var cadena: string = '';
    array.forEach(elemento => {
      cadena += `${elemento}+`;
    });
    cadena = cadena.substring(0, cadena.length - 1)
    return cadena;
  }

  ObtenerSKU8020() {
    this.arraySku_50_50 = [];
    this.arraySku_80_20 = [];
    this.arraySku_95_5 = [];

    (this.Productos).forEach(venta => {
      if (venta.tipologia == 'TIPOLOGIA 1') {
        this.arraySku_50_50.push(venta.sku);
      }
      if (venta.tipologia == 'TIPOLOGIA 1' || venta.tipologia == 'TIPOLOGIA 2') {
        this.arraySku_80_20.push(venta.sku);
      }
      if (venta.tipologia == 'TIPOLOGIA 1' || venta.tipologia == 'TIPOLOGIA 2' || venta.tipologia == 'TIPOLOGIA 3') {
        this.arraySku_95_5.push(venta.sku);
      }
    });

    this.CORE.busqueda_50_50 = this.FormatearCadenaSKU(this.arraySku_50_50);
    this.CORE.busqueda_80_20 = this.FormatearCadenaSKU(this.arraySku_80_20);
    this.CORE.busqueda_95_5 = this.FormatearCadenaSKU(this.arraySku_95_5);
  }
}
