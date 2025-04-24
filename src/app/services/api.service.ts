import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }
  host: string = 'https://odoo17.ceramicaskantu.com';
  //host: string = 'http://192.168.1.117:8069';

  //tipo_dato = "soles" o "cantidad";
  ObtenerVentas(tipo_dato: string) {
    return this.http.get(`${this.host}/tabla/ventas/2022/decor/promart/${tipo_dato}`);
  }

  ObtenerVentasLimitado(year: string, empresa: string, tienda: string, categoria: string, inicio: number, fin: number, busqueda: string, local: string) {
    //console.log(`${this.host}/tabla/ventas/${year}/${empresa}/${tienda}/${categoria}/${inicio}/${fin}/${busqueda}/${local}`);
    return this.http.get(`${this.host}/tabla/ventas/${year}/${empresa}/${tienda}/${categoria}/${inicio}/${fin}/${busqueda}/${local}`);
  }

  ObtenerVentasResumenLimitado(year: string, empresa: string, tienda: string, categoria: string, inicio: number, fin: number, local: string) {
    return this.http.get(`${this.host}/tabla/resumen/${year}/${empresa}/${tienda}/${categoria}/${inicio}/${fin}/${local}`);
  }

  /* GRAFICOS */
  ObtenertotalSemana(year: string, empresa: string, inicio: number, fin: number, locales: string) {
    return this.http.get(`${this.host}/general/grafico/ventas/totales/semanales/${year}/${empresa}/${inicio}/${fin}/${locales}`);
  }

  ObtenerEmpresas() {
    return this.http.get(`${this.host}/graficos/empresas`);
  }

  ObtenerTotalEmpresas() {
    return this.http.get(`${this.host}/total/empresas`);
  }

  ObtenerTotalEmpresasTiendas(year: string) {
    return this.http.get(`${this.host}/total/empresas/tiendas/${year}`);
  }

  ObtenerSemanas(year: string, empresa: string, tienda: string) {
    //console.log(`${this.host}/semanas/${year}/${empresa}/${tienda}`);
    return this.http.get(`${this.host}/semanas/${year}/${empresa}/${tienda}`);
  }

  ObtenerLocales(empresa: string, tienda: string) {
    return this.http.get(`${this.host}/locales/${empresa}/${tienda}`);
  }

  ObtenerYears() {
    //console.log(`${this.host}/years/ventas/DSB`)
    return this.http.get(`${this.host}/years/ventas/DSB`)
  }

  ObtenerTotalCategoriasEmpresa(empresa: string, year: string) {
    //console.log(`${this.host}/total/categorias/${empresa}/${year}`)
    return this.http.get(`${this.host}/total/categorias/${empresa}/${year}`)
  }

  ObtenerListaCategorias(empresa: string) {
    return this.http.get(`${this.host}/categorias/${empresa.toUpperCase()}`)
  }

  ObtenerComparativoTabla(empresa: string, year_inicial: string, year_final: string, semana_inicial: string, semana_final: string) {
    console.log(`${this.host}/tabla/comparativa/categorias/anual/${empresa}/${year_inicial}/${year_final}/${semana_inicial}/${semana_final}`);
    return this.http.get(`${this.host}/tabla/comparativa/categorias/anual/${empresa}/${year_inicial}/${year_final}/${semana_inicial}/${semana_final}`);
  }

  ValidarUsuario(accesos: any) { return this.http.post(`${this.host}/validacion/usuario/login`, accesos); }

  IniciarSesion(usuario: { user: string; password: string }) {
    var jrpc = {
      jsonrpc: "2.0",
      params: {
          db: "KantuOdoo17",
          user: usuario.user,
          password: usuario.password
      },
      id: 8
    }
    //console.log(jrpc)
    return this.http.post(`${this.host}/auth`, jrpc);
  }

  ObtenerComparativaAnual(empresa: string, cadenas: string, categorias: string, zonas: string, sku: string) {
    //console.log(`${this.host}/grafico/total/comparativo/dinamico/${empresa}/${cadenas}/${categorias}/${zonas}/${sku}`)
    return this.http.get(`${this.host}/grafico/total/comparativo/dinamico/${empresa}/${cadenas}/${categorias}/${zonas}/${sku}`)
  }
  ObtenerFiltrosComparativo(empresa: string) {
    //console.log(`${this.host}/grafico/datos/filtros/comparativo/${empresa}`)
    return this.http.get(`${this.host}/grafico/datos/filtros/comparativo/${empresa}`)
  }

  ObtenerDiferenciaPorcentual(empresa: string, semana_inicial: string, semana_final: string) {
    //console.log(`${this.host}/tabla/comparativa/diferencia/porcentual/${empresa}/${semana_inicial}/${semana_final}`);
    return this.http.get(`${this.host}/tabla/comparativa/diferencia/porcentual/${empresa}/${semana_inicial}/${semana_final}`);
  }

  ObtenerComparativoSemanalYear(empresa: string, categoria: string,cadena: string, semana_inicial: number, semana_final: number, producto: string) {
    //console.log(`${this.host}/tabla/comparativa/locales/${empresa}/${categoria}/${cadena}/${semana_inicial}/${semana_final}/${producto}`);
    return this.http.get(`${this.host}/tabla/comparativa/locales/${empresa}/${categoria}/${cadena}/${semana_inicial}/${semana_final}/${producto}`);
  }
  ObtenerComparativoMensualYear(empresa: string, year: string, mes_inicial: string, mes_final: string, locales: string) {
    //console.log(`${this.host}/tabla/ventas/meses/${empresa}/${year}/${mes_inicial}/${mes_final}/${locales}`);
    return this.http.get(`${this.host}/tabla/ventas/meses/${empresa}/${year}/${mes_inicial}/${mes_final}/${locales}`);
  }
  async ObtenerEstadisticasProductos(year: string, empresa: string, cadena: string[], local: string[], producto: string[]) {
    var jrpc = {
      jsonrpc: "2.0",
      params: {
        year: year,
        empresa: empresa,
        cadenas: cadena,
        locales: local,
        productos: producto
      },
      id: 5
    }
    var post = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jrpc),
    };
    //console.log(jrpc)
    try {
      //console.log(`${this.host}/consultar/informacion/varios`)
      const response = await fetch(`${this.host}/consultar/informacion/varios`, post)
      if (!response.ok) {
        throw new Error('Error en la solicitud Fetch' + response.statusText)
      }
      const result = await response.json();
      return result["result"]["productos"];
    } catch (error) {
      //console.log('Error:', error)
    }
  }
  // fetch
  async Fetch_ObtenerSemanas(year: string, empresa: string, inicio: number, fin: number, locales: string): Promise<any> {
    try {
      //console.log(`${this.host}/general/grafico/ventas/totales/semanales/${year}/${empresa}/${inicio}/${fin}/${locales}`)
      const response = await fetch(`${this.host}/general/grafico/ventas/totales/semanales/${year}/${empresa}/${inicio}/${fin}/${locales}`);
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
      const data = await response.json();
      return data["totales_semanales"];
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  async Fetch_ObtenerFiltrosComparativo(empresa: string) {
    try {
      const response = await fetch(`${this.host}/grafico/datos/filtros/comparativo/${empresa}`)
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText)
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting filter:', error);
      throw error;
    }
  }
  async Fetch_ObtenerYears(empresa: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.host}/years/ventas/${empresa}`)
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText)
      }
      const data = await response.json();
      return data["years"]
    } catch (error) {
      console.error('Error posting filter:', error)
      throw error;
    }
  }
  async Fetchsito() {
    /* try {

      var jsonrpc2 = {
        jsonrpc: "2.0",
        params: {
            mes: 5,
            year: 2024,
            token: '##$$$%OdooKanTUDFcvfGEEERwesASDFSSS$%&1123##sS',
        },
        id: 5
      }
      this.http.post(`https://odootest.ceramicaskantu.com/packing/list/costeo`, jsonrpc2).subscribe(
        response => {
          console.log(response)
        }
      )
    } catch (error) {
      
    } */
    const datos = {
      jsonrpc: "2.0",
        params: {
            mes: 5,
            year: 2024,
      },
      id: 5
    };
    var url = "https://odootest.ceramicaskantu.com/obtener/resumen/insumos"
    try {
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
  
      const data = await response.json();  // Procesa la respuesta como JSON
      //console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al realizar la petición:', error);
    }
  }
}
