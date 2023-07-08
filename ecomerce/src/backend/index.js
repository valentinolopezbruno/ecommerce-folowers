const express = require('express')
const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors());

const  { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

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

app.get('/productos', async (req,res) => {
  
    var socialData = await prisma.social.findMany({
        include: {
          productos: true,
        }
      });
    
    if (Array.isArray(socialData) && socialData.length > 0) {
        var socialData1 = await prisma.productos.findMany({
            include: {
                producto_cantidad: true,
            }
          });

          /* res.json( socialData1 ) */
        
    }

    console.log(socialData.length)
    res.json( socialData)
})

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

