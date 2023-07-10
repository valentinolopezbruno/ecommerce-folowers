import { ProductoCantidad } from "./producto_cantidad";

export interface NuevoProducto{
    nombre:string;
    imagen:string;
    idSocial: number;
    productos_cantidad:Array<ProductoCantidad>
}




