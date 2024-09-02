export default class VentasResumen {
    cantidad: string = '';
    categoria: string = '';
    periodo: string = '';
    semana: string = '';
    tienda: string = '';

    constructor (
        cantidad: string,
        categoria: string,
        periodo: string,
        semana: string,
        tienda: string
    ) {
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.periodo = periodo;
        this.semana = semana;
        this.tienda = tienda;
    }
}