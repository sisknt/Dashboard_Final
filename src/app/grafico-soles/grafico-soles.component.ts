import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import { arrayData } from "./data-series";
import Swal from 'sweetalert2';
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
} from "ng-apexcharts";
var colors = [
  "#0d6efd",
  "#8540f5",
  "#6610f2",
  "#6f42c1",
  "#d63384",
  "#ffc107",
  "#198754",
  "#1aa179",
  "#087990",
];
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
  tooltip: any; //ApexTooltip;
  noData: ApexNoData;
  stroke: ApexStroke;
  categories: string[];
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
  selector: 'app-grafico-soles',
  templateUrl: './grafico-soles.component.html',
  styleUrls: ['./grafico-soles.component.css']
})
export class GraficoSolesComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("chart2") chart2!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartQuarterOptions!: Partial<ChartOptions>;
  public TipoDeDato: string = 'SOLES';

  constructor(private api: ApiService, public core: CoreService, private cdr: ChangeDetectorRef) {
    var sel = this;
    this.chartOptions = {
      series: [
        {
          data: this.totales_ejes.cantidad
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        width: "100%",
        events: {
          dataPointSelection: (opts: any, chart: any, config: any) => {
            const dataIndex = config.dataPointIndex;
            const seriesIndex = config.seriesIndex;
            const dataPoint: any = this.chartOptions.series![seriesIndex].data[dataIndex];
            this.actualizarQuarter(dataPoint, this.totales_semana)
          },
        },
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
    };
    this.chartQuarterOptions = {
      series: this.totales_quarter,
      chart: {
        id: "barQuarter",
        height: 600,
        width: "100%",
        type: "bar",
        stacked: true
      },
      plotOptions: {
        bar: {
          columnWidth: "98%",
          horizontal: false
        }
      },
      legend: {
        show: false
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Quarterly Results",
        offsetX: 10
      },
      tooltip: {
        x: {
          formatter: function (val: any, opts: any) {
            return opts.w.globals.seriesNames[opts.seriesIndex];
          }
        },
        y: {
          title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      }
    };
  }
  urlCadena: string[] = [];
  urlCategoria: string[] = [];
  urlZona: string[] = [];
  urlLocal: string[] = [];
  urlProducto: string[] = [];
  // Arrays Filtros
  CheckBoxLocales: boolean = true;
  FiltroCadena: string[] = [];
  FiltroCategoria: string[] = [];
  FiltroZona: string[] = [];
  FiltroLocal: string[] = [];
  // Arrays Datalist
  FiltroSemanas: string[] = [];
  FiltroSku: string[] = [];
  FiltroCodigo: string[] = [];
  FiltroDescripcion: string[] = [];
  FiltroYears: string[] = [];
  DataListProductos: string[] = [];
  // component datos
  totales_semana: semana[] = [];
  tipo_data: string = 'UNI';
  // Parametros
  ParametroZona: string = '';
  ParametroLocal: string = '';
  ParametroProducto: string = '';
  // Grafico
  categorias: string[] = [];
  totales_quarter: quarter[] = [];
  totales_ejes: ejes = {
    cantidad: [],
    soles: []
  };
  VerificarParametros() {
    if (this.ParametroLocal === '') {
      this.ParametroLocal = 'TODOS_LOCALES'
    }
  }
  async obtenerYears() {
    try {
      this.FiltroYears = await this.api.Fetch_ObtenerYears(this.core.Empresa_Actual)
      console.log('obteneniendo semanas')
      this.core.Year_Actual = this.FiltroYears[this.FiltroYears.length-1]
      await this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
        (response: any) => {
          console.log(response)
          this.FiltroSemanas = response["semanas"]
        }
      );
      this.FiltroYears.reverse()
      console.log(this.core.Year_Actual)
    } catch (error) {
      console.error(error)
    }
  }
  async ngOnInit() {
    this.obtenerFiltros()
    await this.obtenerYears()
    var data = await this.api.Fetch_ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, 1, 54, "TODOS_LOCALES")
    this.totales_semana = data;
    await this.iniciar_grafico_totales(this.totales_semana);
    this.UpdateSeries();
  }
  async iniciar_grafico_totales(semanas: semana[]) {
    semanas.forEach(semana => {
      this.categorias = Array.from(new Set(semana.categorias.map(categoria => categoria.categoria)))
    });
    this.categorias.forEach((categoria: string, index: number) => {
      var eje: eje = {
        x: categoria,
        y: 0,
        fillColor: colors[index]
      }
      this.totales_ejes.cantidad.push(eje)
      this.totales_ejes.soles.push(eje)
    });
    this.aplicarSumatoriaCategorizado(semanas, this.totales_ejes)
  }
  UpdateSeries() {
    this.chartOptions.series = [
      {
        data: this.totales_ejes.cantidad
      }
    ]
  }
  async GenerarPeticionApi() {
    this.chartOptions.series = [];
    this.VerificarParametros();
    console.log(this.core.semana_inicial, this.core.semana_final)
    if (this.core.semana_inicial <= this.core.semana_final) {
      var data = await this.api.Fetch_ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, this.core.semana_inicial, this.core.semana_final, this.ParametroLocal)
      this.totales_semana = data
      this.iniciar_grafico_totales(this.totales_semana)
    } else {
      const Swal = require('sweetalert2')
      Swal.fire({
        title: "Fechas incoherentes",
        text: "¿Estas segur@ que la fecha de inicio es menor que la fecha de fin?",
        icon: "question"
      });
    }
    
  }
  async obtenerFiltros() {
    var Filtros: FiltroJson = await this.api.Fetch_ObtenerFiltrosComparativo(this.core.Empresa_Actual)
    console.log(Filtros)
    this.urlCadena, this.FiltroCadena = Filtros.cadenas.map(cadena => cadena);
    this.urlZona, this.FiltroZona = Filtros.zonas.map(zona => zona);
    this.urlLocal, this.FiltroLocal = Filtros.locales_tienda.map(local => local)
    this.FiltroSku = Filtros.productos.map(sku => !this.FiltroSku.includes(sku.sku) ? sku.sku : "");
    this.FiltroCodigo = Filtros.productos.map(codigo => !this.FiltroCodigo.includes(codigo.codigo_interno) ? codigo.codigo_interno : "null");
    this.FiltroDescripcion = Filtros.productos.map(nombre => !this.FiltroDescripcion.includes(nombre.nombre) ? nombre.nombre : "");
  }
  async actualizarQuarter(data: eje, semanas: semana[]) {
    var quarter: quarter = {
      name: data.x,
      data: []
    }
    semanas.forEach(semana => {
      const categoriaBuscada = data.x
      const existeCategoria = semana.categorias.some(categoria => categoria.categoria === categoriaBuscada)
      if (existeCategoria) {
        semana.categorias.forEach(categoria => {
          if (categoria.categoria === data.x) {
            var eje: eje = {
              x: semana.semana,
              y: Number(categoria.monto.toFixed(2)),
              fillColor: data.fillColor
            }
            quarter.data.push(eje)
          }
        });
      } else {
        var eje: eje = {
          x: semana.semana,
          y: 0.00,
          fillColor: data.fillColor
        }
        quarter.data.push(eje)
      }
    });
    if (this.totales_quarter.length > 0) {
      for (let i = 0; i < this.totales_quarter.length; i++) {
        this.totales_quarter.splice(i);
      }
    }
    this.UpdateQuaterSerie(quarter)
  }
  UpdateQuaterSerie(quarter: quarter) {
    this.totales_quarter.push(quarter)
    console.log(this.totales_quarter)

    this.chartQuarterOptions.series = this.totales_quarter
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100);
  }
  aplicarSumatoriaCategorizado(semanas: semana[], totales_ejes: ejes) {
    // Funcion para generar la sumatoria del primer grafico
    semanas.forEach(semana => {
      semana.categorias.forEach(categoria => {
        var sumatoria: number = 0;
        totales_ejes.soles.forEach(eje => {
          if (eje.x === categoria.categoria) {
            sumatoria += categoria.monto
          }
        })
        totales_ejes.soles.forEach(eje => {
          if (eje.x === categoria.categoria) {
            eje.y = Number(sumatoria.toFixed(2))
          }
        });
      })
    });
  }
  async onSelectChangeYears(event: Event){
    this.core.Year_Actual = (event.target as HTMLSelectElement).value;
    await this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, 'TODAS_TIENDAS').subscribe(
      (response: any) => {
        this.FiltroSemanas = response["semanas"]
      }
    );
  }
  
  DeseleccionarCheckBoxLocales() {
    if (this.CheckBoxLocales == true) {
      this.urlLocal = []
      this.ParametroLocal = '';
      this.CheckBoxLocales = false;
    } else {
      this.CheckBoxLocales = true;
      this.FiltroLocal.forEach(local => {
        this.urlLocal.push(local)
      })
    }
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
  onCheckboxChangeZonas(event: any, zona: string) {
    zona = zona.toUpperCase();
    this.ParametroZona = '';
    if (event.target.checked) {
      if (!this.urlZona.includes(zona)) {
        this.urlZona.push(zona)
      }
    } else {
      const index = this.urlZona.indexOf(zona)
      if (index !== -1) {
        this.urlZona.splice(index, 1);
      }
    }
    this.urlZona.forEach(url => {
      this.ParametroZona += `${url}+`;
    });
    this.ParametroZona = this.ParametroZona.slice(0, -1);
  }
  onCheckboxChangeLocales(event: any, local: string) {
    local = local.toUpperCase();
    this.ParametroLocal = '';
    if (event.target.checked) {
      if (!this.urlLocal.includes(local)) {
        this.urlLocal.push(local)
      }
    } else {
      const index = this.urlLocal.indexOf(local)
      if (index !== -1) {
        this.urlLocal.splice(index, 1);
      }
    }
    this.urlLocal.forEach(url => {
      this.ParametroLocal += `${url}+`;
    });
    this.ParametroLocal = this.ParametroLocal.slice(0, -1);
  }
  LimpiarParametroProductos() {
    var InpAgregarProductos = document.getElementById('InpAgregarProductos') as HTMLButtonElement;
    var LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregados') as HTMLDivElement;
    InpAgregarProductos.value = '';
    this.ParametroProducto = '';
    this.urlProducto = []
  }
  VerificarEstadoBtnAgregarProducto(texto?: string) {
    const BtnAgregarProducto = document.getElementById('BtnAgregarProducto') as HTMLButtonElement;
    if (texto !== '') {
      BtnAgregarProducto.removeAttribute('disabled')
    } else {
      BtnAgregarProducto.setAttribute('disabled', 'true')
    }
  }
  VerificarEstadoBtnRestablecerProducto() {
    const BtnRestablecerProducto = document.getElementById('BtnRestablecerProducto') as HTMLButtonElement;
    if (this.urlProducto.length > 0) {
      BtnRestablecerProducto.removeAttribute('disabled')
    } else {
      BtnRestablecerProducto.setAttribute('disabled', 'true')
    }
  }
  VerificarEstadoBtnGenerar() {
    const BtnGenerar = document.getElementById('') as HTMLButtonElement;
    if (this.core.semana_inicial <= this.core.semana_final) {
      BtnGenerar.removeAttribute('disabled')
    } else {
      BtnGenerar.setAttribute('disabled', 'true')
    }
  }
  verificarEstadosBotones() {
    this.VerificarEstadoBtnRestablecerProducto()
    this.VerificarEstadoBtnGenerar()
    this.VerificarEstadoBtnAgregarProducto()
  }
  onInputKeyup(event?: KeyboardEvent) {
    let inputValue = document.getElementById('InpAgregarProductos') as HTMLInputElement;
    let LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregados') as HTMLDivElement;
    let producto: string = (event?.target as HTMLInputElement).value;
    if (event) {
      this.VerificarEstadoBtnAgregarProducto(producto)
      if (event.key === 'Enter') {
        this.ParametroProducto = '';
        LblAlertProductosAgregadors.innerHTML = '';
        if (producto !== '') {
          if (!this.urlProducto.includes(producto)) {
            this.urlProducto.push(producto)
          }
        } else {
          const index = this.urlProducto.indexOf(producto)
          if (index !== -1) {
            this.urlProducto.splice(index, 1)
          }
        }
        this.urlProducto.forEach(url => {
          this.ParametroProducto += `${url}`
          LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
        });
        inputValue.value = '';
        this.VerificarEstadoBtnAgregarProducto(inputValue.value)
      }
    } else {
      LblAlertProductosAgregadors.innerHTML = '';
      this.ParametroProducto = '';
      if (producto !== '') {
        if (!this.urlProducto.includes(inputValue.value)) {
          this.urlProducto.push(inputValue.value)
        }
      } else {
        const index = this.urlProducto.indexOf(inputValue.value)
        if (index !== -1) {
          this.urlProducto.splice(index, 1)
        }
      }
      this.urlProducto.forEach(url => {
        this.ParametroProducto += `${url}+`;
        LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
      });
      inputValue.value = ''
      this.VerificarEstadoBtnAgregarProducto(inputValue.value)
    }
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
  }
}

interface quarter {
  name: string;
  data: eje[];
}
interface semana {
  periodo: string;
  semana: string;
  total_cantidad: number;
  total_soles: number;
  categorias: categoria[];
}
interface categoria {
  monto: number;
  cantidad: number;
  categoria: string;
}
interface eje {
  x: string;
  y: number;
  fillColor?: string;
  strokeColor?: string;
  meta?: any;
  goals?: any;
  barHeightOffset?: number;
  columnWidthOffset?: number;
}
interface ejes {
  cantidad: eje[];
  soles: eje[];
}
// Filtros
interface FiltroJson {
  cadenas: string[];
  categorias: string[];
  zonas: string[];
  locales_tienda: string[];
  productos: FiltroProducto[];
}
interface FiltroProducto {
  sku: string;
  codigo_interno: string;
  nombre: string;
}