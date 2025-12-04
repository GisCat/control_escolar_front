import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MateriasService } from 'src/app/services/materias.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // Variables
  public total_user: any = {};

  //histograma
  lineChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Materias por Programa Educativo',
        backgroundColor: 'rgba(74, 107, 255, 0.2)',
        borderColor: 'rgba(74, 107, 255, 1)',
        pointBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: 'rgba(255, 107, 107, 1)',
        pointHoverBorderColor: '#ffffff',
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };
  
  lineChartOption: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#343a40',
          font: {
            size: 14,
            family: "'Segoe UI', Roboto, sans-serif",
            weight: '600'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#4a6bff',
        bodyColor: '#343a40',
        borderColor: '#4a6bff',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      },
      datalabels: {
        color: '#343a40',
        anchor: 'end',
        align: 'top',
        font: {
          size: 12,
          weight: '600'
        }
      } as any
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057',
          font: {
            size: 12
          }
        }
      }
    }
  };
  
  lineChartPlugins = [ DatalabelsPlugin ];


  //barras
  barChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Distribución de Materias por Programa',
        backgroundColor: [
          'rgba(74, 107, 255, 0.8)',
          'rgba(255, 107, 107, 0.8)',
          'rgba(78, 205, 196, 0.8)',
          'rgba(255, 167, 38, 0.8)',
          'rgba(69, 183, 209, 0.8)'
        ],
        borderColor: [
          'rgba(74, 107, 255, 1)',
          'rgba(255, 107, 107, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(255, 167, 38, 1)',
          'rgba(69, 183, 209, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };
  
  barChartOption: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#343a40',
          font: {
            size: 14,
            family: "'Segoe UI', Roboto, sans-serif",
            weight: '600'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#4a6bff',
        bodyColor: '#343a40',
        borderColor: '#4a6bff',
        borderWidth: 1,
        cornerRadius: 8
      },
      datalabels: {
        color: '#ffffff',
        anchor: 'end',
        align: 'top',
        font: {
          size: 12,
          weight: 'bold'
        }
      } as any
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#495057',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#495057',
          font: {
            size: 12
          }
        }
      }
    }
  };
  
  barChartPlugins = [ DatalabelsPlugin ];


  // pastel
  pieChartData: any = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [],
        label: 'Distribución de Usuarios por Rol',
        backgroundColor: [
          'rgba(74, 107, 255, 0.8)',
          'rgba(255, 107, 107, 0.8)',
          'rgba(78, 205, 196, 0.8)'
        ],
        borderColor: [
          'rgba(74, 107, 255, 1)',
          'rgba(255, 107, 107, 1)',
          'rgba(78, 205, 196, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15
      }
    ]
  };
  
  pieChartOption: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#343a40',
          font: {
            size: 13,
            family: "'Segoe UI', Roboto, sans-serif"
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#4a6bff',
        bodyColor: '#343a40',
        borderColor: '#4a6bff',
        borderWidth: 1,
        cornerRadius: 8
      },
      datalabels: {
        color: '#ffffff',
        font: {
          size: 13,
          weight: 'bold'
        }
      } as any
    }
  };
  
  pieChartPlugins = [ DatalabelsPlugin ];


  // dona
  doughnutChartData: any = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [],
        label: 'Registro de Usuarios del Sistema',
        backgroundColor: [
          'rgba(74, 107, 255, 0.8)',
          'rgba(255, 167, 38, 0.8)',
          'rgba(69, 183, 209, 0.8)'
        ],
        borderColor: [
          'rgba(74, 107, 255, 1)',
          'rgba(255, 167, 38, 1)',
          'rgba(69, 183, 209, 1)'
        ],
        borderWidth: 2,
        cutout: '70%',
        radius: '95%'
      }
    ]
  };
  
  doughnutChartOption: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#343a40',
          font: {
            size: 13,
            family: "'Segoe UI', Roboto, sans-serif"
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#4a6bff',
        bodyColor: '#343a40',
        borderColor: '#4a6bff',
        borderWidth: 1,
        cornerRadius: 8
      },
      datalabels: {
        display: true,
        color: '#343a40',
        font: {
          size: 13,
          weight: '600'
        }
      } as any
    }
  };
  
  doughnutChartPlugins = [ DatalabelsPlugin ];


  constructor(
    private administradoresServices: AdministradoresService,
    private materiasService: MateriasService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('=== INICIALIZANDO GRÁFICAS ===');
    
    // Verificar si hay token
    const token = this.facadeService.getSessionToken();
    if (!token) {
      console.error('No hay token de sesión');
      alert('Por favor inicia sesión primero');
      this.router.navigate(['/login']);
      return;
    }
    
    this.obtenerTotalUsers();
    this.obtenerDatosMaterias();
  }

  // cargar datos de usuarios en pastel y dona
  public obtenerTotalUsers(){
    console.log('Obteniendo total de usuarios...');
    
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        console.log("Total usuarios recibido: ", response);
        this.total_user = response;

        // Extraemos los datos
        const admins = response.admins || 0;
        const maestros = response.maestros || 0;
        const alumnos = response.alumnos || 0;

        console.log(`Conteo: Admins=${admins}, Maestros=${maestros}, Alumnos=${alumnos}`);

        // Actualiza Gráfica de Pastel
        this.pieChartData.datasets[0].data = [admins, maestros, alumnos];
        this.pieChartData = { ...this.pieChartData };

        // Actualiza Gráfica de Dona
        this.doughnutChartData.datasets[0].data = [admins, maestros, alumnos];
        this.doughnutChartData = { ...this.doughnutChartData };

      }, (error)=>{
        console.error("Error completo al obtener total de usuarios:", error);
        console.error("Status:", error.status);
        console.error("Message:", error.message);
        
        // Si es 404, el endpoint no existe aún
        if (error.status === 404) {
          console.log('Endpoint /total-usuarios/ no implementado en backend');
          // Usar valores por defecto para desarrollo
          this.pieChartData.datasets[0].data = [5, 10, 20];
          this.doughnutChartData.datasets[0].data = [5, 10, 20];
          this.pieChartData = { ...this.pieChartData };
          this.doughnutChartData = { ...this.doughnutChartData };
        }
      }
    );
  }

  // cargar datos de materias para barras y lineas
  public obtenerDatosMaterias(){
    console.log('Obteniendo datos de materias...');
    
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        console.log("Materias recibidas:", response);
        
        if (!Array.isArray(response)) {
          console.error('La respuesta no es un array:', response);
          return;
        }
        
        if (response.length === 0) {
          console.log('No hay materias registradas');
          // Valores por defecto
          this.barChartData.labels = ['Ingeniería', 'Licenciatura', 'ITI'];
          this.barChartData.datasets[0].data = [0, 0, 0];
          this.lineChartData.labels = ['Ingeniería', 'Licenciatura', 'ITI'];
          this.lineChartData.datasets[0].data = [0, 0, 0];
          return;
        }

        // Conteo de materias por programa
        const ingenieria = response.filter((m: any) => 
          m.programa === 'Ingeniería en Ciencias de la Computación'
        ).length;
        
        const licenciatura = response.filter((m: any) => 
          m.programa === 'Licenciatura en Ciencias de la Computación'
        ).length;
        
        const iti = response.filter((m: any) => 
          m.programa === 'Ingeniería en Tecnologías de la Información'
        ).length;

        console.log(`Conteo materias: Ingeniería=${ingenieria}, Licenciatura=${licenciatura}, ITI=${iti}`);

        // Etiquetas para las gráficas
        const labels = ['Ingeniería', 'Licenciatura', 'ITI'];
        const data = [ingenieria, licenciatura, iti];

        // Actualiza Gráfica de Barras
        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = data;
        this.barChartData = { ...this.barChartData };

        // Actualizar Gráfica de Líneas
        this.lineChartData.labels = labels;
        this.lineChartData.datasets[0].data = data;
        this.lineChartData = { ...this.lineChartData };

      }, (error) => {
        console.error("Error al obtener materias para gráficas:", error);
      }
    );
  }
}