// SHIFT + ALT + F para usar el Prettier

var colors = require("colors");
console.log(colors.green("Hola"));
console.log(colors.rainbow("Hola"));

var express = require("express");
var app = express();
var lista = new Map();

var idActual = 2

app.post("/items", function (pet, resp) {
    if (!pet.body.nombre) {
        resp.status(400)
        resp.send({
            code: 3,
            message: "El objeto debe tener un nombre."
        })
    }
    else {
        idActual++
        lista.set(idActual, {id:idActual, nombre:pet.body.nombre})
    }
});

// En Express asociamos un método HTTP y una URL con un callback a ejecutar.
app.get("/items", function (pet, resp) {
    resp.status(200)
    resp.send(Array.from(lista.values()))
});

app.get("/items/:id", function (pet, resp) {
    id = parseInt(pet.params.id)
    if (isNaN(id)) {
        resp.status(400)
        resp.send({
            code: 1,
            message: "El parámetro es incorrecto."
        })
    }
    else {
        item = lista.get(id)
        if (item === undefined) {
            resp.status(400)
            resp.send({
                message: "El dato no existe."
            })
        }
        else {
            resp.status(200)
            resp.send(item)
        }
    }
});

// Con "nodemon <fichero>.js" podemos ahorrarnos apagar y encender el servidor.
// Nos podemos a escuchar por el puerto 3000
app.listen(3000, function(){
    lista.set(1,{id:1, nombre:"pan"})
    lista.set(2,{id:2, nombre: "tomates"})
    console.log("Servidor arrancado OK")
})
