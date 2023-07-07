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



app.listen(3000, () => {
    console.log("app corriendo en puerto 3000")
})
