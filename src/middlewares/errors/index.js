import EErrors from "../../service/enums.js";

export default (error, req, res, next) =>{
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: "error", error:error.message});
            break;
        case EErrors.INVALID_FORMAT_ERROR:
            res.send({status: "error", error:error.message});
            break;
        case EErrors.DATABASE_ERROR:
            res.send({status: "error", error:error.message});
            break;
        case EErrors.ROUTING_ERROR:
            res.send({status: "error", error:error.message});
            break;
        default:
            res.send({status: "error", message: "Error desconocido"});
    }
}