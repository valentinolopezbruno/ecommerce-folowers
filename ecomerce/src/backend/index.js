const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios')

app.use(express.json());
app.use(cors());
app.use("/imagenes", express.static(path.join(__dirname, "./imagenes")));
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PuertoAPP = "http://localhost:4200";

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

/* ---------------------------------CONFIG  PAYPAL --------------------------------------------------- */
 const PAYPAL_API = 'https://api-m.sandbox.paypal.com'
 const PAYPAL_API_CLIENT = 'ARwiqPiwoL90ElSKqkcFT5iiXF8pkkK55IMVVSIg3m1zwL_OdGfmNycOQWHzVWxFoQ48Oa8TYAvn7BMN'
 const PAYPAL_API_SECRET = 'EEqGMouNnGTMIWqVS3sL4faOON6l9wAiFLEZHq-b0d7PtHy7OFALhZ3T9SWrUJlVTCfETN1VyFEBOQUk'
 const HOST = 'http://localhost:3000'
/* ---------------------------------CONFIG  NODEMAILER --------------------------------------------------- */

enviarMail = async () => {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'vaalen1lopez@gmail.com',
      pass:'ttkgxsvuftobpyio',
    },
  };

  const transport = nodemailer.createTransport(config);

  const mensaje = {
    from: 'vaalen1lopez@gmail.com',
    to: 'vaalen1lopez@gmail.com',
    subject: 'Correo de Prueba',
    text:'manserino',
  };

  const info = await transport.sendMail(mensaje);

  console.log(info)
};

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
const { send } = require("process");
const { URLSearchParams } = require("url");
// Agrega credenciale
mercadopago.configure({
  access_token:
    "TEST-1790631385670646-071709-e8884300ac14cc95ce394ddc5534b9f6-1425228965",
});

/* --------------------------------- LOGIN --------------------------------------------------- */

function generarTokenPorMinuto() {
  const duracionEnMinutos = 1; // Duración del token en minutos
  const duracionEnMilisegundos = duracionEnMinutos * 60 * 1000; // Convertir a milisegundos

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Sumar la duración en milisegundos a la fecha actual para obtener la fecha de expiración
  const fechaExpiracion = new Date(fechaActual.getTime() + duracionEnMilisegundos);

  // Generar un token aleatorio (puedes usar tu lógica para generar el token)
  const token = generarTokenAleatorio();

  return {
    token: token,
    expiracion: fechaExpiracion
  };
}

// Función para generar un token aleatorio (ejemplo)
function generarTokenAleatorio() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const longitudToken = 30;
  let token = '';

  for (let i = 0; i < longitudToken; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(indiceAleatorio);
  }

  return token;
}

function obtenerFechaCorta(fecha) {
  // Si la fecha es una cadena, conviértela a un objeto Date
  if (typeof fecha === 'string') {
    fecha = new Date(fecha);
  }

  // Verifica si fecha es una instancia válida de Date
  if (!(fecha instanceof Date) || isNaN(fecha)) {
    throw new Error('Fecha inválida');
  }

  // Obtiene los componentes de la fecha
  const year = fecha.getUTCFullYear();
  const month = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getUTCDate().toString().padStart(2, '0');

  // Construye la cadena con el formato deseado: 'YYYY-MM-DD'
  const fechaCorta = `${year}-${month}-${day}`;

  return fechaCorta;
}

app.post("/usuarios", async (req, res) => {
  var cont = 0;
  const { nombre, contra } = req.body;
  const usuarios = await prisma.usuarios.findMany();

  for (let i = 0; i < usuarios.length; i++) {
    if (nombre === usuarios[i].nombre && contra === usuarios[i].contra) {
      cont = cont + 1;
      console.log("Es Correcto");

      var {token, expiracion} = generarTokenPorMinuto()
      console.log(token, expiracion);

      const datos = await prisma.usuarios.update({
        where:{id: usuarios[i].id},
        data:{
          token:token,
          expiracion:expiracion
        }
      })
      res.json({token:token, code: 1 });
      }
  }

  if (cont == 0) {
    console.log("Incorrecto");
    res.json({ code: 0 });
  }
});

app.post("/usuarios-token", async (req,res) => {
  const {token, date} = req.body;
  console.log(token, date)
  const user = await prisma.usuarios.findMany({})

    for (let i = 0; i < user.length; i++) {
      var cont = 0;
      if(user[i].token === token){
        console.log("tokenencontrado")
        cont = cont + 1;
      }
      
      if(obtenerFechaCorta(user[i].expiracion) === date){
        console.log("fehca coincide")
        cont = cont + 1;
      }

      if(cont === 2){
        res.json({"code":1})
      } else {res.json({"code":0})}
    }
})



