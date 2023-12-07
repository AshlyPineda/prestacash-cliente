import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { AbonosService } from '../service/abono.service';
import { Abono } from '../api/abono';
import { Prestamo } from '../api/prestamos';
import { Router } from '@angular/router';
import { Cliente } from '../api/clientes';

const AbonosFake: Abono[] = [
  {
    id: 's23dqe22d',
    amount: 1000,
    date: new Date(),
    loanID: 's23dqe22d',
  }
]

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AbonosComponent implements OnInit {
  @Input() modalVisible!: boolean;
  @Output() modalVisibleChange = new EventEmitter<boolean>();

  @Input() prestamoSeleccionado!: Prestamo;
  @Input() clienteSeleccionado!: Cliente;

  //Recibo 
  reciboModalVisible: boolean = false;
  abonoSeleccionado: Abono | null = null;

  seleccionarAbono(abono: Abono) {
    this.abonoSeleccionado = abono;
    this.reciboModalVisible = true;
    console.log(this.abonoSeleccionado, this.reciboModalVisible);
  }

  reciboModalVisibleChange(event: boolean) {
    this.reciboModalVisible = event;
  }
  //
  onCloseModal() {
    this.modalVisibleChange.emit(false);
  }

  ngOnDestroy() {
    this.modalVisibleChange.unsubscribe();
  }

  //Abonos
  abonoDialog: boolean = false;

  deleteAbonoDialog: boolean = false;

  abonos: Abono[] = [];
  abonosXprestamo: Abono[] = [];
  abono: Abono = {
    id: '',
    amount: 0,
    date: new Date(),
    loanID: '',
  };

  submitted: boolean = false;
  constructor(
    private api: AbonosService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.api.getAbonos().subscribe((data) => {
      this.abonos = data;
      this.abonosXprestamo = this.abonos.filter(({ loanID }) => (loanID === this.prestamoSeleccionado.id));
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.prestamoSeleccionado) {
      this.abonosXprestamo = this.abonos.filter(({ loanID }) => (loanID === this.prestamoSeleccionado.id));
    }
  }

  openNew() {
    this.abono = {
      id: '',
      amount: 0,
      date: new Date(),
      loanID: this.prestamoSeleccionado.id,
    };
    this.submitted = false;
    this.abonoDialog = true;
  }

  async deleteAbono(abono: Abono) {
    this.deleteAbonoDialog = true;
    this.abono = { ...abono };
  }

  confirmDelete() {
    if (this.abono.id !== undefined) {
      this.api.deleteAbono(this.abono.id).subscribe((data) => {
        this.abonos = this.abonos.filter((item) => (item.id !== this.abono.id));
        this.abonosXprestamo = this.abonos.filter(({ loanID }) => (loanID === this.prestamoSeleccionado.id));

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Abono eliminado', life: 3000 });
        this.abono = {
          id: '',
          amount: 0,
          date: new Date(),
          loanID: this.abono.id,
        };
        this.deleteAbonoDialog = false;
      })
    }
  }

  hideDialog() {
    this.abonoDialog = false;
    this.submitted = false;
  }

  saveAbono() {
    // Verificar si el nombre del cliente está presente y no es solo espacios en blanco
    if (this.abono?.amount) {
      this.api.addAbono(this.abono).subscribe((clientRespuesta) => {
        this.abonos.push(clientRespuesta);
        this.abonosXprestamo = this.abonos.filter(({ loanID }) => (loanID === this.prestamoSeleccionado.id));
        this.abonoDialog = false;

        // Mostrar un mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Abono Creado',
          life: 3000
        });

        // Limpiar el formulario
        this.abono = {
          id: '',
          amount: 0,
          date: new Date(),
          loanID: this.prestamoSeleccionado.id,
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
