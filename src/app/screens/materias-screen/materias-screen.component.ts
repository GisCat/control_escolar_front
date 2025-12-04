import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];
  private profesoresMap = new Map<number, string>();
  public displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'programa', 'profesor', 'creditos', 'horario'];
  
  dataSource = new MatTableDataSource<DatosMateria>([]);
  
  private _paginator: MatPaginator;
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  private _sort: MatSort;
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this._sort = sort;
    if (this.dataSource) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    
    // Configurar columnas según el rol
    if (this.isAdmin()) {
      this.displayedColumns = [...this.displayedColumns, 'editar', 'eliminar'];
    }
    
    this.cargarProfesores();
  }

  ngAfterViewInit() {
    // Filtro por nombre, NRC y profesor
    this.dataSource.filterPredicate = (data: DatosMateria, filter: string) => {
      const nombreMateria = data.nombre.toLowerCase();
      const nrc = data.nrc.toLowerCase();
      const profesorNombre = data.nombre_profesor?.toLowerCase() || '';
      return nombreMateria.includes(filter) || nrc.includes(filter) || profesorNombre.includes(filter);
    };

    // Ordenamiento
    this.dataSource.sortingDataAccessor = (data: DatosMateria, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'nrc': return data.nrc;
        case 'nombre': return data.nombre;
        case 'seccion': return data.seccion;
        case 'programa': return data.programa;
        case 'profesor': return data.nombre_profesor || '';
        case 'creditos': return data.creditos;
        case 'horario': return data.horario_completo;
        default: return (data as any)[sortHeaderId];
      }
    };
  }

  isAdmin(): boolean {
    return this.rol === 'administrador';
  }

  isTeacher(): boolean {
    return this.rol === 'maestro';
  }

  isStudent(): boolean {
    return this.rol === 'alumno';
  }

  private cargarProfesores(): void {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.profesoresMap.clear();
        if (response && response.length > 0) {
          response.forEach(maestro => {
            if (maestro.user) {
              maestro.first_name = maestro.user.first_name;
              maestro.last_name = maestro.user.last_name;
              maestro.email = maestro.user.email;
              const nombreCompleto = `${maestro.first_name || ''} ${maestro.last_name || ''}`.trim();

              if (maestro.id) {
                this.profesoresMap.set(maestro.id, nombreCompleto);
              }
            }
          });
        }
        
        this.obtenerListaMaterias();
      },
      (error) => {
        console.error("Error al cargar profesores:", error);
        this.obtenerListaMaterias();
      }
    );
  }

  public obtenerListaMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        if (this.lista_materias.length > 0) {
          this.lista_materias.forEach(materia => {
            // Obtener ID del profesor
            let profesorId: number | null = null;
            
            if (materia.profesor && typeof materia.profesor === 'object' && materia.profesor.id) {
              profesorId = materia.profesor.id;
            }
            
            // Obtener nombre del profesor
            if (profesorId && this.profesoresMap.has(profesorId)) {
              materia.nombre_profesor = this.profesoresMap.get(profesorId)!;
            } else {
              materia.nombre_profesor = 'No asignado';
            }
            
            materia.profesor = profesorId;

            // Crear string de días
            let diasString = '';
            if (materia.dias) {
              try {
                const diasObj = typeof materia.dias === 'string' ? JSON.parse(materia.dias) : materia.dias;
                const diasActivos: string[] = [];
                if (diasObj.lunes) diasActivos.push('Lun');
                if (diasObj.martes) diasActivos.push('Mar');
                if (diasObj.miercoles) diasActivos.push('Mié');
                if (diasObj.jueves) diasActivos.push('Jue');
                if (diasObj.viernes) diasActivos.push('Vie');
                if (diasObj.sabado) diasActivos.push('Sáb');
                diasString = diasActivos.join(', ');
              } catch (e) {
                diasString = 'Error en días';
              }
            }

            // Crear horario completo
            materia.horario_completo = `${materia.hora_inicio || ''} - ${materia.hora_final || ''}`;
            materia.dias_string = diasString;
          });

          this.dataSource.data = this.lista_materias as DatosMateria[];

          if (this._sort) {
            this.dataSource.sort = this._sort;
          }
          if (this._paginator) {
            this.dataSource.paginator = this._paginator;
          }
        }
      }, 
      (error) => {
        console.error("Error al obtener la lista de materias: ", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idMateria: number) {
  const rolActual = this.facadeService.getUserGroup();
  this.router.navigate([`registro-materias/${rolActual}/${idMateria}`]);}

  public delete(idMateria: number) {
    // SOLO administradores pueden eliminar materias
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: {id: idMateria, rol: 'materia'},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          alert("Materia eliminada correctamente.");
          this.obtenerListaMaterias();
        } else {
          alert("No se pudo eliminar la materia.");
        }
      });
    } else {
      alert("No tienes permisos para eliminar materias. Solo administradores pueden realizar esta acción.");
      console.log('Usuario no autorizado para eliminar materias. Rol:', this.rol);
    }
  }

  public shouldShowButtons(): boolean {
    return this.isAdmin();
  }
}

export interface DatosMateria {
  id: number;
  nrc: string;
  nombre: string;
  seccion: string;
  programa: string;
  profesor: number;
  nombre_profesor: string;
  creditos: number;
  hora_inicio: string;
  hora_final: string;
  horario_completo: string;
  dias_string: string;
  salon: string;
  dias: any;
}