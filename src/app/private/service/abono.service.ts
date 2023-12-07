import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Abono } from '../api/abono';

@Injectable({
    providedIn: 'root'
})
export class AbonosService {
    readonly BaseURL = "http://localhost:3000/api";

    constructor(private http: HttpClient) { }

    getAbonos(): Observable<Abono[]> {
        return this.http.get<any>(this.BaseURL + '/payment').pipe(
            map((res: any) => {
                return res.map((item: any): Abono => {
                    return {
                        id: item._id,
                        amount: item.amount,
                        date: item.date,
                        loanID: item.loanID
                    }
                })
            })
        )
    }

    deleteAbono(id: string): Observable<any[]> {
        return this.http.delete<any>(this.BaseURL + `/payment/${id}`);
    }

    addAbono(abono: Abono): Observable<Abono> {
        const { amount, date, loanID } = abono;

        return this.http.post<any>(this.BaseURL + `/payment`, {
            "amount": amount,
            "date": date,
            "loanID": loanID
        }).pipe(
            map((res: any) => {
                return {
                    id: res.savedPayment._id,
                    amount: res.savedPayment.amount,
                    date: res.savedPayment.date,
                    loanID: res.savedPayment.loanID
                }
            })
        )
    }
}