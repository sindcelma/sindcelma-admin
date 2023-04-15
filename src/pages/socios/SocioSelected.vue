import { defineProps, defineComponent } from 'vue';
<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed;"/>
    </div>    
    <div class="container">
        <div class="row">

            <div class="col-6 py-5">

                <div class="row">
                    <div class="col-12">
                        <div v-if="image != ''">
                            <img :src="image" class="img-thumbnail" style="width: 100px;"/>
                        </div>

                        <h1>{{ nome }} {{ sobrenome }}</h1>
                        <h4><small>email:</small> <b>{{ email }}</b></h4>
                        <h4><small>CPF:</small> <b>{{ cpf }}</b></h4>
                        <h4><small>NP:</small> <b>{{ np }}</b></h4>
                        <h4 :class="status == 2 ? 'text-warning' : (status == 3 ? 'text-success' : 'text-danger')"
                        ><b>{{ status == 2 ? 'aguardando aprovação' : (status == 3 ? 'ativo' : 'bloqueado') }}</b></h4>
                        <h4  style="font-size: 10px;"><b>{{ slug }}</b></h4>
                        
                        <div v-if="status == 2">
                            <button @click="mudar_status(3)" class="btn btn-success m-2">aprovar</button>
                            <button @click="mudar_status(1)" class="btn btn-danger m-2">reenviar imagens</button>
                        </div>

                        <div v-if="status == 3">
                            <button @click="mudar_status(4)" class="btn btn-danger m-2">bloquear</button>
                        </div>

                        <div v-if="status == 4">
                            <button @click="mudar_status(3)" class="btn btn-success m-2">desbloquear</button>
                        </div>

                        <div class="col-3 py-2">
                            <select class="form-select" @change="changeUser" v-model="typeUser">
                                <option value="1">Socio</option>
                                <option value="2">Diretor</option>
                                <option value="3">Ghost</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-12 py-3 mt-3 border-top" v-if="data_loaded.includes(false)">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <div class="col-12 py-3 mt-3 border-top" v-if="!data_loaded.includes(false)">

                        <!-- Area Pessoal -->

                        <h3>Dados Pessoais:</h3>
                        <p><b>RG:</b> {{ rg }}</p>
                        <p><b>sexo:</b> {{ sexo }}</p>
                        <p><b>data nascimento:</b> {{ data_nascimento }}</p>
                        <p><b>telefone:</b> {{ telefone }}</p>

                        <hr>

                        <!-- Area Profissional -->

                        <h3>Dados Profissionais</h3>
                        <p><b>empresa:</b> {{ empresa }}</p>
                        <p><b>cargo:</b> {{ cargo }}</p>
                        <p><b>data admissao:</b> {{ data_admissao }}</p>

                    </div>
                </div>

            </div>
            <div class="col-6 py-4">
                <div class="row">
                    <div class="col">
                        <h5>Imagens Enviadas:</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col" v-for="image in images" :key="image">
                        <img :src="image.slug" style="height: 340px;"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { useRoute } from 'vue-router'
import {defineComponent} from 'vue'
import request from '@/libs/request'
import Config from '@/libs/config'
import Alert from '@/components/Alert.vue'

export default defineComponent({

    components:{Alert},

    created(){
        const router = useRoute()
        this.id = Number(router.params.id)
        this.getSocio()
    },

    data() {
        return {

            nome:"",
            sobrenome:"",
            email:"",
            cpf:"",
            np:"",
            slug:"",
            id: 0,
            images:[],
            status: 0,
            image:'',
            diretor:0,
            ghost:0,
            typeUser:1,
            oldTypeUser:1,
            showAlert:false,
            msg:'',
            type:'',
            keyAlert:1,


            data_loaded:[false, false],

            // dados pessoais
            estado_civil:'',
            sexo:'',
            data_nascimento:'',
            telefone:'',
            rg:'',

            // dados profissionais
            cargo:'',
            data_admissao:'',
            empresa:'',

        }

    },

    methods: {

        async attType(){
            if(this.diretor == 1){
                this.typeUser = 2
                return
            }
            if(this.ghost == 1){
                this.typeUser = 3
                return
            }
        },

        async getSocio(){
            
            let resp = await request
            .uri('user/socios/get_socio_por_id')
            .post({ id: this.id })

            let message    = resp.message()
            
            this.status    = message.status 
            this.nome      = message.nome 
            this.sobrenome = message.sobrenome
            this.cpf       = message.cpf
            this.np        = message.np
            this.slug      = message.slug
            this.email     = message.email
            this.ghost     = message.ghost
            this.diretor   = message.diretor
            this.images    = message.images
                        
            this.image     = Config.file('images/fav/'+this.email+'.jpg')
            this.attType()

            this.get_dados_pessoais()
            this.get_dados_profissionais()

        },

        async get_dados_pessoais(){
            
            let resp = await request
            .uri('user/socios/get_dados_pessoais')
            .post({ slug: this.slug })

            
            if(resp.code() != 200){
                return;
            }

            let res = resp.message()

            let dataNasc = new Date(res.data_nascimento)
            let dataStr = `${dataNasc.getDate()}/${Number(dataNasc.getMonth()+1)}/${dataNasc.getFullYear()}`

            this.rg = res.rg
            this.sexo = res.sexo 
            this.data_nascimento = dataStr
            this.telefone = res.telefone 
            this.estado_civil = res.estado_civil

            this.data_loaded[0] = true

        }, 

        async get_dados_profissionais(){

            let resp = await request
            .uri('user/socios/get_dados_profissionais')
            .post({ slug: this.slug })

            if(resp.code() != 200){
                return;
            }

            let res = resp.message()

            let dataAdm = new Date(res.data_admissao)
            let dataStr = `${dataAdm.getDate()}/${Number(dataAdm.getMonth()+1)}/${dataAdm.getFullYear()}`

            this.empresa = res.nome_empresa
            this.cargo = res.cargo 
            this.data_admissao = dataStr
 
            this.data_loaded[1] = true

        },

        async mudar_status(status:number){
            
            let resp = await request
            .uri('user/socios/mudar_status')
            .post({
                slug:this.slug,
                status:status
            })

            if(resp.code() == 200){
                this.status = status
            }

        },

        async changeUser(){

            if(this.typeUser == 1) {
                let resp1 = await request.uri('user/socios/set_ghost').post({
                    socio_id:this.id,
                    isGhost:0
                })
                if(resp1.code() != 200) return;
                let resp2 = await request.uri('user/socios/set_diretor').post({
                    socio_id:this.id,
                    diretor:0
                })
                if(resp2.code() != 200){
                    this.typeUser = this.oldTypeUser
                }
                this.showAlertNow('Tipo de usuário alterado com sucesso', 'success')
            } else
            if(this.typeUser == 2){
                let resp3 = await request.uri('user/socios/set_diretor').post({
                    socio_id:this.id,
                    diretor:1
                })
                if(resp3.code() != 200){
                    this.typeUser = this.oldTypeUser
                }
                this.showAlertNow('Tipo de usuário alterado com sucesso', 'success')
            } else 
            if(this.typeUser == 3){
                let resp4 = await request.uri('user/socios/set_ghost').post({
                    socio_id:this.id,
                    isGhost:1
                })
                if(resp4.code() != 200){
                    this.typeUser = this.oldTypeUser
                }
                this.showAlertNow('Tipo de usuário alterado com sucesso', 'success')
            }
            
        },

        showAlertNow(message:string, type:string){
            this.showAlert = false 
            this.msg = message 
            this.type = type
            this.keyAlert++;
            this.showAlert = true
        },

    },

})

</script>