import { Component, OnInit, ViewChild } from '@angular/core';
import { grafics } from './graficos';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStates,
  ApexGrid,
  ApexTitleSubtitle,
  ApexNoData,
  ChartType,
  ApexStroke,
  ApexXAxis,
  ApexMarkers,
  ApexFill
} from "ng-apexcharts";
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  subtitle: ApexTitleSubtitle;
  colors: string[];
  states: ApexStates;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  noData: ApexNoData;
  stroke: ApexStroke;
  categories: string[];
  markers: ApexMarkers;
  fill: ApexFill;
};
declare global {
  interface Window {
    Apex: any;
  }
}
window.Apex = {
  chart: {
    toolbar: {
      show: false
    }
  },
  tooltip: {
    shared: false
  },
  legend: {
    show: false
  }
};
@Component({
  selector: 'app-stats-producto',
  templateUrl: './stats-producto.component.html',
  styleUrls: ['./stats-producto.component.css']
})
export class StatsProductoComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private grafic: grafics, private api: ApiService, private core: CoreService) {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: []
        }
      ],
      chart: {
        type: 'bar',
        height: 624,
        width: '100%',
        offsetX: -14,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 1000
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '92%',
          borderRadius: 5,
          horizontal: false,
          colors: {
            ranges: [{
              from: -1000,
              to: -0,
              // rojo
              color: '#F14F87',
            }],
          },
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: ['#2b908f'],
      markers: {
        colors: ["#FFFFFF"]
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
      xaxis: {
        categories: [],
        type: "category",
        labels: {
          show: true,
          formatter: function (val: any) {
            return core.SimplificarSemanasANumeros(String(val))
          },
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
        },
      },
      noData: {
        text: 'Obteniendo datos del producto...'
      },
      tooltip: {
        x: {
          formatter: function (val: any) {
            return val;
          }
        },
        y: {
          formatter: function (val: any) {
            return `S/. ${Intl.NumberFormat('es-MX').format(Number(val.toFixed(2)))}`
          },
        },
        style: {
          fontSize: '24px',
        },
      },
    };
  }

  pseudo_datos_cantidad: number[] = [33, 25, 18, 26, 6, 40, 43, -38, 50, 67, 15, 23, 25, 35, 51, 53, 43, 34, 34, 22, 41, 40, 59, 22, 20, -17, 41, 46, 28, 47, 60, 30, 54, 128, 21, 32, 11, 31, 30, 78, 43, -18, 32, 25, 56, 63, 53, 94, 65, 53, 58, 36, 80]
  pseudo_datos_semanas: string[] = ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5', 'Sem. 6', 'Sem. 7', 'Sem. 8', 'Sem. 9', 'Sem. 10', 'Sem. 11', 'Sem. 12', 'Sem. 13', 'Sem. 14', 'Sem. 15', 'Sem. 16', 'Sem. 17', 'Sem. 18', 'Sem. 19', 'Sem. 20', 'Sem. 21', 'Sem. 22', 'Sem. 23', 'Sem. 24', 'Sem. 25', 'Sem. 26', 'Sem. 27', 'Sem. 28', 'Sem. 29', 'Sem. 30', 'Sem. 31', 'Sem. 32', 'Sem. 33', 'Sem. 34', 'Sem. 35', 'Sem. 36', 'Sem. 37', 'Sem. 38', 'Sem. 39', 'Sem. 40', 'Sem. 41', 'Sem. 42', 'Sem. 43', 'Sem. 44', 'Sem. 45', 'Sem. 46', 'Sem. 47', 'Sem. 48', 'Sem. 49', 'Sem. 50', 'Sem. 51', 'Sem. 52', 'Sem. 53']
  datos_tienda_temporal_yaxis: number[] = [20, 40, 66, 78]
  datos_tienda_temporal_xaxis: string[] = ['Cassinelli', 'Sodimac', 'Maestro', 'Promart']
 
  Producto: producto[] = [] as producto[];
  async ngOnInit() {
    await this.obtenerYears();
    await this.obtenerFiltros();
    this.GenerarPeticionApi();
  }
  sumaTotalProductoPreciso: number = 0;
  sumaTotalProductoRedondeado: number = 0;
  async GenerarPeticionApi() {
    this.Producto = [] as producto[];
    var series: number[] = [];
    this.sumaTotalProductoPreciso = 0;
    this.sumaTotalProductoRedondeado = 0;
    this.VerificarParametros();
    this.Producto = await this.api.ObtenerEstadisticasProductos(this.core.Year_Actual, this.core.Empresa_Actual, this.urlCadena, this.urlLocal, [this.ParametroProducto]);
    if (this.Producto[0]) {
      series = this.FiltroSemanas.map(periodo => {
        var encontrado = this.Producto[0].ventas.find(venta => venta.periodo === periodo);
        return encontrado ? (encontrado.monto > 0) ? Math.floor(encontrado.monto) : Math.ceil(encontrado.monto) : 0 
      })
      this.Producto[0].ventas.forEach(venta => {
        this.sumaTotalProductoPreciso += venta.monto
        if (venta.monto > 0) {
          this.sumaTotalProductoRedondeado += Math.floor(venta.monto)
        } else {
          this.sumaTotalProductoRedondeado += Math.ceil(venta.monto)
        }
      });
    } else {
      series = this.FiltroSemanas.map(periodo => {
        return 0;
      })
    }
    this.sumaTotalProductoPreciso = Number(this.sumaTotalProductoPreciso.toFixed(2))
    await this.updateSeries(series)
  }
  YearActual: string = '';
  FiltroYears: string[] = [];
  FiltroSemanas: string[] = [];
  async obtenerYears() {
    try {
      this.FiltroYears = await this.api.Fetch_ObtenerYears(this.core.Empresa_Actual)
      this.core.Year_Actual = this.FiltroYears[this.FiltroYears.length - 1]
      this.YearActual = this.core.Year_Actual;
      this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
        (response: any) => {
          this.FiltroSemanas = response["semanas"]
        }
      );
      this.FiltroYears.reverse()
    } catch (error) {
      console.error(error)
    }
  }
  Filtros: FiltroJson = {
    cadenas: [],
    categorias: [],
    productos: [],
    ubicaciones: [],
  }
  async obtenerFiltros() {
    this.Filtros = await this.api.Fetch_ObtenerFiltrosComparativo(this.core.Empresa_Actual);
    this.Filtros.cadenas.forEach(filtro => {
      this.urlCadena.push(filtro)
    });
    this.Filtros.ubicaciones.forEach(ubicacion => {
      this.urlLocal.push(ubicacion.codigo)
    })
  }
  // Grafico de ventas: Ventas por zona
  // Información de producto: Nombre, descripción, categoría, SKU.
  // Grafico de precios: Precio actual y comparativa con precios anteriores.
  // Grafico de Tendencia: Tendencia de ventas (gráfico de líneas o barras).
  // Tabla y grafico: Comparación de ventas con otros productos similares.
  VerificarParametros() {
    if (this.ParametroProducto === '') {
      //console.log(this.core.Empresa_Actual)
      if (this.core.Empresa_Actual === 'KANTU') {
        this.ParametroProducto = '1997564';
      } else {
        this.ParametroProducto = '111992';
      }
    }
    if (this.urlLocal === [] as []) {
      this.urlLocal = ['TODOS_LOCALES']
    }
    if (this.urlCadena === [] as []) {
      this.urlCadena = ['TODAS_CADENAS']
    }
  }
  async onSelectChangeYears(event: Event) {
    this.core.Year_Actual = (event.target as HTMLSelectElement).value;
    this.YearActual = this.core.Year_Actual;
    this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
      (response: any) => {
        this.FiltroSemanas = response["semanas"]
        //console.log(this.FiltroSemanas)
      }
    );
  }
  onSelectChangeSemanaInicial(event: Event) {
    let selectedValue: string = (event.target as HTMLSelectElement).value;
    selectedValue = selectedValue.split(' (')[0].split('. ')[1];
    this.core.semana_inicial = Number(selectedValue);
  }
  onSelectChangeSemanaFinal(event: Event) {
    let selectedValue: string = (event.target as HTMLSelectElement).value;
    selectedValue = selectedValue.split(' (')[0].split('. ')[1];
    this.core.semana_final = Number(selectedValue);
  }

  onCheckBoxChangeCadenas(event: any, cadena: string) {
    cadena = cadena.toUpperCase();
    if (this.urlCadena.includes(cadena)) {
      this.urlCadena.splice(this.urlCadena.indexOf(cadena),1)
    } else {
      this.urlCadena.push(cadena)
    }
  }
  CheckBoxLocales: boolean = true;
  urlLocal: string[] = [];
  ParametroLocal: string = '';
  FiltroLocal: string[] = [];
  ParametroProducto = '';
  ParametroCadena = '';
  urlCadena: string[] = [];
  DeseleccionarCheckBoxLocales() {
    if (this.CheckBoxLocales == true) {
      this.urlLocal = []
      this.ParametroLocal = '';
      this.CheckBoxLocales = false;
    } else {
      this.CheckBoxLocales = true;
      this.urlLocal = []
      this.Filtros.ubicaciones.forEach(ubicacion => {
        this.urlLocal.push(ubicacion.codigo)
      })
    }
  }
  onCheckboxChangeLocales(event: any, local: string) {
    if (event.target.checked) {
      if (!this.urlLocal.includes(local)) {
        this.urlLocal.push(local)
      }
    } else {
      if (this.urlLocal.includes(local)) {
        this.urlLocal.splice(this.urlLocal.indexOf(local), 1)
      }
    }
  }
  onProductosRetornados(productosSeleccionados: string[]) {
    var texto: string = '';
    this.ParametroProducto = '';
    productosSeleccionados.forEach(url => {
      texto += `${url}+`
    });
    this.ParametroProducto = texto.slice(0, -1);
    this.GenerarPeticionApi();
  }
  randerizar_graficos() {

  }
  async updateSeries(series: number[]) {
    this.chartOptions.series = [
      {
        data: series,
        name: ''
      }
    ]
    var newFiltros: string[] = []
    this.FiltroSemanas.forEach(semana => {
      newFiltros.push(this.core.SimplificarSemanasANumeros(semana))
    })
    this.chartOptions.xaxis = {
      categories: this.FiltroSemanas,
      type: "category",
        labels: {
          show: true,
          formatter: function (val: any) {
            return String(val).split('. ')[1]?.split(' (')[0];
          },
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
        },
    }
    /* this.chartOptions!.xaxis = {
      categories: this.FiltroSemanas
    } */
    /* this.chart?.updateOptions!({
      xaxis: {
        categories: this.FiltroSemanas
      }
    }) */
  }

  actualizar_grafico() {
    this.randerizar_graficos();
  }

  mostrar_ocultar_xaxis() {
    var HTML_mostrar_xaxis = document.getElementById('HTML_mostrar_xaxis') as HTMLDivElement;
    var HTML_mostrar_yaxis = document.getElementById('HTML_mostrar_yaxis') as HTMLDivElement;
    var HTML_btn_mostrar_ocultar_coordenada = document.getElementById('HTML_btn_mostrar_ocultar_coordenada') as HTMLButtonElement;
    HTML_mostrar_xaxis.classList.toggle('opacity-0')
    HTML_mostrar_yaxis.classList.toggle('opacity-0')
    if (HTML_btn_mostrar_ocultar_coordenada.innerHTML == 'Mostrar Coordenadas') {
      HTML_btn_mostrar_ocultar_coordenada.innerHTML = 'Ocultar Coordenadas';
    } else {
      HTML_btn_mostrar_ocultar_coordenada.innerHTML = 'Mostrar Coordenadas';
    }
  }
}
// Filtros
interface FiltroJson {
  cadenas: string[];
  categorias: string[];
  ubicaciones: ubicaciones[];
  productos: FiltroProducto[];
}
interface ubicaciones {
  cadena: string;
  codigo: string;
  local_tienda: string;
  zona: string;
}
interface FiltroProducto {
  sku: string;
  codigo_interno: string;
  nombre: string;
}
interface producto {
  cadena: string;
  categoria: string,
  codigo_interno: string;
  descripcion: string;
  empresa: string;
  estado_interno: string;
  estado_tienda: string;
  sku: string;
  stock_actual: string;
  ventas: venta[];
}
interface venta {
  monto: number;
  periodo: string;
  semana: string;
}