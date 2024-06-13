fecha_actual = () => {
    fecha = new Date()
    opciones = {
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
    }
    fecha_actual = fecha.toLocaleDateString('es-ES', opciones)
    return fecha_actual
}; exports.fecha_actual = fecha_actual

dia = () => {
    fecha = new Date()
    opciones = {
        day:'numeric'
    }
    dia = fecha.toLocaleDateString('es-ES', opciones)
    return dia
}; exports.dia = dia 

dia_semana = () => {
    fecha = new Date()
    opciones = {
        weekday:'long'
    }
    dia_semana = fecha.toLocaleDateString('es-ES', opciones)
    return dia_semana
}; exports.dia_semana = dia_semana
