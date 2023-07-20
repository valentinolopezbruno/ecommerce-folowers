const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

app.use(express.json());
app.use(cors());
app.use("/imagenes", express.static(path.join(__dirname, "./imagenes")));
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecomerce-ivan",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

/* --------------------------------- DATE --------------------------------------------------- */
/* CREO ESTA VARIABLE PARA QUE SE ACTUALICE CADA 3 MINUTOS Y LAS IMAGENES SE GUARDEN BIEN */
let fecha = new Date();
let fechaActual = fecha.getMinutes();

setInterval(() => {
  fechaActual = fecha.getMinutes();
}, 3 * 60 * 1000);

/* ---------------------------------CONFIG  IMAGENES --------------------------------------------------- */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/"); // Reemplaza 'carpeta_local' con la ruta de la carpeta local en tu proyecto
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}.${fechaActual}`);
  },
});

const upload = multer({ storage: storage });

/* --------------------------------- MERCADOPAGO --------------------------------------------------- */

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: "TEST-1790631385670646-071709-e8884300ac14cc95ce394ddc5534b9f6-1425228965",
});


/* --------------------------------- LOGIN --------------------------------------------------- */

app.post("/usuarios", async (req, res) => {
  var cont = 0;
  const { nombre, contra } = req.body;
  const usuarios = await prisma.usuarios.findMany();

  for (let i = 0; i < usuarios.length; i++) {
    if (nombre == usuarios[i].nombre && contra == usuarios[i].contra) {
      cont = cont + 1;
      console.log("Es Correcto");
      res.send({ code: 1 });
    }
  }

  if (cont == 0) {
    console.log("Incorrecto");
    res.send({ code: 0 });
  }
});

/* --------------------------------- COMPRA MERCADO PAGO --------------------------------------------------- */

app.get('/pago-exitoso', (req,res) => {
  console.log("pagado")
})

app.get('/pago-fallido', (req,res) => {
  console.log("pago-fallido")
})

app.get('/pago-pendiente', (req,res) => {
  console.log("pago-pendiente")
})

/* --------------------------------- PRODUCTOS --------------------------------------------------- */

app.get("/productos", async (req, res) => {
  const social = await prisma.social.findMany();
  const productos = await prisma.productos.findMany();
  const productos_cantidad = await prisma.producto_cantidad.findMany();

  var data = [];

  for (let i = 0; i < social.length; i++) {
    var RedSocial = {
      idSocial: social[i].id,
      nombre: social[i].nombre,
      imagen: social[i].imagen,
      productos: [],
    };
    var pathImage = path.resolve(__dirname, `./imagenes/${RedSocial.imagen}`);
    if (fs.existsSync(pathImage)) {
      RedSocial.imagen = "http://localhost:3000/imagenes/" + RedSocial.imagen;
    } else {
      RedSocial.imagen = "http://localhost:3000/imagenes/mistake.jpg";
    }
    data.push(RedSocial);

    for (let j = 0; j < productos.length; j++) {
      for (let g = 0; g < data.length; g++) {
        if (data[g].idSocial == productos[j].id_social) {
          // Verificar si el producto ya existe en el array productos
          const existeProducto = data[g].productos.some(
            (p) => p.idProducto === productos[j].id
          );
          if (!existeProducto) {
            let producto = {
              idProducto: productos[j].id,
              nombre: productos[j].nombre,
              imagen: productos[j].imagen,
              idSocial: productos[j].id_social,
              productos_cantidad: [],
            };

            var pathImage = path.resolve(
              __dirname,
              `./imagenes/${producto.imagen}`
            );

            if (fs.existsSync(pathImage)) {
              producto.imagen =
                "http://localhost:3000/imagenes/" + producto.imagen;
            } else {
              producto.imagen = "http://localhost:3000/imagenes/mistake.jpg";
            }
            data[g].productos.push(producto);
          }
        }
      }
    }
  }

  for (let u = 0; u < productos_cantidad.length; u++) {
    for (let r = 0; r < data.length; r++) {
      for (let h = 0; h < data[r].productos.length; h++) {
        if (
          data[r].productos[h].idProducto === productos_cantidad[u].idProducto
        ) {
          // Verificar si el producto ya existe en el array productos
          const existeProducto = data[r].productos[h].productos_cantidad.some(
            (p) => p.idProductoCantidad === productos_cantidad[u].id
          );
          if (!existeProducto) {
            var producto_cantidad = {
              idProductoCantidad: productos_cantidad[u].id,
              idProducto: productos_cantidad[u].idProducto,
              cantidad: productos_cantidad[u].cantidad,
              precio: productos_cantidad[u].precio,
            };
            data[r].productos[h].productos_cantidad.push(producto_cantidad);
          }
        }
      }
    }
  }

  res.json(data);
});

app.post("/productos", upload.single("image"), async (req, res) => {
  var { data } = req.body;
  data = JSON.parse(data);
  var nombreOriginal = req.file.originalname;
  var nombreModificado = nombreOriginal + "." + fechaActual;

  console.log(data);

  try {
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre: data.nombre,
        imagen: nombreModificado,
        id_social: data.idSocial,
      },
    });

    console.log("Datos insertados:", nuevoProducto);

    for (let i = 0; i < data.productos_cantidad.length; i++) {
      data.productos_cantidad[i].idProducto = nuevoProducto.id;

      const nuevoProductoCantidad = await prisma.producto_cantidad.create({
        data: {
          idProducto: data.productos_cantidad[i].idProducto,
          cantidad: data.productos_cantidad[i].cantidad,
          precio: data.productos_cantidad[i].precio,
        },
      });
      console.log("Datos insertados:", nuevoProductoCantidad);
    }
  } catch (error) {
    console.error("Error al insertar datos:", error);
  }
});

app.post("/producto", async (req, res) => {
  const { id } = req.body; // Asegúrate de extraer el valor del cuerpo de la solicitud correctamente

  try {
    const productoEliminado = await prisma.productos.delete({
      where: {
        id: id,
      },
    });
    console.log(productoEliminado);
    res.send("Producto eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar el producto");
  }
});

/* --------------------------------- PRODUCTOS CANTIDAD --------------------------------------------------- */

app.post("/productos_cantidad", async (req,res) => {
  const {id, datos} = req.body
  const productoActualizado = await prisma.producto_cantidad.update({
    where: { id },
    data: { 
      cantidad: datos.cantidad,
      precio: datos.precio
     },
  });
  console.log(productoActualizado)
})

app.post("/producto_cantidad_borrar", async (req,res) => {
  const {id} = req.body
  const producto_cantidad = await prisma.producto_cantidad.delete({
    where: { id },
  });
  
  console.log(producto_cantidad);
  res.send(producto_cantidad)
})

app.post("/producto_cantidad_agregar", async (req,res) => {
  const {cantidad, precio, id} = req.body
  const producto_cantidad = await prisma.producto_cantidad.create({
    data:{
      cantidad: cantidad,
      precio:precio,
      idProducto:id
    }
  });
  
  console.log(producto_cantidad);
  res.send(producto_cantidad)
})
/* --------------------------------- REDES SOCIALES --------------------------------------------------- */

app.post("/social", upload.single("file"), async (req, res) => {
  const { nombre } = req.body;
  const imagen = req.file;

  try {
    const red = await prisma.social.create({
      data: {
        nombre: nombre,
        imagen: imagen.filename,
      },
    });
    console.log(red);
    res.send("red");
  } catch (error) {
    console.error("Error al crear red social:", error);
    res.status(500).send("Error al crear red social");
  }
});


/* --------------------------------- OTROS --------------------------------------------------- */

app.get("/", async (req, res) => {
  const usuarios = await prisma.productos.findMany();
  console.log(usuarios);
  res.json(usuarios);
});

app.get("/cantidad", async (req, res) => {
  var socialData = await prisma.productos.findMany({
    include: {
      producto_cantidad: true,
    },
  });

  console.log(socialData.length);
  res.json(socialData);
});


app.listen(3000, () => {
  console.log("app corriendo en puerto 3000");
});

