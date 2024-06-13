// REQUIRES & IMPORTS 
const express = require('express')
const body_pareser = require('body-parser')
const ejs = require('ejs')
const _ = require('lodash')
const mongoose = require('mongoose')
// const bootstrap = require('bootstrap')
const index_js = require(__dirname + '/public/js/index.js')

// BASE DE DATOS (Mongoose)
// Conectar //
conectar = async () =>{
    usuario = encodeURIComponent('ominon')
    contraseña = encodeURIComponent('bo9aUkXMHquMRubv')
    base_de_datos = 'notaDB'
    url = 'mongodb://localhost:27017/'
    uri = "mongodb+srv://" + usuario + ":" + contraseña + "@cluster0.yplqi7l.mongodb.net/" + base_de_datos
    mongoose.connect(uri)
}
conectar().catch(error => console.log(error))

// Esquemas // 
esquema_parafo = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    }
})

esquema_nota = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    }
})

// Modelos //
Parafo = mongoose.model('parafo', esquema_parafo)

Nota = mongoose.model('nota', esquema_nota)

// APP
app = express()
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(body_pareser.urlencoded({extended: true}));

// VARIABLES GLOBALES
fecha = index_js.fecha_actual()

texto_inicio = new Parafo ({
    name: 'inicio',
    texto: 'Lorem Inicio ipsum dolor sit amet consectetur adipisicing elit. Esse molestiae sequi iusto sint voluptates repellendus iste numquam vel excepturi, tempore impedit, obcaecati, error modi facere voluptatum sapiente sit hic consequatur Ad officiis perspiciatis reiciendis repudiandae quibusdam itaque tempora ex sint optio, dolores veritatis doloremque voluptates aliquam provident dolore similique quam cum numquam autem. Accusamus doloremque aspernatur perferendis maiores.'
})

texto_info = new Parafo({
    name: 'info',
    texto: 'Lorem Info ipsum dolor sit amet consectetur adipisicing elit. Esse molestiae sequi iusto sint voluptates repellendus iste numquam vel excepturi, tempore impedit, obcaecati, error modi facere voluptatum sapiente sit hic consequatur Ad officiis perspiciatis reiciendis repudiandae quibusdam itaque tempora ex sint optio, dolores veritatis doloremque voluptates aliquam provident dolore similique quam cum numquam autem. Accusamus doloremque aspernatur perferendis maiores.'
}) 

texto_contacto = new Parafo ({
    name: 'contacto',
    texto: 'Lorem Contacto ipsum dolor sit amet consectetur adipisicing elit. Esse molestiae sequi iusto sint voluptates repellendus iste numquam vel excepturi, tempore impedit, obcaecati, error modi facere voluptatum sapiente sit hic consequatur Ad officiis perspiciatis reiciendis repudiandae quibusdam itaque tempora ex sint optio, dolores veritatis doloremque voluptates aliquam provident dolore similique quam cum numquam autem. Accusamus doloremque aspernatur perferendis maiores.'
})

parafos_Xdefecto = [texto_inicio, texto_info, texto_contacto]

// FUNCIONES GLOBALES

buscar = async (coleccion, filtro) => {
    busqueda = await coleccion.findOne(filtro)
    return busqueda
};

buscar_varios = async (coleccion, filtro) => {
    busqueda = await coleccion.find(filtro)
    return busqueda
};

buscar_actualizar = async (coleccion, filtro, elemento) => {
    busqueda = await coleccion.findOneAndUpdate(filtro, elemento)
    return busqueda
};

eliminar = async (coleccion, filtro) => {
    busqueda = await coleccion.deleteOne(filtro)
    return busqueda
};

eliminar_varios = async (coleccion, filtro) => {
    busqueda = await coleccion.deleteMany(filtro)
    return busqueda
};

eleiminar_xid = async (coleccion, filtro) => {
    busqueda = await coleccion.findByIdAndDelete(filtro)
    return busqueda
};

//  GET 
app.get('/', (demnd, resp) => { 
    filtro = {}
    parafos_q = buscar_varios(Parafo, filtro).then((parafos, error) => {
        if (!error) {
            if (parafos.length === 0) {
                Parafo.insertMany(parafos_Xdefecto)
                resp.redirect('/')
            } else {
                titulo = 'inicio'
                filtro = {name: titulo}
                parafo_q = buscar(Parafo, filtro).then((parafo, error) => {
                    if (!error) {
                        filtro = {}
                        publicaciones_q = buscar_varios(Nota, filtro).then((publicaciones, error) => {
                            resp.render('inicio', {el_titulo: parafo.name, la_fecha: fecha, mis_publicaciones: publicaciones, el_texto: parafo.texto})
                        })
                    }
                })
            }
        }
    })
});

app.get('/:ir', (demnd, resp) => {
    titulo = _.lowerCase(demnd.params.ir)
    filtro = {name: titulo}
    if (titulo === 'info') {
        parafo_q = buscar(Parafo, filtro).then((parafo, error) => {
            if (!error) {
                resp.render('informacion', {el_titulo: parafo.name, la_fecha: fecha, el_texto: parafo.texto})
            }
        })
    } else if (titulo === 'contacto') {
        parafo_q = buscar(Parafo, filtro).then((parafo, error) => {
            if (!error) {
                resp.render('contacto', {el_titulo: parafo.name, la_fecha: fecha, el_texto: parafo.texto})
            }
        })
    } else if (titulo === 'componer') {
        resp.render('componer', {el_titulo: titulo, la_fecha: fecha})
    }
})

app.get('/post/:titulo', (demnd, resp) => {
    titulo = _.lowerCase(demnd.params.titulo)
    filtro = {}
    titulo_demnd = _.lowerCase(demnd.params.titulo)
    publicaciones_q = buscar_varios(Nota, filtro).then((publicaciones, error) => {
        publicaciones.forEach((publicacion) => {
            id_publicacion = publicacion._id
            titulo_publicacion = publicacion.titulo
            contenido_publicacion = publicacion.contenido
            if (titulo_publicacion === titulo_demnd) {
                resp.render('post', {el_titulo: titulo, nota: publicacion})
            }
        })
    })
});

// POST
app.post('/', (demnd, resp) => {
    resp.redirect('/')
});

app.post('/componer', (demnd, resp) => {
    nueva_publicacion = new Nota ({
        titulo: demnd.body.titulo, 
        contenido:demnd.body.contenido
    })
    nueva_publicacion.save()
    resp.redirect('/')
});

app.post('/eliminar', (demnd, resp) => {
    id_publicacion = demnd.body.eliminar
    filtro = {_id: id_publicacion}
    publicacion_q = eleiminar_xid(Nota, filtro).then((publicacion, error) => {
        if (!error) {
            resp.redirect('/')
        }
    })
});

// app.post('/info', (demnd, resp) => {
//     console.log(resp.statusCode)
//     resp.redirect('/info')
// });

// app.post('/contacto', (demnd, resp) => {
//     console.log(resp.statusCode)
//     resp.redirect('/contacto')
// });





























// PUERTO
puerto = process.env.PORT || 3000

app.listen(puerto, () => {
    console.log(puerto + ' OK')
});