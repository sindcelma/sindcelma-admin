interface SocioInterface {
    id:Number,
    nome:String,
    sobrenome:String,
    cpf?:String,
    np?:String
}

export default class SocioList {
    
    public socios:SocioInterface[] = []

    constructor(socios:SocioInterface[]){
        this.socios = socios;
    }

    public getList(){
        return this.socios;
    }

} 