export const generateProductErrorInfo=(Object)=>{
    const requiredFields = Object.keys(Object);
    let mensaje = `Una o más de las propiedades están incompletas o no son válidas.Lista:
    `;

    requiredFields.forEach(field => {
        if (!Object[field]) {
            mensaje += `* ${field} esta incompleto.
            `;
        }
    });

    return mensaje;
}

export const typeError = (Object)=>{
    return`
        Uno o más de los campos no son del tipo correcto.
        Lista: 
        * title debe ser un string y se recibio: ${typeof Object.title}
        * description debe ser un string y se recibio: ${typeof Object.description}
        * price debe ser un number y se recibio: ${typeof Object.price}
        * code debe ser un string y se recibio: ${typeof Object.code}
        * stock debe ser un number y se recibio: ${typeof Object.stock}
        * status debe ser un booleano y se recibio: ${typeof Object.status}
        * category debe ser un string y se recibio: ${typeof Object.category}
    `
}

export const databaseError = (encontrado, id) =>{
    return `
        Error al acceder  la DB: 
        se enocnto: 
        * ${encontrado} con el id: ${id}
    `
}

export const routingType = (param) =>{
    return `
        Error en el routing: 
        * ${param} no es un parametro valido
    `
}