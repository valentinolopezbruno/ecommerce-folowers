import { ProductoCantidad } from "./producto_cantidad";

export interface NuevoProducto{
    nombre:string;
    imagen: File | null;
    idSocial: number;
    productos_cantidad:Array<ProductoCantidad>
}




