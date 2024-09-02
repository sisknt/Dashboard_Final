export default class Locales {
    codigo_local: string = '';
    ubicacion: string = '';

    constructor(
        codigo_local: string,
        ubicacion: string
    ) {
        this.codigo_local = codigo_local;
        this.ubicacion = ubicacion;
    }
}