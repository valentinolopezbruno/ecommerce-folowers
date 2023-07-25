export interface Carrito{
    productos: Array<CarritoItem>
}

export interface CarritoItem {
    id:number;
    redSocial: string;
    producto: string;
    productoimg: string;
    precio: number;
    cantidad: number;
    divisa: string;
    usuario: string;
}