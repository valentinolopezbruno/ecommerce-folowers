const express = require('express')
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
const  { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecomerce-ivan'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos: ', err);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
  });


/* --------------------------------- LOGIN --------------------------------------------------- */

app.post('/usuarios', async (req,res) => {
    var cont = 0;
    const {nombre, contra} = req.body;
    const usuarios = await prisma.usuarios.findMany();

    for (let i = 0; i < usuarios.length; i++) {
        if(nombre == usuarios[i].nombre && contra == usuarios[i].contra){
            cont = cont + 1;
            console.log("Es Correcto")
            res.send({code: 1})
        }
      }
    
    if(cont == 0){
        console.log("Incorrecto")
        res.send({code: 0})
    }
})


app.get('/productos', async (req, res) => {

        const social = await prisma.social.findMany();
        const productos = await prisma.productos.findMany();
        const productos_cantidad = await prisma.producto_cantidad.findMany();

       var data = [];

        for (let i = 0; i < social.length; i++) {
            var RedSocial = {
                idSocial: social[i].id,
                nombre: social[i].nombre,
                imagen: social[i].imagen,
                productos:[]
            };

            data.push(RedSocial)
            
            for (let j = 0; j < productos.length; j++) {
                for (let g = 0; g < data.length; g++) {
                  if (data[g].idSocial == productos[j].id_social) {
                    // Verificar si el producto ya existe en el array productos
                    const existeProducto = data[g].productos.some(p => p.idProducto === productos[j].id);
                    if (!existeProducto) {
                      var producto = {
                        idProducto: productos[j].id,
                        nombre: productos[j].nombre,
                        imagen: productos[j].imagen,
                        idSocial: productos[j].id_social,
                        productos_cantidad: []
                      };
                      data[g].productos.push(producto);
                    }
                  }
                }
              }
        }

        for (let u = 0; u < productos_cantidad.length; u++) {
            for (let r = 0; r < data.length; r++) {
              for (let h = 0; h < data[r].productos.length; h++) {
                if (data[r].productos[h].idProducto === productos_cantidad[u].idProducto) {
                  // Verificar si el producto ya existe en el array productos
                  const existeProducto = data[r].productos[h].productos_cantidad.some(p => p.idProductoCantidad === productos_cantidad[u].id);
                  if (!existeProducto) {
                    var producto_cantidad = {
                      idProductoCantidad: productos_cantidad[u].id,
                      idProducto: productos_cantidad[u].idProducto,
                      cantidad: productos_cantidad[u].cantidad,
                      precio: productos_cantidad[u].precio
                    };
                    data[r].productos[h].productos_cantidad.push(producto_cantidad);
                  }
                }
              }
            }
          }
        
          res.json(data);
          
});

app.post('/productos', async (req, res) => {
  var data = req.body

  try {
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre: data.nombre,
        imagen: data.imagen,
        id_social: data.idSocial
      },
    });
    console.log('Datos insertados:', nuevoProducto);

    for (let i = 0; i < data.productos_cantidad.length; i++) {
      data.productos_cantidad[i].idProducto = nuevoProducto.id

      const nuevoProductoCantidad = await prisma.producto_cantidad.create({
        data: {
          idProducto: data.productos_cantidad[i].idProducto,
          cantidad: data.productos_cantidad[i].cantidad,
          precio: data.productos_cantidad[i].precio
        },
      });
      console.log('Datos insertados:', nuevoProductoCantidad);
    }

  } catch (error) {
    console.error('Error al insertar datos:', error);
  }

  


})

app.post('/producto', async (req, res) => {
  const { id } = req.body; // Asegúrate de extraer el valor del cuerpo de la solicitud correctamente

  try {
    const productoEliminado = await prisma.productos.delete({
      where: {
        id: id,
      },
    });
    console.log(productoEliminado);
    res.send('Producto eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
});


app.get('/', async (req,res) => {
    const usuarios =  await prisma.productos.findMany();
    console.log(usuarios)
    res.json( usuarios )
})

app.get('/cantidad', async (req,res) => {
    var socialData = await prisma.productos.findMany({
        include: {
            producto_cantidad: true,
        }
      });

    console.log(socialData.length)
    res.json( socialData )
})



app.listen(3000, () => {
    console.log("app corriendo en puerto 3000")
})

