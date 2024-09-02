export default class TotalGrafico {
    semana: string = '';
    precio_total: string = '';
    cantidad_total: string = '';
    periodo: string = '';

    constructor(
        semana: string,
        precio_total: string,
        cantidad_total: string,
        periodo: string
    ) {
        this.semana = semana;
        this.precio_total = precio_total;
        this.cantidad_total = cantidad_total;
        this.periodo = periodo;
    }
}