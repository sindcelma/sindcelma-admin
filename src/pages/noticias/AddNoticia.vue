<template>
    <div class="container-fluid bg-white">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <div v-if="imagem != ''">
                            <img :src="imagem" class="w-100 d-block mx-auto"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <h5>Adicionar imagem:</h5>
                        <UploadFile text="Fazer upload" dir="images/noticias" @onUploaded="uploaded"/>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título:</label> 
                    <input v-model="titulo" type="text" class="form-control" id="titulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="subtitulo" class="form-label">Subtitulo:</label> 
                    <input v-model="subtitulo" type="text" class="form-control" id="subtitulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="floatingTextarea">Texto:</label>
                    <textarea style="min-height: 300px;" v-model="texto" class="form-control" placeholder="" id="floatingTextarea"></textarea>
                </div>
                <div class="mb-3">
                    <button class="btn btn-success" type="button" @click="salvar">salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';
</script>

<script lang="ts">
export default defineComponent({
    components:{UploadFile},
    data() {
        return {
            imagem:'',
            titulo:'',
            subtitulo:'',
            texto:''
        }
    },

    methods: {
        async salvar(){
            let req = await request.uri('noticias/add')
            .post({
                titulo:this.titulo,
                imagem:this.imagem,
                subtitulo:this.subtitulo,
                text:this.texto,
            })
            
            if(req.code() == 200){
                this.$emit('addNoticia', {
                    id: req.message().id,
                    titulo:this.titulo,
                    imagem:this.imagem,
                    subtitulo:this.subtitulo
                })
            } else {
                // erro
            }
        },

        uploaded(imagem:string){
            this.imagem = imagem
        }
    },
})
</script>