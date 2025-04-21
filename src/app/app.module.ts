import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Apexcharts from 'apexcharts'
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VistaGeneralComponent } from './vista-general/vista-general.component';
import { ResumenSolesComponent } from './dashboard/resumen-soles/resumen-soles.component';
import { TableComponent } from './dashboard/table/table.component';
import { TableResumenComponent } from './dashboard/table-resumen/table-resumen.component';
import { HttpClientModule } from '@angular/common/http';
import { StatsProductoComponent } from './stats-producto/stats-producto.component';
import { ConsoleComponent } from './console/console.component';
import { GraficoSolesComponent } from './grafico-soles/grafico-soles.component';
import { LoginComponent } from './login/login.component';
import { ProductosComponent } from './productos/productos.component';
import { FormsModule } from '@angular/forms';
import { TableGeneralComponent } from './dashboard/table-general/table-general.component';
import { MychartComponent } from './mychart/mychart.component';
import { TablaComparativaComponent } from './tabla-comparativa/tabla-comparativa.component';
import { TablaComparativaSemanaYearComponent } from './dashboard/tabla-comparativa-semana-year/tabla-comparativa-semana-year.component';
import { Resumen1Component } from "./resumen1/resumen1.component";
import { TablaComparativaMesYearComponent } from './dashboard/tabla-comparativa-mes-year/tabla-comparativa-mes-year.component';

import { TagInputComponent } from './tag-input/tag-input.component';
import { DatalistComponent } from './datalist/datalist.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    VistaGeneralComponent,
    ResumenSolesComponent,
    TableComponent,
    TableResumenComponent,
    StatsProductoComponent,
    ConsoleComponent,
    GraficoSolesComponent,
    LoginComponent,
    ProductosComponent,
    TableGeneralComponent,
    MychartComponent,
    TablaComparativaComponent,
    TablaComparativaSemanaYearComponent,
    Resumen1Component,
    TablaComparativaMesYearComponent,
    TagInputComponent,
    DatalistComponent,
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
