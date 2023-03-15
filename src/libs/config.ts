const production:boolean = true;

export default class Config {

    protected static api_url   = production ? "http://sindcelmatecnologia.com.br/": "http://localhost:3050/"
    protected static files_url = production ? "http://assetsindcelma.com.br/": "http://localhost:8904/"

    public static api(uri:string){
        return Config.api_url + uri
    }

    public static file(uri:string){
        return Config.files_url + uri
    }
    
}