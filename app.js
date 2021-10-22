const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

const usuarios = [
    {id: 1, nombre: 'Grover'},
    {id: 2, nombre: 'Luis'},
    {id: 3, nombre: 'Maria'},
]

app.get('/', (req, res)=>{
    res.send('hola mundo desde express.');
});//petición

app.get('/api/usuarios', (req, res)=>{
res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios/', (req, res)=>{
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id : usuarios.length+1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
        // console.log(resultado);
    
    // if(!req.body.nombre || req.body.nombre.length <= 2){
    //     //400 Bad Request
    //     res.status(400).send("Debe ingresar un nombre, debe contener mas de 2 caractéres");
    //     return;
    // }
    
});

app.put('/api/usuarios/:id', (req, res)=>{
    //Encontrar si existe el objeto a modificar
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(400).send("El usuario no fue encontrado");
        return;
    }

    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(400).send("El usuario no fue encontrado");
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`ESCUCHANDO EN EL PUERTO ${port}...`);
});

function existeUsuario(id){
   return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
        });
    
    return (schema.validate({ nombre: nom }));
}
