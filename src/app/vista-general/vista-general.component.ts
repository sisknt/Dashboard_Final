import { Component, OnInit, ViewChild } from '@angular/core';
import TotalGeneralTiendas from '../models/Total_general_tiendas';
import TotalGrafico from '../models/Total_grafico';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexGrid,
  ApexYAxis,
  ApexForecastDataPoints,
  ApexAnnotations,
  ApexTheme,
  ApexNoData,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  labels: any;
  forecastDataPoints: ApexForecastDataPoints;
  annotations: ApexAnnotations;
  theme: ApexTheme;
  noData: ApexNoData;
  colors: string[];
};

@Component({
  selector: 'app-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class VistaGeneralComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;

  constructor(public core: CoreService, private api: ApiService) {
    this.chartOptions = {
      series: [0,0],
      chart: {
        width: "100%",
        type: "pie",
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        }
      },
      colors: ["#b21f57","#004298"],
      labels: ["Monday","Tuesday"],
      theme: {
        monochrome: {
          enabled: true
        }
      },
      title: {
        text: undefined,
        style: {
          color: '#3A3876',
          fontSize: '32px',
        }
      },
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8,
        }
      },
      noData: {
        text: ''
      },
      tooltip: {
        shared: false,
        style: {
          fontSize: '18px',
        },
        y: {
          formatter: function(val) {
            return `S/. ${Intl.NumberFormat('es-MX').format(Number(val.toFixed(0)))}`;
          }
        }
      }
    };
    this.chartOptions2 = {
      series: [0,0],
      chart: {
        width: "100%",
        type: "pie",
        stacked: true,
        stackType: 'normal',
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        }
      },
      colors: this.core.colores_categorias_eliminable,
      labels: ["Monday","Tuesday"],
      theme: {
        monochrome: {
          enabled: true
        }
      },
      title: {
        text: undefined,
        style: {
          color: '#3A3876',
          fontSize: '32px',
        }
      },
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8
        }
      },
      stroke: {
        width: 0,
      },
      noData: {
        text: ''
      },
      tooltip: {
        shared: true,
        style: {
          fontSize: '18px',
        },
        y: {
          formatter: function(val) {
            return `S/. ${Intl.NumberFormat('es-MX').format(Number(val.toFixed(0)))}`;
          }
        }
      },
    };
  }
  semanaMayor: number = 0;
  Tiendas: string[] = [];
  total_general_tiendas: TotalGeneralTiendas[] = [];
  Total_tiendas: number = 0;
  Porcentajes: number[] = [];
  /* Nuevos datos */
  SetEmpresas: string[] = [];
  SetColorsEmpresas: string[] = [
    "danger",
    "primary",
    "info",
    "secondary",
    "success",
    "warning",
    "light",
    "dark",
  ];
  years: string[] = [];
  totales_empresa: {
    empresa: string,
    monto: number
  }[] = []
  empresas: {
    kantu: {
      tienda: string,
      monto: number
    }[],
    total_kantu: number,
    decor: {
      tienda: string,
      monto: number
    }[],
    total_decor: number
  } = {
      kantu: [],
      total_kantu: 0,
      decor: [],
      total_decor: 0
    }
  categoria_total_empresas!: {
    empresa: string,
    categorias: {
      monto: string,
      cantidad: string,
      categoria: string
    }[],
    cantidad: number,
    monto: number
  };
  /* HTML */
  total_anual_year_anterior_actual: number = 0;
  periodo_siguiente_determinado_por_tendencia: number = 0;
  periodo_anterior_de_comparacion: number = 0;
  periodo_actual_de_comparacion: number = 0;
  porcentaje_de_comparacion_entre_anterior_y_actual: number = 0;

  total_semanas: TotalGrafico[] = [];
  rango_semanas_empresa_tienda: {
    empresa: string,
    cadena: string,
    rango: string,
    cantidad_semanas: number
  }[] = [];
  ConvertirANumero(numero: string) {
    return Number(numero);
  }

  ObtenerTotalEmpresasTiendas(year_actual: string) {
    this.api.ObtenerTotalEmpresasTiendas(String(year_actual)).subscribe(
      (data: any) => {
        this.empresas = data["empresas"]
        this.subirDatosPie1();
      }
    );
  }
  ObtenerYears() {
    this.api.ObtenerYears().subscribe(
      (data: any) => {
        (data["years"] as []).forEach(year => {
          this.years.push(year)
        });
      }
    )
  }
  subirDatosPie1(){
    this.chartOptions.series = [Math.floor(this.empresas.total_kantu), Math.floor(this.empresas.total_decor)]
    this.chartOptions.labels = ["Kantu", "Decor"];
  }
  subirDatosPie2(){
    let mynewlabels: string[] = [];
    let mynewseries: number[] = [];
    this.categoria_total_empresas.categorias.forEach(category => {
      mynewlabels.push(category.categoria);
      mynewseries.push(Math.floor(Number(category.monto)));
    });
    this.chartOptions2.series = mynewseries;
    this.chartOptions2.labels = mynewlabels;
    this.chartOptions2.colors = this.core.colores_categorias_eliminable;
  }

  CambiarDatosAnuales(year: string) {
    this.rango_semanas_empresa_tienda = [];
    this.ObtenerRangoSemanas(year.toString(), 'KANTU', 'MAESTRO');
    this.ObtenerRangoSemanas(year.toString(), 'KANTU', 'PROMART');
    this.ObtenerRangoSemanas(year.toString(), 'KANTU', 'SODIMAC');
    this.ObtenerRangoSemanas(year.toString(), 'DSB', 'MAESTRO');
    this.ObtenerRangoSemanas(year.toString(), 'DSB', 'PROMART');
    this.ObtenerRangoSemanas(year.toString(), 'DSB', 'SODIMAC');
    this.ObtenerTotalEmpresasTiendas(year);
  }

  ObtenerNombreMes(numero: number): string {
    const meses: string[] = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    if (numero >= 1 && numero <= 12) {
      return meses[numero - 1];
    } else {
      throw new Error("Número de mes inválido. Debe ser un número del 1 al 12.");
    }
  }

  ObtenerRangoSemanas(year: string, empresa: string, tienda: string) {
    this.api.ObtenerSemanas(year, empresa, tienda).subscribe(
      (data: any) => {
        console.log(data);
        var semanas: string[] = (data["semanas"] as string[]);
        var fecha_inicial: string = semanas[0].split(' al ')[0].split('(')[1];
        var fecha_final: string = semanas[semanas.length - 1].split(' al ')[1].split(')')[0];

        var fecha_incial_formateada: string = `${fecha_inicial.split('-')[2]} de ${this.ObtenerNombreMes(Number(fecha_inicial.split('-')[1]))}`;
        var fecha_final_formateada: string = "";
        if (fecha_final.split('-')[0] == year) {
          fecha_final_formateada = `${fecha_final.split('-')[2]} de ${this.ObtenerNombreMes(Number(fecha_final.split('-')[1]))}`;
        } else {
          fecha_final_formateada = `${fecha_final.split('-')[2]} de ${this.ObtenerNombreMes(Number(fecha_final.split('-')[1]))} del ${fecha_final.split('-')[0]}`;
        }
        this.rango_semanas_empresa_tienda.push({
          rango: `${fecha_incial_formateada} al ${fecha_final_formateada}`,
          cantidad_semanas: semanas.length,
          empresa: empresa,
          cadena: tienda
        })
        this.rango_semanas_empresa_tienda.sort((a,b) => b.cantidad_semanas - a.cantidad_semanas)
        this.calcularSemanaMayor();
      }
    );
  }

  EstablecerCategoriasEmpresa(year: string, empresa: string) {
    this.api.ObtenerTotalCategoriasEmpresa(empresa, String(year)).subscribe(
      (data: any) => {
        var total_cantidad: number = 0;
        var total_monto: number = 0;
        (data["categorias"] as []).forEach(
          categoria => {
            total_cantidad += categoria["cantidad"];
            total_monto += categoria["monto"];
          }
        );
        
        this.categoria_total_empresas = {
          empresa: empresa,
          categorias: data["categorias"],
          cantidad: total_cantidad,
          monto: total_monto
        }
        this.categoria_total_empresas.categorias.sort((a, b) => Number(b.cantidad) - Number(a.cantidad));
        this.restablecer_colores();
        this.subirDatosPie2();
      }
    );
  }

  ngOnInit(): void {
    let fecha_actual = new Date();
    let year_actual = fecha_actual.getFullYear();
    this.ObtenerTotalEmpresasTiendas(String(year_actual));
    this.ObtenerYears();
    this.rango_semanas_empresa_tienda = [];
    this.ObtenerRangoSemanas(String(year_actual), 'KANTU', 'MAESTRO');
    this.ObtenerRangoSemanas(String(year_actual), 'KANTU', 'PROMART');
    this.ObtenerRangoSemanas(String(year_actual), 'KANTU', 'SODIMAC');
    this.ObtenerRangoSemanas(String(year_actual), 'DSB', 'MAESTRO');
    this.ObtenerRangoSemanas(String(year_actual), 'DSB', 'PROMART');
    this.ObtenerRangoSemanas(String(year_actual), 'DSB', 'SODIMAC');
    this.EstablecerCategoriasEmpresa(String(year_actual), 'KANTU');
  }
  reverse_funcion(array: number[]) {
    var arreglo_invertido: number[] = [];
    for (let i = array.length - 1; i >= 0; i--) {
      arreglo_invertido.push(array[i])
    }
    return arreglo_invertido;
  }
  calcular_procentaje_de_dos_variables(num1: number, num2: number) {
    var porcentaje: number = 0;
    porcentaje = (num1 - num2) / num1;
  }

  linea_de_tendencia_retornar_siguiente_valor(arreglo: number[]) {
    let Σx = 0;
    let Σy = 0;
    let Σxy = 0;
    let Σx2 = 0;
    const n = arreglo.length;
    let siguiente_valor_tendencia: number = 0;

    for (let i = 0; i < arreglo.length; i++) {
      Σx += i + 1;
      Σy += arreglo[i];
      Σxy += (i + 1) * (arreglo[i]);
      Σx2 += (i + 1) ** 2;
    }

    let m = ((n * Σxy) - (Σx * Σy)) / ((n * Σx2) - (Σx * Σx));
    let b = (Σy / n) - (m * (Σx / n));

    siguiente_valor_tendencia = Math.floor(this.tendencia(9, m, b));
    return siguiente_valor_tendencia;
  }
  tendencia(i: number, m: number, b: number): number {
    return (m * i) + b;
  }
  recategorizar(html_id: string){
    var myhtml = document.getElementById(html_id) as HTMLInputElement;
    this.categoria_total_empresas.categorias.forEach((category, i) => {
      const del = {cantidad: category.cantidad, categoria: category.categoria, monto: category.monto}
      if ("input"+category.categoria == html_id) {
        this.categoria_total_empresas.categorias.splice(i,1);
        this.core.colores_categorias_eliminable.splice(i,1);
      }
    });
    this.subirDatosPie2();
  }
  restablecer_colores(){
    this.core.colores_categorias_eliminable= [];
    this.core.colores_categorias_estatico.forEach(colores => {
      this.core.colores_categorias_eliminable.push(colores)
    })
  }
  realizar_suma_monto(){
    var suma = 0;
    this.categoria_total_empresas.categorias.forEach(category => {
      suma += Number(category.monto);
    })
    return Math.floor(suma);
  }
  realizar_suma_cantidad(){
    var suma = 0;
    this.categoria_total_empresas.categorias.forEach(category => {
      suma += Number(category.cantidad);
    })
    return Math.floor(suma);
  }
  calcularSemanaMayor(){
    this.semanaMayor = 0;
    this.rango_semanas_empresa_tienda.forEach(item => {
      if (item.cantidad_semanas > this.semanaMayor) {
        this.semanaMayor = item.cantidad_semanas;
      }
    });
    console.log(this.rango_semanas_empresa_tienda)
  }
}
