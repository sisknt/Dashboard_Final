import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() { }

  grafico_total_datos(P_n_periodo_datos_yaxis: number[], P_n_periodo_datos_xaxis: string[]) {
    //console.log("Servicio console ejecutandose");
    var options = {
      series: [
        {
          data: P_n_periodo_datos_yaxis
        }
      ],
      chart: {
        type: "bar",
        width: 1000,
        height: 400,
        background: "#FFFFFF",
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: 'linear',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 1000
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 5,
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        colors: ["#FFFFFF"]
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          colorStops: [
            [
              {
                offset: 0,
                color: "#8676FF",
                opacity: 1.0
              },
              {
                offset: 100,
                color: "#7D40FF",
                opacity: 1.0
              },
            ]
          ]
        }
      },
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: "#aaa"
          }
        },
        categories: P_n_periodo_datos_xaxis,
      },
      yaxis: {
        labels: {
          show: true,
          offsetX: -10,
          style: {
            colors: ['#8484A0'],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 300,
            cssClass: 'apexcharts-yaxis-label',
          },
        }
      },
      grid: {
        borderColor: "#FFFFFF"
      },
      tooltip: {
        enabled: true,
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          return (
            `<div class="card-tooltip-general">
                        <div class="grafico-contenedor-tooltip d-flex ms-auto">
                            <div class="">
                                <div class="row">
                                    <span class="grafic-tooltip-titulo">${w.globals.labels[dataPointIndex]}</span>
                                </div>
                                <div class="row">
                                    <span class="grafic-tooltip-descripcion">S/. ${series[seriesIndex][dataPointIndex]}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
          );
        }
      },
    };

    var chart = new ApexCharts(document.querySelector("#grafico_total_datos"), options);
    chart.render();
  }
}
