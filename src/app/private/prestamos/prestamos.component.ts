import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { Cliente } from '../api/clientes';
import { Router } from '@angular/router';
import { Prestamo } from '../api/prestamos';
import { PrestamosService } from '../service/prestamos.service';

const prestamoFake: Prestamo[] = [
  {
    id: 's23dqe22d',
    amount: 1000,
    date: new Date(),
    interest: 10,
    cuotas: 10,
    customerID: 's23dqe22d',
  }
]

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class PrestamosComponent implements OnInit {
  cliente!: Cliente;
  prestamoDialog: boolean = false;

  deletePrestamoDialog: boolean = false;

  prestamos: Prestamo[] = prestamoFake;
  prestamo: Prestamo = {
    id: '',
    amount: 0,
    date: new Date(),
    interest: 0,
    cuotas: 0,
    customerID: '',
  };

  submitted: boolean = false;

  //modal abonos

  abonosModalVisible: boolean = false;
  prestamoSeleccionado: Prestamo | null = null;

  seleccionarPrestamo(prestamo: Prestamo) {
    this.prestamoSeleccionado = prestamo;
    this.abonosModalVisible = true;
  }

  abonosModalVisibleChange(event: boolean) {
    this.abonosModalVisible = event;
  }

  //

  constructor(
    private api: PrestamosService,
    private messageService: MessageService,
    private router: Router

  ) {
    this.cliente = this.router.getCurrentNavigation()?.extras.state as Cliente;
    this.prestamo.customerID = this.cliente.id;
  }

  async ngOnInit() {

    this.api.getPrestamos().subscribe((data) => {
      this.prestamos = data.filter(({ customerID }) => (customerID === this.cliente.id));
    })
  }

  openNew() {
    this.prestamo = {
      id: '',
      amount: 0,
      date: new Date(),
      interest: 0,
      cuotas: 0,
      customerID: this.cliente.id,
    };
    this.submitted = false;
    this.prestamoDialog = true;
  }

  async deletePrestamo(prestamo: Prestamo) {
    this.deletePrestamoDialog = true;
    this.prestamo = prestamo;
  }

  confirmDelete() {
    if (this.prestamo.id !== undefined) {
      this.api.deletePrestamo(this.prestamo.id).subscribe((data) => {
        console.log(this.prestamo);
        this.prestamos = this.prestamos.filter((item) => (item.id !== this.prestamo.id));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Prestamo Eliminado', life: 3000 });
        this.prestamo = {
          id: '',
          amount: 0,
          date: new Date(),
          interest: 0,
          cuotas: 0,
          customerID: this.cliente.id,
        };
        this.deletePrestamoDialog = false;
      })
    }
  }

  hideDialog() {
    this.prestamoDialog = false;
    this.submitted = false;
  }

  saveLoan() {
    // Verificar si el nombre del cliente está presente y no es solo espacios en blanco
    if (this.prestamo?.amount) {
      this.api.addPrestamo(this.prestamo).subscribe((loanRespuesta) => {
        this.prestamos.push(loanRespuesta);
        this.prestamoDialog = false;

        // Mostrar un mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Prestamo Creado',
          life: 3000
        });

        // Limpiar el formulario
        this.prestamo = {
          id: '',
          amount: 0,
          date: new Date(),
          interest: 0,
          cuotas: 0,
          customerID: this.cliente.id,
        };
      });
    }
  }

  dateFormatter = (dateTime: Date) => {
    const formatted = new Date(dateTime).toLocaleDateString('es-HN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatted;
  }

  irCliente(prestamo: Prestamo) {
    this.router.navigate(['/clientes'], {
      state: prestamo
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
