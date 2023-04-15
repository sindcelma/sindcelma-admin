<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed; z-index:99999999;"/>
    </div>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showForm">

        <div class="container" v-if="formEmail">
            <div class="row">
                <div class="col-12">
                    <form class="bg-white p-4 mt-5 rounded">
                        <button @click="hideForm" type="button" class="btn-close" aria-label="Close" style="float:right;"></button>
                        <h5>Alterar E-mail:</h5>
                        <p>Para alterar o e-mail, digite o novo e-mail e a senha</p>
                        <InputVue 
                            type="text" 
                            label="email" 
                            placeholder="Novo e-mail" 
                            @onChange="onChangeEmail"
                            regex="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*" 
                            messageError="Este e-mail não é válido"
                            icon="&#128231;"
                        />
                        <InputVue 
                            type="password" 
                            label="senha" 
                            placeholder="sua senha"
                            @onChange="onChangeSenha" 
                            icon="&#128274;"
                        />
                        <button type="button" class="btn btn-success">alterar</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="container" v-if="formSenha">
            <div class="row">
                <div class="col-12">
                    <form class="bg-white p-4 mt-5 rounded">
                        <button @click="hideForm" type="button" class="btn-close" aria-label="Close" style="float:right;"></button>
                        <h5>Alterar senha:</h5>
                        <InputVue 
                            type="password" 
                            label="senha" 
                            placeholder="senha atual"
                            @onChange="onChangeSenhaAntiga" 
                            icon="&#128274;"
                        />

                        <InputVue 
                            type="text" 
                            label="senha" 
                            placeholder="nova senha"
                            @onChange="onChangeSenhaNova" 
                            icon="&#128274;"
                        />
                        <button @click="salvarNovaSenha" type="button" class="btn btn-success">alterar</button>
                    </form>
                </div>
            </div>
        </div>

    </div>

    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h1 class="p-1">{{ nome }}</h1>
                            <h5>{{ email }}</h5>
                        </div>
                        <div class="col-12 d-flex justify-content-between py-3">
                            <div>
                                <!-- <button class="btn btn-info m-1" @click="showForm = true; formEmail = true; formSenha = false">alterar email</button> -->
                                <button class="btn btn-success m-1" @click="showForm = true; formEmail = false; formSenha = true">alterar senha</button>
                            </div>
                            <button type="button" class="btn btn-sm btn-danger" @click="logout">Sair</button>
                        </div>
                        <hr>
                    </div>
                    <div class="col-12" v-if="logoutIn">
                        <p class="text-danger">Saindo em <b>{{ time }} segundos</b></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang='ts' setup>
import User from '@/model/User';
import InputVue from '@/components/Input.vue'
import { defineComponent } from 'vue'
import request from '@/libs/request'
import Alert from '@/components/Alert.vue';

</script>

<script lang='ts'>

export default defineComponent({

    data() {
        return {
            showForm:false,
            formEmail:false,
            formSenha:false,
            nome:User.nome,
            master:User.master,
            email:User.email,
            novoEmail:'',
            senhaParaNovoEmail:'',
            senhaAntiga:'',
            senhaNova:'',
            showAlert:false,
            msg:'',
            type:'',
            keyAlert:1,
            logoutIn:false,
            time:5
        }
    },

    methods: {
        
        hideForm(){
            this.showForm = false
        },
        
        onChangeEmail(email:string){
            this.novoEmail = email
        },
        
        onChangeSenha(senha:string){
            this.senhaParaNovoEmail = senha
        },
        
        onChangeSenhaAntiga(senha:string){
            this.senhaAntiga = senha
        },
        
        onChangeSenhaNova(senha:string){
            this.senhaNova = senha
        },

        showAlertNow(message:string, type:string){
            this.showAlert = false 
            this.msg = message 
            this.type = type
            this.keyAlert++;
            this.showAlert = true
        },
        
        async salvarNovoEmail(){

        },
        
        async salvarNovaSenha(){

            let respKey = await request.uri('user/generate_temp_key').post({
                senha:this.senhaAntiga
            })

            if(respKey.code() != 200){
                return this.showAlertNow(respKey.message(), 'danger')
            }

            let tempKey = respKey.message()

            let respChange = await request.uri('user/change_password').post({
                oldPass:this.senhaAntiga,
                newPass:this.senhaNova,
                key:tempKey
            })

            if(respChange.code() != 200){
                this.showAlertNow(respChange.message(), 'danger')
            } else {
                this.showAlertNow('Senha alterada com sucesso!', 'success')
                this.hideForm()
                this.logout()
            }
            
        },
        
        logout(){
            this.logoutIn = true 
            request.removeCookie(request.NAME_REMEMBER_TK)
            const interval = setInterval(e => {
                if(this.time == 0){
                    clearInterval(interval)
                    location.reload()
                    return;
                }
                this.time--
            }, 1000)
        }

    },

})
</script>