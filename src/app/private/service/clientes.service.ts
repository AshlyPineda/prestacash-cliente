import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cliente } from '../api/clientes';
import { userId } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  readonly BaseURL = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<any>(this.BaseURL + '/customers').pipe(
      map((res: any) => {
        return res.map((item: any): Cliente => {
          return {
            id: item._id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address
          }
        })
      })
    )
  }

  deleteCliente(id: string): Observable<any[]> {
    return this.http.delete<any>(this.BaseURL + `/customers/${id}`);
  }

  addCliente(clientes: Cliente): Observable<Cliente> {
    const { name, address, email, phone, userID } = clientes;

    return this.http.post<any>(this.BaseURL + `/customers`, {
      "name": name,
      "address": address,
      "email": email,
      "phone": phone,
      "userID": userId
    }).pipe(
      map((res: any) => {
        return {
          id: res.savedCustomers._id,
          name: res.savedCustomers.name,
          email: res.savedCustomers.email,
          phone: res.savedCustomers.phone,
          address: res.savedCustomers.address,
          userID: res.savedCustomers.userID
        }
      })
    )
  }
}