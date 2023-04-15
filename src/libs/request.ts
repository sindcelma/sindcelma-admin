
import { Buffer } from 'buffer';
import Config from './config';

interface resp { message:any, session?:string }

const NAME_REMEMBER_TK = "rememberme_tk_admin"
let callback_close:Function = () => {}

class ConfigRequest extends Config {

    private static session = ""

    public static section(session?:string){
        if(!session){
            return ConfigRequest.session
        } 
        ConfigRequest.session = session
    }

}

class ResponseRequest {
    
    private response:resp;
    private status:number;

    constructor(response:resp, status:number){
        if(response.session){
            ConfigRequest.section(response.session)
        }
        this.response = response 
        this.status   = status
    }

    public code(){
        return this.status
    }

    public message(){
        return this.response.message
    }

    public session(){
        return this.response.session
    }

}

function saveCookie(name:string, value:string){
    var date = new Date();
    date.setTime(date.getTime() + (100*24*60*60*1000));
    document.cookie = name + "=" + (value || "")  +  "; expires=" + date.toUTCString(); + "; path=/";
}

function removeCookie(name:string){
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name:string){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

async function get(uri:string){
    try {
        const response = await fetch(ConfigRequest.api(uri), {
            method:'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        })
        if(response.status == 401) {
            callback_close()
            return new ResponseRequest({message:{}}, 0)
        }
        return new ResponseRequest(await response.json(), response.status)
    } catch (error) {
        return new ResponseRequest({message:{}}, 0)
    }
}

async function post(uri:string, data:{session?:string}, upload:boolean = false, full:boolean = false, download:boolean = false):Promise<ResponseRequest>{
    try {

        const atualSection = ConfigRequest.section()
        
        if(atualSection != ""){
            data.session = atualSection
        }
        
        let url = ConfigRequest.api(uri)

        if(download){
            await fetch(url, {
                method:'POST',
                body:JSON.stringify(data)
            })
            .then( res => res.blob() )
            .then( blob => {
                var file = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.download = url;
                a.href = file;
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
            return new ResponseRequest({message:''}, 800)
        }

        const response = await fetch(url, {
            method:'POST',
            headers: {
                'accept':'*/*',
                'content-type': 'application/json;charset=UTF-8',
            },
            body:JSON.stringify(data)
        })
        
        let textResponse = await response.text()
        //console.log(textResponse);
        
        if(response.status == 401) {
            callback_close()
            return new ResponseRequest({message:{}}, response.status)
        }
        return new ResponseRequest(JSON.parse(textResponse), response.status)
    } catch (error) { 
        return new ResponseRequest({message:{}}, 0)
    }
}


async function create(dir:string, ext:string){
    
    const resp = await post('files/admin/create', {
        ext: ext,
        dir: dir
    }, true)
    console.log('created');
    
    if(resp && resp.code() == 200)
        return resp.message().slug
    return false;
}

async function append(dir:string, ext:string, slug:string, data:string){
    console.log('appended');
    const resp = await post('files/admin/append', {
        ext: ext,
        dir: dir,
        slug:slug,
        data:data
    }, true)
    return resp && resp.code() == 200
}

async function commit(dir:string, ext:string, slug:string){
    console.log('commited');
    const resp = await post('files/admin/commit', {
        ext: ext,
        dir: dir,
        slug:slug
    }, true)
    
    return resp && resp.code() == 200 ? resp.message() : false;
}

export default {

    uri: (uri:string, full:boolean = false, download:boolean = false) => {
        return {
            get: async () => await get(uri),
            post: async (data:{}):Promise<ResponseRequest> => await post(uri, data, false, full, download)
        }
    },

    uploadFile: async (dir:string, file:File, extension?:string) => {

        const reader = new FileReader()
        let ext = ""
        if(!extension){
            const prts = file.name.split('.')
            ext = prts[prts.length - 1]
        } else {
            ext = extension
        }
        
        const slug   = await create(dir, ext)
        var finish   = false;
        var status   = true;
        
        if(!slug) return false;

        const limitSize = (8 * 8 * 8 * 8)
        let start  = 0
        let end    = file.size > limitSize ? limitSize : file.size
        
        while (!finish) {

            if(end > file.size){
                end = file.size  
                finish = true  
            }

            await new Promise((resolve, reject) => {
                reader.onload = async e => {
                    if(e.target){   
                        const fresult:ArrayBuffer = <ArrayBuffer> e.target.result;
                        const buf  = Buffer.alloc(fresult.byteLength);
                        const view = new Uint8Array(fresult);
                        
                        for (let i = 0; i < buf.length; ++i) 
                            buf[i] = view[i];

                        let base64String = buf.toString('base64');


                        const res = await append( dir, ext, slug, base64String )
                        
                        if(!res){
                            status = false;
                            finish = true;
                        }

                        resolve()
                    }
                }

                let slice = file.slice(start, end);
                reader.readAsArrayBuffer(slice);
            })

            start = end
            end  += limitSize
        }

        if(!status) return false;

        const img = await commit(dir, ext, slug)
        if(img) return img
        
        return false;
            
    },

    saveCookie:(name:string, value:string) => saveCookie(name, value),
    getCookie:(name:string) => getCookie(name),
    removeCookie: (name:string) => removeCookie(name),
    setSession: (session:string) => ConfigRequest.section(session),
    NAME_REMEMBER_TK,
    setCallbackCloseFunc: (callback:Function) => callback_close = callback
    
}