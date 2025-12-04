import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaMateria() {
    return {
      nrc: '',
      nombre: '',
      seccion: '',
      dias: {
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabadio: false
      },
      hora_inicio: '',
      hora_final: '',
      salon: '',
      programa: '',
      profesor: '',
      creditos: ''
    };
  }

  
  public validarMateria(data: any, editar: boolean) {
    console.log("Validando materia...", data);
    let error: any = {};

    // NRC: Solo números, longitud 2-4 dígitos
    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["nrc"])) {
      error["nrc"] = "Solo se permiten caracteres numéricos";
    } else if (!this.validatorService.min(data["nrc"], 2)) {
      error["nrc"] = this.errorService.min(2);
    } else if (!this.validatorService.max(data["nrc"], 4)) {
      error["nrc"] = this.errorService.max(4);
    }

    // Nombre de la materia: Solo letras y espacios
    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    } else if (!this.validatorService.onlyLettersAndSpaces(data["nombre"])) {
      error["nombre"] = "Solo se permiten letras y espacios";
    }

    // Sección: Solo números, máximo 3 
    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["seccion"])) {
      error["seccion"] = "Solo se permiten caracteres numéricos";
    } else if (!this.validatorService.max(data["seccion"], 3)) {
      error["seccion"] = this.errorService.max(3);
    }

    // Días de la semana: Al menos uno seleccionado
    const diasSeleccionados = Object.values(data["dias"]).some((d: any) => d === true);
    if (!diasSeleccionados) {
      error["dias"] = "Debe seleccionar al menos un día";
    }

    // Horario inicio: Obligatorio
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }

    // Horario final: Obligatorio
    if (!this.validatorService.required(data["hora_final"])) {
      error["hora_final"] = this.errorService.required;
    }

    // Validación adicional: Hora final debe ser mayor que hora inicio
    if (data["hora_inicio"] && data["hora_final"]) {
      const horaInicio = new Date(`2000-01-01T${data["hora_inicio"]}`);
      const horaFinal = new Date(`2000-01-01T${data["hora_final"]}`);
      if (horaFinal <= horaInicio) {
        error["hora_final"] = "La hora final debe ser mayor que la hora de inicio";
      }
    }

    // Salón: Obligatorio, alfanumérico y espacios, máximo 15 caracteres
    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = this.errorService.required;
    } else if (!this.validatorService.onlyAlphanumericAndSpaces(data["salon"])) {
      error["salon"] = "Solo se permiten caracteres alfanuméricos y espacios";
    } else if (!this.validatorService.max(data["salon"], 15)) {
      error["salon"] = this.errorService.max(15);
    }

    // Programa educativo: Obligatorio
    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }

    // Profesor asignado: Obligatorio
    if (!this.validatorService.required(data["profesor"])) {
      error["profesor"] = this.errorService.required;
    }

    // Créditos: Obligatorio, solo números enteros positivos, máximo 2 dígitos, mínimo 1
    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = this.errorService.required;
    } else {
      // Convertir a string para validar longitud
      const creditosStr = data["creditos"].toString();
      
      if (!this.validatorService.positiveInteger(creditosStr)) {
        error["creditos"] = "Solo se permiten números enteros positivos";
      } else if (!this.validatorService.max(creditosStr, 2)) {
        error["creditos"] = this.errorService.max(2);
      } else if (parseInt(creditosStr) < 1) {
        error["creditos"] = "Debe ser al menos 1 crédito";
      }
    }

    return error;
  }



  // Registrar materia
  public registrarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = token ?
      new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) :
      new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  // Lista de materias
  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = token ?
      new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) :
      new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  // Obtener por ID
  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = token ?
      new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) :
      new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  // Actualizar materia
  public actualizarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = token ?
      new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) :
      new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  // Eliminar materia
  public eliminarMateria(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = token ?
      new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }) :
      new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<any>(
      `${environment.url_api}/materias/?id=${idMateria}`,  // Asegúrate que esta URL sea correcta
      { headers }
    );
  }

}
