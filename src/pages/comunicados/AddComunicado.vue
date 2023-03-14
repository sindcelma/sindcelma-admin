<template>
    <div class="container-fluid bg-white">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <div v-if="image != ''">
                            <img :src="image" class="w-100 d-block mx-auto"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <h5>Adicionar imagem:</h5>
                        <UploadFile text="Fazer upload" dir="images/noticias" @onUploaded="uploaded"/>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="expire" class="form-label">Expira em:</label> 
                    <input v-model="expire" type="date" class="form-control" id="expire" placeholder="" style="max-width:200px;">
                </div> 
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título:</label> 
                    <input v-model="titulo" type="text" class="form-control" id="titulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="floatingTextarea">Texto:</label>
                    <textarea style="min-height: 300px;" v-model="text" class="form-control" placeholder="" id="floatingTextarea"></textarea>
                </div>
                <div class="mb-3">
                    <button class="btn btn-success" type="button" @click="salvar">salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue"
import UploadFile from "@/components/UploadFile.vue";
import request from "@/libs/request";
</script>

<script lang="ts">
export default defineComponent({

    components:{UploadFile},

    data() {
        return {
            image:'',
            expire:'',
            titulo:'',
            text:''
        }
    },
    methods: {

        async uploaded(imagem:string){
            this.image = imagem
        },

        async salvar(){
            
            let req = await request.uri('comunicados/add').post({
                image:this.image,
                expire:this.expire,
                titulo:this.titulo,
                texto:this.text
            })

            if(req.code() == 200){
                this.$emit('addComunicado')
            } else {
                this.$emit('error', req.message())
            }

        }

    },
})
</script>