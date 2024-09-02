export default class Venta {
    cantidad: number = 0;
    soles: number = 0;
    semana: string = '';

    constructor(
        cantidad: number,
        soles: number,
        semana: string
    ) {
        this.cantidad = cantidad;
        this.soles = soles;
        this.semana = semana;
    }
}