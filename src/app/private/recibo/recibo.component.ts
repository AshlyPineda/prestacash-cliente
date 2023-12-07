import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Abono } from '../api/abono';
import { Cliente } from '../api/clientes';
import { Prestamo } from '../api/prestamos';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent {
  @Input() modalVisible!: boolean;
  @Output() modalVisibleChange = new EventEmitter<boolean>();

  @Input() abonoSeleccionado!: Abono;
  @Input() prestamoSeleccionado!: Prestamo;
  @Input() clienteSeleccionado!: Cliente;

  onCloseModal() {
    this.modalVisibleChange.emit(false);
  }

  ngOnDestroy() {
    this.modalVisibleChange.unsubscribe();
  }

  dateFormatter = (dateTime: Date) => {
    const formatted = new Date(dateTime).toLocaleDateString('es-HN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatted;
  }

  formatearNumeroConMoneda(value: number) {
    const numeroFormateado: string = value.toLocaleString('es-HN', {
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
      currency: 'HNL'
    });

    return numeroFormateado;
  }

}
