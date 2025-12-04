import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  public tipo: string = "registro-materias";
  public materia: any = {};
  public editar: boolean = false;
  public idMateria: number = 0;

  public programasEducativos: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];
  public profesores: any[] = [];
  public errors: any = {};

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService
  ) {}

  ngOnInit(): void {
  this.inicializarMateria();
  this.activatedRoute.params.subscribe(params => {
    if (params['rol'] && params['id']) {
      this.editar = true;
      this.idMateria = Number(params['id']);
      console.log('Editando materia con ID:', this.idMateria, 'Rol:', params['rol']);
      this.obtenerMateriaByID();
    }
  });

  this.obtenerProfesores();
}

  private inicializarMateria() {
    this.materia = {
      id: null,
      nrc: '',
      nombre: '',
      seccion: '',
      dias: {
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false
      },
      hora_inicio: '',
      hora_final: '',
      salon: '',
      programa: '',
      profesor: '',
      creditos: ''
    };
    this.errors = {};
  }

  public obtenerProfesores() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.profesores = response.map((prof: any) => {
          const first = prof.user?.first_name ?? prof.first_name ?? "";
          const last = prof.user?.last_name ?? prof.last_name ?? "";
          
          return {
            id: prof.id,
            nombre: `${first} ${last}`.trim(),
            email: prof.user?.email ?? prof.email ?? ""
          };
        });

        if (this.profesores.length === 0) {
          alert("No hay profesores registrados. Primero debes crear al menos un maestro.");
        }
      }, 
      (error) => {
        alert("No se pudo obtener la lista de profesores");
        this.profesores = [];
      }
    );
  }

  public obtenerMateriaByID() {
    if (!this.idMateria) return;

    this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe(
      (response) => {
        
        const diasRaw = response.dias ?? null;
        let diasParsed = {
          lunes: false, martes: false, miercoles: false, 
          jueves: false, viernes: false, sabado: false
        };

        if (diasRaw) {
          if (typeof diasRaw === 'string') {
            try {
              const parsed = JSON.parse(diasRaw);
              if (typeof parsed === 'object') diasParsed = parsed;
            } catch (e) {
              console.error('Error parseando días:', e);
            }
          } else if (typeof diasRaw === 'object') {
            diasParsed = diasRaw;
          }
        }

        let profesorId = null;
        if (response.profesor && typeof response.profesor === 'object') {
          profesorId = response.profesor.id;
        } else if (response.profesor) {
          profesorId = response.profesor; // Si ya viene como número
        }

        this.materia = {
          id: response?.id ?? this.idMateria, 
          nrc: response?.nrc ?? '',
          nombre: response?.nombre ?? '',
          seccion: response?.seccion ?? '',
          dias: diasParsed, 
          hora_inicio: response?.hora_inicio ?? '',
          hora_final: response?.hora_final ?? '',
          salon: response?.salon ?? '',
          programa: response?.programa ?? '',
          profesor: profesorId, 
          creditos: response?.creditos?.toString() || ''
        };
      },
      (error) => {
        console.error('Error completo:', error);
        alert("No se pudo obtener la materia seleccionada");
      }
    );
  }

  private validarYSetErrores(): boolean {
    const errores = this.materiasService.validarMateria(this.materia, this.editar);
    this.errors = errores || {};
    return Object.keys(this.errors).length === 0;
  }

  public registrar() {
    if (!this.validarYSetErrores()) {
      return;
    }

    if (this.materia.profesor) {
      this.materia.profesor = Number(this.materia.profesor);
    }
    
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.goBack();
      },
      (error) => {
        if (error.error && error.error.error) {
          alert(`Error: ${error.error.error}`);
        } else if (error.status === 500) {
          alert("Error interno del servidor. Verifica que el profesor exista.");
        } else {
          alert("No se pudo registrar la materia");
        }
      }
    );
  }

  public actualizar() {
    // Validación
    if (!this.validarYSetErrores()) {
      console.log('Validación falló, errores:', this.errors);
      return;
    }

    this.materiasService.actualizarMateria(this.materia).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
        alert("Materia actualizada correctamente");
        this.goBack();
      },
      (error) => {
        console.error('Error completo:', error);
        console.error('Status:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Respuesta error:', error.error);
        
        if (error.error && error.error.error) {
          alert(`Error: ${error.error.error}`);
        } else if (error.status === 400) {
          alert("Error de validación: " + JSON.stringify(error.error));
        } else {
          alert("No se pudo actualizar la materia");
        }
      }
    );
  }

  public goBack() {
    this.location.back();
  }

  public soloLetrasYEspacios(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32 &&
      charCode !== 193 && charCode !== 201 && charCode !== 205 &&
      charCode !== 211 && charCode !== 218 &&
      charCode !== 225 && charCode !== 233 && charCode !== 237 &&
      charCode !== 243 && charCode !== 250 &&
      charCode !== 209 && charCode !== 241
    ) {
      event.preventDefault();
    }
  }

  public soloAlfanumericoYEspacios(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) &&
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32 &&
      charCode !== 193 && charCode !== 201 && charCode !== 205 &&
      charCode !== 211 && charCode !== 218 &&
      charCode !== 225 && charCode !== 233 && charCode !== 237 &&
      charCode !== 243 && charCode !== 250 &&
      charCode !== 209 && charCode !== 241
    ) {
      event.preventDefault();
    }
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 48 && charCode <= 57)) {
      event.preventDefault();
    }
  }

  public onTimeSet(tipo: 'inicio' | 'final', event: string) {
    if (tipo === 'inicio') {
      this.materia.hora_inicio = this.formatTime(event);
    } else {
      this.materia.hora_final = this.formatTime(event);
    }
    
    if (tipo === 'final' && this.errors.hora_final) {
      delete this.errors.hora_final;
    }
  }

  private formatTime(time: string): string {
    if (time.match(/^\d{2}:\d{2}$/)) {
      return time;
    }
    
    const [timePart, modifier] = time.split(' ');
    if (!timePart || !modifier) {
      return time;
    }
    
    let [hours, minutes] = timePart.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  }
}