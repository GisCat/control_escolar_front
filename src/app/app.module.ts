import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import { RegistroAlumnosComponent } from './partials/registro-alumnos/registro-alumnos.component';
import { RegistroMaestrosComponent } from './partials/registro-maestros/registro-maestros.component';
import { RegistroMateriasScreenComponent } from './screens/registro-materias-screen/registro-materias-screen.component';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgChartsModule } from 'ng2-charts';


// Paginador en español
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';
import { CookieService } from 'ngx-cookie-service';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Pantallas
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';

// Partials
import { NavbarUserComponent } from './partials/navbar-user/navbar-user.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    RegistroAdminComponent,
    RegistroAlumnosComponent,
    RegistroMaestrosComponent,
    HomeScreenComponent,
    AdminScreenComponent,
    AlumnosScreenComponent,
    MaestrosScreenComponent,
    NavbarUserComponent,
    SidebarComponent,
    EliminarUserModalComponent,
    RegistroMateriasScreenComponent,
    MateriasScreenComponent,
    GraficasScreenComponent,
    
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    // Angular Material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    NgChartsModule,

    // Ngx-mask
    NgxMaskDirective
],


  
providers: [
  CookieService,
  { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  provideNgxMask()
],

  bootstrap: [AppComponent]
})
export class AppModule {}
