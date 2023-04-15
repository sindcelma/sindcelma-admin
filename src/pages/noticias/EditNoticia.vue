<template>
    <div class="container-fluid bg-white py-3">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <img :src="imagem" class="w-100 d-block mx-auto"/>
                    </div>
                    <div class="col-6">
                        <h5>Editar imagem:</h5>
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
                    <button class="btn btn-success" type="button" @click="salvarEdicao">salvar alterações</button>
                </div>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <div class="mb-3">
                    <button class="btn btn-danger" type="button" @click="deletar">deletar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineProps } from 'vue';
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';
defineProps({
    noticiaSel: {
        type:Object as () => Noticia,
        required:true
    }
})
</script>

<script lang="ts">

interface Noticia {
    id:number,
    titulo:string,
    imagem:string,
    subtitulo:string
}

export default defineComponent({

    created(){
        this.getText()
    },

    components:{UploadFile},

    data() {
        return {
            noticia: this.noticiaSel,
            id:this.noticiaSel.id,
            titulo: this.noticiaSel.titulo,
            imagem:this.noticiaSel.imagem,
            subtitulo:this.noticiaSel.subtitulo,
            texto:''
        }
    },

    methods: {

        async getText(){
            let req = await request.uri('noticias/get/'+this.id).get()
            this.texto = req.message()[0].text
        },

        async uploaded(imagem:string){
            this.imagem = imagem
        },

        async salvarEdicao(){

            let req = await request.uri('noticias/edit')
            .post({
                id: this.id,
                titulo: this.titulo,
                imagem: this.imagem,
                subtitulo: this.subtitulo,
                text: this.texto
            })

            if(req.code() == 200){
                this.noticia.titulo = this.titulo
                this.noticia.imagem = this.imagem
                this.noticia.subtitulo = this.subtitulo
                this.$emit('changeNoticia')
            }

        },

        async deletar(){
            
            let req = await request.uri('noticias/delete')
            .post({
                id: this.id
            })
            
            if(req.code() == 200){
                this.$emit('deleteNoticia')
            }

        }

    },
})
</script>