<template>
    <div class="container">
        <div class="row justify-content-center">

            <div class="col-12" style="position: absolute;">
                <div style="height: 80px;" v-if="showAlert">
                    <Alert :message="msg" :type="typ" />
                </div>
            </div>
            
            <div class="col-12 col-md-6 col-lg-4">
                <form class="my-5 p-3 border">
                    <h5 class="text-center">Login:</h5>
                    <InputVue 
                        type="text" 
                        label="email" 
                        placeholder="e-mail" 
                        @onChange="onChangeEmail"
                        regex="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*" 
                        messageError="Este e-mail não é válido"
                        icon="&#128231;"
                        />
                    <InputVue 
                        type="password" 
                        label="senha" 
                        placeholder="senha"
                        @onChange="onChangeSenha" 
                        icon="&#128274;"
                        />
                    <div v-if="!checking">
                        <button type="button" @click="checkLogin" class="btn btn-success d-block mx-auto">entrar</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-success d-block mx-auto" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            aguarde...
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import InputVue from './Input.vue';
import Alert from './Alert.vue'
import { defineComponent } from 'vue';
import request from '@/libs/request';

interface data {
    email:string,
    senha:string,
    status:boolean,
    checking:boolean,
    showAlert:boolean,
    msg:String,
    typ:String
}

export default defineComponent({
    components:{InputVue, Alert},
    data():data{
        return {
            email:"",
            senha:"",
            status:false,
            checking:false,
            showAlert:false,
            msg: "",
            typ:"success"
        }
    },
    methods:{
        async checkLogin(){
            if(!this.status) return
            this.checking = true
            let response = await request.uri('user/login').post({
                email:this.email,
                senha:this.senha,
                type:'Admin',
                rememberme:true
            })
            if(response && response.code() == 200){
                request.saveCookie(request.NAME_REMEMBER_TK, response.message().remembermetk)                
                this.$emit('onCheckSession')
            } else {
                this.showAlertMessage('danger', 'A senha e/ou e-mail estão incorretos')
            }
            this.checking = false
        },
        onChangeEmail(newVal:string, oldVal:string, status:boolean){
            this.email = newVal
            this.status = status
        },
        onChangeSenha(newVal:string, oldVal:string){
            this.senha = newVal
        },
        showAlertMessage(type:String, message:String){
            this.msg = message 
            this.typ = type
            this.showAlert = true
        },
        onAlertDismiss(){
            this.showAlert = false
        }
    }
})

</script>

