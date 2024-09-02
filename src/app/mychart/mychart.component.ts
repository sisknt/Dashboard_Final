import { Component, OnInit, ViewChild } from '@angular/core';
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
import { arrayData } from "./data-series";
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import { forkJoin, map } from 'rxjs';
/* type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
  position?: any;
}; */
var colors = [
  "#53CA43",
  "#A145FF",
  "#FA6298",
  "#F9D33D",
  "#88E143",
  "#8676FF",
  "#FAA24B",
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
  selector: 'app-mychart',
  templateUrl: './mychart.component.html',
  styleUrls: ['./mychart.component.css']
})
export class MychartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartQuarterOptions!: Partial<ChartOptions>;

  onCheckBoxChangeCadenas(event: any, cadena: string) {
    cadena = cadena.toUpperCase();
    this.ParametroCadena = '';
    if (event.target.checked) {
      if (!this.urlCadena.includes(cadena)) {
        this.urlCadena.push(cadena);
      }
    } else {
      const index = this.urlCadena.indexOf(cadena);
      if (index !== -1) {
        this.urlCadena.splice(index, 1);
      }
    }
    this.urlCadena.forEach(url => {
      this.ParametroCadena += `${url}+`;
    })
    this.ParametroCadena = this.ParametroCadena.slice(0, -1);
    this.VerificarEstadoBtnGenerar();
  }
  onCheckboxChangeCategorias(event: any, categoria: string) {
    categoria = categoria.toUpperCase();
    this.ParametroCategoria = '';
    if (event.target.checked) {
      if (!this.urlCategoria.includes(categoria)) {
        this.urlCategoria.push(categoria)
      }
    } else {
      const index = this.urlCategoria.indexOf(categoria);
      if (index !== -1) {
        this.urlCategoria.splice(index, 1)
      }
    }
    this.urlCategoria.forEach(url => {
      this.ParametroCategoria += `${url}+`
    })
    this.ParametroCategoria = this.ParametroCategoria.slice(0, -1);
    this.VerificarEstadoBtnGenerar();
  }
  onCheckboxChangeLocales(event: any, local: string) {
    local = local.toUpperCase();
    this.ParametroLocal = '';
    if (event.target.checked) {
      if (!this.urlLocal.includes(local)) {
        this.urlLocal.push(local);
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
    this.VerificarEstadoBtnGenerar();
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
  onCheckBoxChangeProductos(){
    let inputValue = document.getElementById('InpAgregarProductos') as HTMLInputElement; 
    let LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    if (inputValue.value.trim() !== '') {
      this.urlProducto.push(inputValue.value);
    } else {
      const index = this.urlProducto.indexOf(inputValue.value);
      if (index !== -1) {
        this.urlProducto.splice(index, 1);
      }
    }
    this.urlProducto.forEach(url => {
      this.ParametroProducto += `${url}+`
      LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
    })
    inputValue.value = '';
    this.VerificarEstadoBtnAgregarProducto();
    this.VerificarEstadoBtnGenerar();
  }
  InpAgregarProductos: string = 'inputAgregarProductos'
  onInputKeyup(event?: KeyboardEvent){
    var inputValue = (event?.target as HTMLInputElement).value;
    let LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    let producto: string = (event?.target as HTMLInputElement).value;
    this.VerificarEstadoBtnAgregarProducto(producto)
    if (event) {
      if (event.key === 'Enter') {
        this.ParametroProducto = '';
        LblAlertProductosAgregadors.innerHTML = '';
        if (producto !== '') {
          if (!this.urlProducto.includes(producto)) {
            this.urlProducto.push(producto);
          }
        } else {
          const index = this.urlProducto.indexOf(producto);
          if (index !== -1) {
            this.urlProducto.splice(index, 1);
          }
        }
        this.urlProducto.forEach(url => {
          this.ParametroProducto += `${url}+`;
          LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
        });
        this.selectedOption = '';
        this.VerificarEstadoBtnAgregarProducto(inputValue);
      }
    } else {
      LblAlertProductosAgregadors.innerHTML = '';
      this.ParametroProducto = '';
      if (this.selectedOption !== '') {
        if (!this.urlProducto.includes(this.selectedOption)) {
          this.urlProducto.push(this.selectedOption);
        }
      } else {
        const index = this.urlProducto.indexOf(this.selectedOption)
        if (index !== -1) {
          this.urlProducto.splice(index, 1);
        }
      }
      this.urlProducto.forEach(url => {
        this.ParametroProducto += `${url}+`;
        LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
      });
      this.selectedOption = '';
      this.VerificarEstadoBtnAgregarProducto(inputValue);
    }
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
  }
  inputValue: string = '';
  DisposicionButtons: string = 'Activado';
  DisposicionGrafico: ChartType = 'bar';
  CheckBoxLocales: boolean = true;
  urlCadena: string[] = [];
  urlCategoria: string[] = [];
  urlZona: string[] = [];
  urlLocal: string[] = [];
  urlProducto: string[] = [];
  // Arrays Filtros
  FiltroCadena: string[] = [];
  FiltroCategoria: string[] = [];
  FiltroZona: string[] = [];
  FiltroLocal: string[] = [];
  // Arrays Datalist
  FiltroSku: string[] = [];
  FiltroCodigo: string[] = [];
  FiltroDescripcion: string[] = [];
  DataListProductos: string[] = [];
  // Parametros
  ParametroGeneral: string = '';
  MiDataListProductos: FiltroProducto[] = [];
  // Parametros
  ParametroCadena: string = '';
  ParametroCategoria: string = '';
  ParametroZona: string = '';
  ParametroLocal: string = '';
  ParametroProducto: string = '';
  // Tipo
  selectedOption: string = '';
  public TipoDeDato: string = '';
  constructor(private api: ApiService, public core: CoreService) {
    var self = this;
    this.chartOptions = {
      series: [
        {
          name: "Año",
          data: [],
          /* data: this.makeData(), */
        }
      ],
      chart: {
        id: "barYear",
        height: 400,
        width: "100%",
        type: "bar",
        events: {
          dataPointSelection: (e, chart, opts: any) => {
            var quarterChartEl = document.querySelector("#chart-quarter");
            var yearChartEl = document.querySelector("#chart-year");

            if (opts.selectedDataPoints[0].length === 1) {
              if (quarterChartEl!.classList.contains("active")) {
                this.updateQuarterChart(chart, "barQuarter");
              } else {
                yearChartEl!.classList.add("chart-quarter-activated");
                quarterChartEl!.classList.add("active");
                this.updateQuarterChart(chart, "barQuarter");
              }
            } else {
              this.updateQuarterChart(chart, "barQuarter");
            }

            if (opts.selectedDataPoints[0].length === 0) {
              yearChartEl!.classList.remove("chart-quarter-activated");
              quarterChartEl!.classList.remove("active");
            }
          },
          updated: (chart) => {
            this.updateQuarterChart(chart, "barQuarter");
          }
        }
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: "75%",
          dataLabels: {
            position: "bottom"
          }
        }
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function (val: any, opt) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      noData: {
        text: "Cargando datos..."
      },
      colors: colors,
      states: {
        normal: {
          filter: {
            type: "desaturate"
          }
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: {
            type: "darken",
            value: 1
          }
        }
      },
      tooltip: {
        x: {
          formatter: function (val: any) {
            return "Año: " + val + ""
          }
          /* title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          } */
        },
        y: {
          formatter: function (val: any) {
            if (self.TipoDeDato === 'SOLES') {
              return "S/. " + core.ComaMiles(val) + " Soles";
            } else {
              return "Uni. " + core.ComaMiles(val) + " Piezas";
            }
          },
          title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          }
        }
      },
      title: {
        text: `Resultado anual`,
        offsetX: 15
      },
      subtitle: {
        text: "(Click sobre la barra para ver detalles)",
        offsetX: 15
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
    this.chartQuarterOptions = {
      series: [
        {
          name: "quarter",
          data: []
        }
      ],
      chart: {
        id: "barQuarter",
        height: 600,
        width: "100%",
        type: "bar",
        stacked: true,
        stackType: 'normal',
      },
      plotOptions: {
        bar: {
          columnWidth: "98%",
          horizontal: false,
        }
      },
      legend: {
        show: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          }
        },
        xaxis: {
          lines: {
            show: true,
          }
        }
      },
      yaxis: {
        labels: {
          show: false,
        }
      },
      title: {
        text: "Resultado semanal",
        offsetX: 10
      },
      tooltip: {
        x: {
          formatter: function (val: any) {
            return val
          }
        },
        y: {
          formatter: function (val: any) {
            if (self.TipoDeDato === 'SOLES') {
              return "S/. " + core.ComaMiles(val) + " Soles"
            } else {
              return "Uni. " + core.ComaMiles(val) + " Piezas"
            }
          },
          /* title: {
            formatter: function (val: any, opts: any) {
              return opts.w.globals.labels[opts.dataPointIndex];
            }
          } */
        }
      },
      xaxis: {
        tooltip: {
          formatter: function(val, opts) {
            return val + "..."
          }
        }
      },
      noData: {
        text: "(Click sobre la barra anual para añadir datos)"
      },
    };
  }
  public makeData(): any {
    var dataSet = arrayData;
  }
  public updateQuarterChart(sourceChart: any, destChartIDToUpdate: any) {
    var series = [];
    var seriesIndex = 0;
    var newcolors = [];

    if (sourceChart.w.globals.selectedDataPoints[0]) {
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        var yearSeries = sourceChart.w.config.series[seriesIndex];
        series.push({
          name: yearSeries.data[selectedIndex].x,
          data: yearSeries.data[selectedIndex].quarters
        });
        newcolors.push(yearSeries.data[selectedIndex].color);
      }

      if (series.length === 0) {
        series = [
          {
            data: []
          }
        ]
      };
      if (newcolors.length !== 0) {
        this.DisposicionButtons = 'Desactivado';
        this.disableInputsAndLabels();
      } else {
        this.DisposicionButtons = 'Activado';
        this.disableInputsAndLabels();
      }
      return window.ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
        series: series,
        colors: newcolors,
        fill: {
          colors: newcolors
        }
      });
    }
  }
  ngOnInit(): void {
    this.TipoDeDato = 'SOLES';
    this.GenerarPeticionApi();
    this.obtenerFiltros();
    this.VerificarEstadoBtnGenerar();
    this.VerificarEstadoBtnAgregarProducto('');
    this.VerificarEstadoBtnRestablecerProducto();
  }
  obtenerFiltros(){
    let Filtros: FiltroJson;
    this.api.ObtenerFiltrosComparativo(this.core.Empresa_Actual).subscribe((http: any)=>{
      Filtros = http;
      Filtros.cadenas.forEach(cadena => {
        this.urlCadena.push(cadena);
        this.FiltroCadena.push(cadena);
      });
      Filtros.categorias.forEach(categoria => {
        this.urlCategoria.push(categoria);
        this.FiltroCategoria.push(categoria);
      });
      Filtros.zonas.forEach(zona => {
        this.urlZona.push(zona);
        this.FiltroZona.push(zona);
      });
      Filtros.locales_tienda.forEach(local => {
        this.urlLocal.push(local)
        this.FiltroLocal.push(local)
      })
      Filtros.productos.forEach(producto => {
        this.FiltroSku.push(producto.sku);
        this.FiltroCodigo.push(producto.codigo_interno);
        this.FiltroDescripcion.push(producto.nombre);
        const miproducto: FiltroProducto = {
          sku: producto.sku,
          codigo_interno: producto.codigo_interno,
          nombre: producto.nombre
        };
        this.MiDataListProductos.push(miproducto)
      });
      this.FiltroDescripcion.forEach(uni => {
        this.DataListProductos.push(uni)
        if (!this.DataListProductos.includes(uni)) {
        }
      });
      this.FiltroSku.forEach(uni => {
        this.DataListProductos.push(uni);
        if (!this.DataListProductos.includes(uni)) {
        }
      })
      this.FiltroCodigo.forEach(uni => {
        this.DataListProductos.push(uni)
        if (!this.DataListProductos.includes(uni)) {
        }
      });
    });
    console.log(this.DataListProductos)
  }
  invertirArray(array: string[]): string[] {
    const longitud = array.length;
    const arrayInvertido: string[] = [];
    for (let i = longitud - 1; i >= 0; i--) {
      arrayInvertido.push(array[i]);
    }
    return arrayInvertido;
  }
  cambiarGrafico(grafico: ChartType) {
    this.DisposicionGrafico = grafico;
    if (grafico === 'bar') {
      this.chartQuarterOptions.chart = {
        id: "barQuarter",
        height: 600,
        width: "100%",
        type: grafico,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      }
      this.chartQuarterOptions.stroke = {
        curve: 'straight'
      }
    } else {
      if (grafico === 'area') {
        this.chartQuarterOptions.chart = {
          id: "barQuarter",
          height: 600,
          width: "100%",
          type: grafico,
          stacked: false,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
            export: {
              csv: {
                filename: undefined,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
              },
              svg: {
                filename: undefined,
              },
              png: {
                filename: undefined,
              }
            },
            autoSelected: 'zoom'
          },
        }
        this.chartQuarterOptions.stroke = {
          curve: 'smooth'
        }
      } else {
        this.chartQuarterOptions.chart = {
          id: "barQuarter",
          height: 600,
          width: "100%",
          type: grafico,
          stacked: false,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
            export: {
              csv: {
                filename: undefined,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
              },
              svg: {
                filename: undefined,
              },
              png: {
                filename: undefined,
              }
            },
            autoSelected: 'zoom' 
          },
        }
        this.chartQuarterOptions.stroke = {
          curve: 'stepline'
        }
      }
    }
  }
  cambiarStacked(tipo: string) {
    const StackType: "normal" | "100%" | undefined = tipo === "normal" || tipo === "100%" ? tipo : undefined;
    this.chartQuarterOptions.chart = {
      id: "barQuarter",
      height: 600,
      width: "100%",
      type: this.DisposicionGrafico,
      stacked: true,
      stackType: StackType
    }
  }
  disableInputsAndLabels() {
    const containerStacked = document.querySelector('#GraficsRadioConfiguracionStacked') as HTMLDivElement;
    const containerType = document.querySelector('#GraficsRadioConfiguracionType') as HTMLDivElement;
    const BtnFiltros = document.getElementById('BtnFiltros') as HTMLButtonElement;
    const containerTipoDato = document.querySelector('#GraficsRadioConfiguracionTypeDato') as HTMLDivElement;
    if (this.DisposicionButtons === 'Desactivado') {
      const inputsStacked = containerStacked.getElementsByTagName('input');
      const labelsStacked = containerStacked.getElementsByTagName('label');
      const inputsType = containerType.getElementsByTagName('input');
      const labelsType = containerType.getElementsByTagName('label');
      const inputTipoDato = containerTipoDato.getElementsByTagName('input');
      const labelTipoDato = containerTipoDato.getElementsByTagName('label');
      for (let i = 0; i < inputsType.length; i++) {
        inputsType[i].setAttribute('disabled', 'true');
        labelsType[i].setAttribute('disabled', 'true');
      }
      for (let i = 0; i < inputsStacked.length; i++) {
        inputsStacked[i].setAttribute('disabled', 'true');
        labelsStacked[i].setAttribute('disabled', 'true');
      }
      BtnFiltros.setAttribute('disabled', 'true');
      for (let i = 0; i < inputTipoDato.length; i++) {
        inputTipoDato[i].setAttribute('disabled', 'true');
        labelTipoDato[i].setAttribute('disabled', 'true');
      }
    } else {
      const inputsStacked = containerStacked.getElementsByTagName('input');
      const labelsStacked = containerStacked.getElementsByTagName('label');
      const inputsType = containerType.getElementsByTagName('input');
      const labelsType = containerType.getElementsByTagName('label');
      const inputTipoDato = containerTipoDato.getElementsByTagName('input');
      const labelTipoDato = containerTipoDato.getElementsByTagName('label');
      for (let i = 0; i < inputsType.length; i++) {
        inputsType[i].removeAttribute('disabled');
        labelsType[i].removeAttribute('disabled');
      }
      for (let i = 0; i < inputsStacked.length; i++) {
        inputsStacked[i].removeAttribute('disabled');
        labelsStacked[i].removeAttribute('disabled');
      }
      BtnFiltros.removeAttribute('disabled');
      for (let i = 0; i < inputTipoDato.length; i++) {
        inputTipoDato[i].removeAttribute('disabled');
        labelTipoDato[i].removeAttribute('disabled');
      }
    }
  }
  updateSeries(tipo: string){
    this.TipoDeDato = tipo;
    let dataItems: DataItem[] = []
    var contador: number = 0;
    this.Comparativo.forEach(años => {
      let Quaters: Quarter[] = [];
      años.semanas.forEach(semana => {
        if (this.TipoDeDato === 'SOLES') {
          const quarter: Quarter = {
            x: semana.periodo,
            /* x: semana.periodo.split('. ')[1].split(' (')[0], */
            y: Math.floor(semana.monto),
          }
          Quaters.push(quarter);
        } else {
          const quarter: Quarter = {
            x: semana.periodo,
            /* x: semana.periodo.split('. ')[1].split(' (')[0], */
            y: Math.floor(semana.cantidad),
          }
          Quaters.push(quarter);
        }
      });
      if (this.TipoDeDato === 'SOLES') {
        const datitosItem: DataItem = {
          x: años.year,
          y: Math.floor(años.monto),
          color: colors[contador],
          quarters: Quaters,
        };
        dataItems.push(datitosItem);
      } else {
        const datitosItem: DataItem = {
          x: años.year,
          y: Math.floor(años.cantidad),
          color: colors[contador],
          quarters: Quaters,
        };
        dataItems.push(datitosItem);
      }
      contador++;
    });
    const YearData: Jdato = {
      name: 'Año',
      data: dataItems,
    }
    this.chartOptions.series = [YearData];
  }
  Comparativo: JsonComparativo[] = [];
  GenerarPeticionApi() {
    this.chartOptions.series = [];
    this.BuscarProductos();
    this.VerificarParametros();
    console.log(this.ParametroZona);
    this.api.ObtenerComparativaAnual(this.core.Empresa_Actual, this.ParametroCadena, this.ParametroCategoria, this.ParametroZona, this.ParametroProducto).subscribe((data: any) => {
      this.Comparativo = data["comparativo"];
      this.updateSeries(this.TipoDeDato)
    });
  }
  BuscarProductos() {
    const ArrayProductos: string[] = this.core.SepararElementosDesdeTexto(this.ParametroProducto);
    const ParametroSKU: string[] = [];
    this.MiDataListProductos.forEach(producto => {
      if (ArrayProductos.includes(producto.sku) || ArrayProductos.includes(producto.codigo_interno) || ArrayProductos.includes(producto.nombre)) {
        if (!ParametroSKU.includes(producto.sku)) {
          ParametroSKU.push(producto.sku)
        }
      }
    });
    this.ParametroProducto = '';
    ParametroSKU.forEach(url => {
      this.ParametroProducto += `${url}+`;
    });
    this.ParametroProducto = this.ParametroProducto.slice(0, -1);
  }
  LimpiarParametroProductos(){
    var InpAgregarProductos = document.getElementById('InpAgregarProductos') as HTMLButtonElement;
    var LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    InpAgregarProductos.value = '';
    this.ParametroProducto = '';
    this.urlProducto = [];
    LblAlertProductosAgregadors.innerHTML = 'Click en "Agregar" para añadir productos a buscar...';
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
  }
  VerificarEstadoBtnGenerar(){
    const BtnGenerar = document.getElementById('BtnGenerar') as HTMLButtonElement;
    if (this.urlCadena.length > 0) {
      BtnGenerar.removeAttribute('disabled');
    } else {
      BtnGenerar.setAttribute('disabled', 'true');
    }
  }
  VerificarEstadoBtnAgregarProducto(texto?: string){
    const BtnAgregarProducto = document.getElementById('BtnAgregarProducto') as HTMLButtonElement;
    if (texto !== '') {
      BtnAgregarProducto.removeAttribute('disabled')
    } else {
      BtnAgregarProducto.setAttribute('disabled', 'true');
    }
  }
  VerificarEstadoBtnRestablecerProducto(){
    const BtnRestablecerProducto = document.getElementById('BtnRestablecerProducto') as HTMLButtonElement;
    if (this.urlProducto.length > 0) {
      BtnRestablecerProducto.removeAttribute('disabled')
    } else {
      BtnRestablecerProducto.setAttribute('disabled', 'true');
    }
  }
  cambiarParametroCadena(cadena: string){
    this.ParametroCadena = cadena.toUpperCase();
    this.VerificarEstadoBtnGenerar();
  }
  VerificarParametros() {
    console.log(this.ParametroLocal)
    if (this.ParametroCadena === '') {
      this.ParametroCadena = 'TODAS_CADENAS';
    }
    if (this.ParametroCategoria === '') {
      this.ParametroCategoria = 'TODAS_CATEGORIAS';
    }
    if (this.ParametroZona === '') {
      this.ParametroZona = 'TODAS_ZONAS';
    }
    if (this.ParametroLocal === '') {
      this.ParametroLocal = 'TODOS_LOCALES';
    }
    if (this.ParametroProducto === '') {
      this.ParametroProducto = 'TODOS_SKUS';
    }
  }
  RecolectarDescripcion(){
    return "Esto es un texto"
  }
}
interface JsonComparativo {
  year: string;
  monto: number;
  cantidad: number;
  semanas: JsonSemanas[];
}[];
interface JsonSemanas {
  periodo: string;
  monto: number;
  cantidad: number;
};
// Chart
interface Jdato {
  name: string;
  data: DataItem[];
}
interface DataItem {
  x: string;
  y: number;
  color: string;
  quarters: Quarter[];
}
interface Quarter {
  x: string;
  y: number;
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