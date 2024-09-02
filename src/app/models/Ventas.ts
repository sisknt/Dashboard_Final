export default class Ventas {

    sku: string = ''; //ventas 1
    nombre: string = '';
    categoria: string = '';
    precio: string = '';
    fecha_inicial: string = ''; //ventas 2
    fecha_final: string = ''; //ventas 3
    semana: string = ''; //ventas 4
    cantidad: string = ''; //ventas 5
    soles: string = '';
    periodo: string = ''; //ventas 6
    tienda_venta: string = ''; //ventas 7
    local: string = ''; //ventas 8
    empresa: string = ''; //ventas 9
    estado: string = '';

    constructor (
        sku: string,
        nombre: string,
        categoria: string,
        precio: string,
        fecha_inicial: string,
        fecha_final: string,
        semana: string,
        cantidad: string,
        soles: string,
        periodo: string,
        tienda_venta: string,
        local: string,
        empresa: string,
        estado: string
    ) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.fecha_inicial = fecha_inicial;
        this.fecha_final = fecha_final;
        this.semana = semana;
        this.cantidad = cantidad;
        this.soles = soles;
        this.periodo = periodo;
        this.tienda_venta = tienda_venta;
        this.local = local;
        this.empresa = empresa;
        this.estado = estado;
    }
}