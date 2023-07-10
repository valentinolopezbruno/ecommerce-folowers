import { ProductoCantidad } from "./producto_cantidad";

export interface Producto{
    idProducto: number;
    nombre: string;
    imagen: string;
    productos_cantidad: Array<ProductoCantidad>
}



