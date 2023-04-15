<template>
    <div class="container-fluid p-2 bg-white">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <h5>Adicionar imagem:</h5>
                        <UploadFile text="Fazer upload" dir="images/convenios" @onUploaded="uploaded"/>
                    </div>
                    <div class="col-6">
                        <img :src="imagem" class="w-100 d-block mx-auto"/>
                    </div>
                   
                </div>
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título:</label> 
                    <input v-model="titulo" type="text" class="form-control" id="titulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="floatingTextarea">Descrição:</label>
                    <textarea style="min-height: 200px;" v-model="descr" class="form-control" placeholder="" id="floatingTextarea"></textarea>
                </div>
                <div class="mb-3">
                    <button class="btn btn-success" type="button" @click="salvar">salvar alterações</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';
import { defineComponent } from 'vue';
</script>

<script lang="ts">
export default defineComponent({
    componenst:{UploadFile},
    data() {
        return {
            imagem:'',
            titulo:'',
            descr:''
        }
    },

    methods: {
        async salvar(){

            if(this.imagem.trim() == "" ||
               this.titulo.trim() == "" ||
               this.descr.trim()  == ""
            ){
                // erro ao tentar salvar
                this.$emit('error', 'Existem campos vazios')
                return;
            }

            let res = await request.uri('convenios/add').post({
                titulo: this.titulo,
                imagem: this.imagem,
                descricao: this.descr,
            })

            console.log(res.message());
            

            if(res.code() == 200){

                let response = res.message()
                let convenio:{
                    id:number,
                    titulo:string,
                    imagem:string,
                } = {
                    id:response.id,
                    titulo:this.titulo,
                    imagem:this.imagem
                }
                
                this.$emit('addConvenio', convenio)
            }

        },

        async uploaded(imagem:string){
            this.imagem = imagem
        }

    },
})
</script>