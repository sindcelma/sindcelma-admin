const production:boolean = true;

export default class Config {

    protected static api_url   = production ? "https://sindcelmatecnologia.com.br/": "http://192.168.0.11:3050/"
    protected static files_url = production ? "http://assetsindcelma.com.br/": "http://172.17.0.4/"

    public static api(uri:string){
        return Config.api_url + uri
    }

    public static file(uri:string){
        return Config.files_url + uri
    }
    
}