/* --------------------------------- COMPRA MERCADO PAGO --------------------------------------------------- */
app.post("/webhook", async (req, res) => {
  const payment = req.body;
  if (payment.type === "payment") {
    const paymentId = payment.data.id;
    const data = await mercadopago.payment.findById(paymentId);
    console.log(data.response.status)
    const metadataId = data.body.metadata.id

    const pago = await prisma.pagos.findUnique({
      where: {
        id: metadataId,
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if(data.response.status === "approved" && pago.estado === 0){
      const resultado = await prisma.pagos.update({
        where:{id:metadataId},
        data:{estado:1}
      })
      enviarMail();
    }
  }

  res.sendStatus(200);
});

app.post("/pagar", async  (req, res) => {
        /* CREO EN LA BASE DE DATOS UN NUEVO PAGO CON ESTADO SIN PAGAR */
  const nuevoProducto = await prisma.pagos.create({
    data:{
      estado:0
    }
  })

  const carrito = req.body;

  const preference = {
    metadata:{id:nuevoProducto.id},
    items: [],
    back_urls: {
      success: `${PuertoAPP}/success`,
      failure: `${PuertoAPP}/failure`,
      pending: `${PuertoAPP}/pending`,
    },
    notification_url:
      "https://9067-2803-6d00-c56d-0-5d7c-22ab-8118-a4d.ngrok.io/webhook",
  };

  for (let i = 0; i < carrito.productos.length; i++) {
    var item = {
      title:
        carrito.productos[i].producto +
        " de " +
        carrito.productos[i].redSocial +
        " x " +
        carrito.productos[i].cantidad,
      unit_price: carrito.productos[i].precio,
      quantity: 1,
    };
    preference.items.push(item);
  }
  mercadopago.preferences
    .create(preference)
    .then((response) => {
     /*  LE MANDO EL INIT POINT PARA QUE SE RENDERICE EN EL FRONT */
      console.log(preference);
      res.send(response.body.init_point);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Hubo un error al crear la preferencia de pago." });
    });
});

/* --------------------------------- PAYPAL --------------------------------------------------- */
app.post('/create-order-paypal', async (req, res) => {
  console.log("entra")
  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "105.70",
        },
      },
    ],
    application_context: {
      brand_name: "DeSeguidores.com",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `http://localhost:4200/success`,
      cancel_url: `http://localhost:4200/failure`,
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const {
    data: {access_token}
  } = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    }
  );

  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });

  for (let i = 0; i < response.data.links.length; i++) {
    if(response.data.links[i].rel === "approve"){
      console.log(response.data);
      res.json({"link":response.data.links[i].href});
   }
  }
});


app.get("/capture-order", async (req,res) => {
  const {token} = req.query;
  console.log(token)

  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
    auth:{
      username:PAYPAL_API_CLIENT,
      password:PAYPAL_API_SECRET
    }
  })

  console.log("pagado")
  enviarMail();
  res.json({"estado":"pagado"})
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
      for (let h = 0; h < data[r]?.productos?.length; h++) {
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
              precio_ars: productos_cantidad[u].precio_ars,
              precio_usd: productos_cantidad[u].precio_usd,
              precio_eur: productos_cantidad[u].precio_eur,
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
  console.log("asdasdas")
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
          precio_ars: data.productos_cantidad[i].precio_ars,
          precio_usd: data.productos_cantidad[i].precio_usd,
          precio_eur: data.productos_cantidad[i].precio_eur,
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

app.post("/productos_cantidad", async (req, res) => {
  const { id, datos } = req.body;
  const productoActualizado = await prisma.producto_cantidad.update({
    where: { id },
    data: {
      cantidad: datos.cantidad,
      precio_ars: datos.precio_ars,
      precio_usd: datos.precio_usd,
      precio_eur: datos.precio_eur,
    },
  });
  console.log(productoActualizado);
});

app.post("/producto_cantidad_borrar", async (req, res) => {
  const { id } = req.body;
  const producto_cantidad = await prisma.producto_cantidad.delete({
    where: { id },
  });

  console.log(producto_cantidad);
  res.send(producto_cantidad);
});

app.post("/producto_cantidad_agregar", async (req, res) => {
  const { datos, id } = req.body;
  const producto_cantidad = await prisma.producto_cantidad.create({
    data: {
      cantidad: datos.cantidad,
      idProducto: id,
      precio_ars: datos.precio_ars,
      precio_usd: datos.precio_usd,
      precio_eur: datos.precio_eur,
    },
  });

  console.log(producto_cantidad);
  res.send(producto_cantidad);
});
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
