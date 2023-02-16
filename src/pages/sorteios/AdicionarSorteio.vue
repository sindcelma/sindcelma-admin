<template>
    <div class="container">
        <div class="row pt-5">
            <div class="col-12 py-2">
                <div class="mb-3">
                    <label class="form-label">Título</label>
                    <input v-model="titulo" type="text" class="form-control" placeholder="ex.: Sorteio da Festa Junina">
                    <div v-if="error[0]">
                        <small class="text-danger">{{ errorMsg[0] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-12 py-2">
                <div class="mb-3">
                    <label class="form-label">Prêmios</label>
                    <input v-model="premios" type="text" class="form-control" placeholder="ex.: R$ 500 reais para cada vencedor">
                    <div v-if="error[1]">
                        <small class="text-danger">{{ errorMsg[1] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Quantidade de vencedores</label>
                    <input v-model="qtvencedores" type="number" class="form-control" placeholder="0">
                    <div v-if="error[2]">
                        <small class="text-danger">{{ errorMsg[2] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Data do Sorteio</label>
                    <input v-model="datasorteio" type="date" class="form-control" placeholder="Data do Sorteio">
                    <div v-if="error[3]">
                        <small class="text-danger">{{ errorMsg[3] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Data máxima para inscrição</label>
                    <input v-model="datainscr" type="date" class="form-control" placeholder="Data máxima para inscrição">
                    <div v-if="error[4]">
                        <small class="text-danger">{{ errorMsg[4] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button type="button" @click="salvar" class="btn btn-success">salvar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
import request from '@/libs/request';
import { defineComponent } from 'vue';
</script>

<script lang="ts">
export default defineComponent({
    
    data() {
        return {
            titulo: "",
            premios:"",
            qtvencedores:0,
            datasorteio:"",
            datainscr:"",
            error:[false,false,false,false,false],
            errorMsg:['', '', '', '', '', '']
        }
    },

    methods: {
        async salvar(){
            
            let status = true
            
            if(this.titulo.trim() == ""){
                this.error[0] = true
                this.errorMsg[0] = 'Este campo não pode estar vazio'
                status = false
            } else {
                this.error[0] = false
                this.errorMsg[0] = ''
            }

            if(this.premios.trim() == ""){
                this.error[1] = true
                this.errorMsg[1] = 'Este campo não pode estar vazio'
                status = false
            } else {
                this.error[1] = false
                this.errorMsg[1] = ''
            }

            if(this.qtvencedores < 1){
                this.error[2] = true
                this.errorMsg[2] = 'A quantidade tem que ser maior que 0'
                status = false
            } else {
                this.error[2] = false
                this.errorMsg[2] = ''
            }

            if(this.datasorteio.trim() == ""){
                this.error[3] = true
                this.errorMsg[3] = 'Este campo não pode estar vazio'
                status = false
            } else {
                this.error[3] = false
                this.errorMsg[3] = ''
            }

            if(this.datainscr.trim() == ""){
                this.error[4] = true
                this.errorMsg[4] = 'Este campo não pode estar vazio'
                status = false
            } else {
                this.error[4] = false
                this.errorMsg[4] = ''
            }

            if(!status) return;

            let data_insc = this.datainscr+' 23:59:59'
            let data_sort = this.datasorteio+' 23:59:59'

            let res = await request
            .uri('sorteios/add')
            .post({
                titulo:  this.titulo,
                premios: this.premios,
                qt_venc: this.qtvencedores,
                data_so: data_sort,
                data_in: data_insc
            })

            if(res.code() == 200){
                router.push('/sorteios')
            }

        }
    },

})
</script>