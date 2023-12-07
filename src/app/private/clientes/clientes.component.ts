import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { Cliente } from '../api/clientes';
import { ClientesService } from '../service/clientes.service';
import { Router } from '@angular/router';

const clientesFake: Cliente[] = [
    {
        id: 's23dqe22d',
        name: 'Ashlysita',
        email: 'as@ga.com',
        phone: '94392332',
        address: 'Campana'
    },
    {
        id: 's23dqe22da',
        name: 'Ashlysita 2',
        email: 'as@ga.com',
        phone: '94392332',
        address: 'Campana'
    }
]

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class ClientesComponent implements OnInit {
    clienteDialog: boolean = false;

    deleteClienteDialog: boolean = false;

    clientes: Cliente[] = clientesFake;
    cliente: Cliente = {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
    };
    selectedClientes: Cliente[] = [];

    submitted: boolean = false;
    constructor(
        private api: ClientesService,
        private messageService: MessageService,
        private router: Router
    ) { }

    async ngOnInit() {

        this.api.getClientes().subscribe((data) => {
            console.log(data);
            // this.prestamos = data.filter((prestamo)=>(orestamo.clientId===client.id));
            this.clientes = data;
        })
    }

    openNew() {
        this.cliente = {
            id: '',
            name: '',
            email: '',
            phone: '',
            address: '',
        };
        this.submitted = false;
        this.clienteDialog = true;
    }

    async deleteCliente(cliente: Cliente) {
        this.deleteClienteDialog = true;
        this.cliente = { ...cliente };
    }

    confirmDelete() {
        if (this.cliente.id !== undefined) {
            this.api.deleteCliente(this.cliente.id).subscribe((data) => {
                this.clientes = this.clientes.filter((item) => (item.id !== this.cliente.id));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
                this.cliente = {
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                };
                this.deleteClienteDialog = false;
            })
        }
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveCliente() {
        // Verificar si el nombre del cliente está presente y no es solo espacios en blanco
        if (this.cliente?.name.trim()) {
            this.api.addCliente(this.cliente).subscribe((clientRespuesta) => {
                this.clientes.push(clientRespuesta);
                this.clienteDialog = false;

                // Mostrar un mensaje de éxito
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cliente Created',
                    life: 3000
                });

                // Limpiar el formulario
                this.cliente = {
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                };
            });
        }
    }

    irPrestamos(cliente: Cliente) {
        this.router.navigate(['/prestamos'], {
            state: cliente
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}