export interface Prestamo {
    id: string;
    amount: number;
    date: Date;
    interest: number;
    cuotas: number;
    customerID: string;
}