<template>
    
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed;"/>
    </div>
    <div class="container" v-show="!isLoading">
        <div class="row pt-5">
            <div class="col-12">
                <span>Status:</span>
                <div v-if="status == 0">
                    <h5 class="text-warning">rascunho</h5>
                </div>
                <div v-if="status == 1">
                    <h5 class="text-success">ATIVO</h5>
                </div>
                <div v-if="status == 2">
                    <h5 class="text-info">FINALIZADO</h5>
                </div>
                
            </div>
            <div class="col-12 py-2">
                <div class="mb-3">
                    <label class="form-label">Título</label>
                    <input v-model="titulo" type="text" class="form-control" placeholder="ex.: Sorteio da Festa Junina" :readonly="status > 0">
                    <div v-if="error[0]">
                        <small class="text-danger">{{ errorMsg[0] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-12 py-2">
                <div class="mb-3">
                    <label class="form-label">Prêmios</label>
                    <input v-model="premios" type="text" class="form-control" placeholder="ex.: R$ 500 reais para cada vencedor" :readonly="status > 0">
                    <div v-if="error[1]">
                        <small class="text-danger">{{ errorMsg[1] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Quantidade de vencedores</label>
                    <input v-model="qtvencedores" type="number" class="form-control" placeholder="0" :readonly="status > 0">
                    <div v-if="error[2]">
                        <small class="text-danger">{{ errorMsg[2] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Data do Sorteio</label>
                    <input v-model="datasorteio" type="date" class="form-control" placeholder="Data do Sorteio" :readonly="status > 0">
                    <div v-if="error[3]">
                        <small class="text-danger">{{ errorMsg[3] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-4 py-2">
                <div class="mb-3">
                    <label class="form-label">Data máxima para inscrição</label>
                    <input v-model="datainscr" type="date" class="form-control" placeholder="Data máxima para inscrição" :readonly="status > 0">
                    <div v-if="error[4]">
                        <small class="text-danger">{{ errorMsg[4] }}</small>
                    </div>
                </div>
            </div>
            <div class="col-12"  v-if="status == 0">
                <button type="button" @click="salvar" class="btn btn-success">salvar alterações</button>
            </div>
            <hr class="my-4">
            <h5>Ações:</h5>
            <div class="col-12 mt-5">
                
            </div>
            <div class="col-4" v-if="status == 0">
                <button class="btn btn-danger">Excluir</button>
            </div>
            <div class="col-4" v-if="status == 0">
                <button type="button" @click="change_status(1)" class="btn btn-success">ATIVAR</button>
            </div>
            <div class="col-4" v-if="status == 1 && vencedores.length == 0">
                <button type="button" @click="change_status(0)" class="btn btn-danger">Cancelar</button>
            </div>
            <div class="col-4" v-if="status == 1 && vencedores.length == 0 && (new Date()).getTime() >= new Date(datasorteio).getTime()">
                <button type="button" @click="sortear()" class="btn btn-info">SORTEAR</button>
            </div>
            <div class="col-4" v-if="status == 1 && vencedores.length > 0">
                <button type="button" @click="change_status(2)" class="btn btn-success">finalizar</button>
            </div>
            <div class="col-12 mt-5">
            </div>
            <hr class="my-4">
            <h5>Vencedores:</h5>
            <div class="col-12">
                <div class="row">
                    <div class="col-12" v-for="vencedor in vencedores" :key="vencedor">
                        <h1>{{ vencedor.nome +' '+ vencedores.sobrenome }} <button @click="verVencedor(vencedor.socio_id)" type="button" class="btn btn-info">+</button></h1>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-5">
            </div>
        </div>
    </div> 
    <div class="container" v-show="isLoading">
        <LoadingView/>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import router from '@/router'
import request from '@/libs/request';
import LoadingView from '@/components/LoadingView.vue';
import { defineComponent } from 'vue';
import Alert from "@/components/Alert.vue";
</script>

<script lang="ts">
export default defineComponent({
    
    components: { LoadingView, Alert },

    created(){
        const rout = useRoute()
        this.id = Number(rout.params.id)
        this.getData()
        this.getVencedores()
    },

    data() {
        return {
            vencedores:[],
            isLoading:true,
            status:0,
            titulo: "",
            premios:"",
            qtvencedores:0,
            datasorteio:"",
            datainscr:"",
            error:[false,false,false,false,false],
            errorMsg:['', '', '', '', '', ''],
            id:0,
            type:'',
            showAlert:false,
            msg:'',
            keyAlert:0
        }
    },

    methods: {

        async getVencedores(){

            let res = await request
            .uri('sorteios/'+this.id+'/vencedores')
            .get()

            if(res.code() != 200) return;

            this.vencedores = res.message()
        },

        async getData(){
            let res = await request
            .uri('sorteios/'+this.id)
            .get()

            if(res.code() == 404){
                // not found widget
                return;
            }

            let sorteio = res.message()[0]

            console.log(sorteio);
            

            this.status = sorteio['ativo']
            this.titulo = sorteio['titulo']
            this.premios = sorteio['premios']
            this.datainscr = sorteio['data_insc']
            this.qtvencedores = sorteio['qt_vencedores']
            this.datasorteio = sorteio['data_br']

            this.isLoading = false 
            
        },

        showAlertNow(message:string, type:string){
            this.showAlert = false 
            this.msg = message 
            this.type = type
            this.keyAlert++;
            this.showAlert = true
        },

        async verVencedor(id:number){
            router.push({ path: '/socios/'+id })
        },

        async change_status(status:number){

            let res = await request
            .uri('sorteios/change_status')
            .post({
                status: status,
                sorteio_id: this.id
            })

            if(res.code() != 200){
                this.showAlertNow(res.message(), 'danger')
            } else {
                this.status = status
            }

        },

        async sortear(){

            this.isLoading = true

            let res = await request
            .uri('sorteios/sortear')
            .post({
                sorteio_id: this.id
            })

            this.isLoading = false

            if(res.code() != 200){
                this.showAlertNow(res.message(), 'danger')
                return
            }

            this.vencedores = res.message()
        

        },

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
            .uri('sorteios/update')
            .post({
                titulo:  this.titulo,
                premios: this.premios,
                qt_venc: this.qtvencedores,
                data_so: data_sort,
                data_in: data_insc,
                soteio_id: this.id
            })

            if(res.code() == 200){
                this.showAlertNow('Dados alterados com sucesso', 'success')
            } else {
                this.showAlertNow(res.message(), 'danger')
            }

        }

    },

})
</script>