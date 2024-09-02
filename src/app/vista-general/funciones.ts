import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class funciones {
    constructor() {

    }
    funcion_linea_de_tendencia_prediccion(arreglo: number[]) {
        let Σx = 0;
        let Σy = 0;
        let Σxy = 0;
        let Σx2 = 0;
        const n = arreglo.length;
        const tendencias: number[] = [];
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
        arreglo.push(siguiente_valor_tendencia);
        return arreglo;
    }

    funcion_linea_de_tendencia_estado(arreglo: number[]): number[] {
        let Σx = 0;
        let Σy = 0;
        let Σxy = 0;
        let Σx2 = 0;
        const n = arreglo.length;
        const tendencias: number[] = [];

        for (let i = 0; i < arreglo.length; i++) {
            Σx += i + 1;
            Σy += arreglo[i];
            Σxy += (i + 1) * (arreglo[i]);
            Σx2 += (i + 1) ** 2;
        }

        let m = ((n * Σxy) - (Σx * Σy)) / ((n * Σx2) - (Σx * Σx));
        let b = (Σy / n) - (m * (Σx / n));

        for (let i = 0; i < arreglo.length+1; i++) {
            tendencias.push(Math.floor(this.tendencia(i + 1, m, b)));
        }

        return tendencias;
    }
    tendencia(i: number, m: number, b: number): number {
        return (m * i) + b;
    }

}
