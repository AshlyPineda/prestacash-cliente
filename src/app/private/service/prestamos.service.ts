import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Prestamo } from '../api/prestamos';

@Injectable({
    providedIn: 'root'
})
export class PrestamosService {
    readonly BaseURL = "http://localhost:3000/api"

    constructor(private http: HttpClient) { }

    getPrestamos(): Observable<Prestamo[]> {
        return this.http.get<any>(this.BaseURL + '/loan').pipe(
            map((res: any) => {
                return res.map((item: any): Prestamo => {
                    return {
                        id: item._id,
                        amount: item.amount,
                        date: item.date,
                        interest: item.interest,
                        cuotas: item.cuotas,
                        customerID: item.customerID
                    }
                })
            })
        )
    }

    deletePrestamo(id: string): Observable<any[]> {
        return this.http.delete<any>(this.BaseURL + `/loan/${id}`);
    }

    addPrestamo(prestamos: Prestamo): Observable<Prestamo> {
        const { amount, date, interest, cuotas, customerID } = prestamos;

        return this.http.post<any>(this.BaseURL + `/loan`, {
            "amount": amount,
            "date": date,
            "interest": interest,
            "cuotas": cuotas,
            "customerID": customerID
        }).pipe(
            map((res: any) => {
                return {
                    id: res.savedLoan._id,
                    amount: res.savedLoan.amount,
                    date: res.savedLoan.date,
                    interest: res.savedLoan.interest,
                    cuotas: res.savedLoan.cuotas,
                    customerID: res.savedLoan.customerID
                }
            })
        )
    }
}