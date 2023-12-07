import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'prestaCash';

  items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.items = [
      { label: 'Clientes', icon: 'fa fa-users', routerLink: '/clientes', state: { cliente: { id: 1, name: 'PrestaCash' } } }
    ];

    this.activeItem = this.items[0];
  }

}
