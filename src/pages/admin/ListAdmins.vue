<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed; z-index:99999999;"/>
    </div>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showForm">
        <button @click="hideForm" type="button" class="btn-close p-2 m-2 rounded bg-danger" aria-label="Close" style="float:right; color:white"></button>
        <component 
            :is="component" 
            :permissionsList="allPermissions" 
            :adminSel="adminSel"
            @addAdmin="onAddAdmin" 
            @deleteAdmin="onDeleteAdmin" 
            @changePermissions="onChangeAdmin"
            @error="onError"
        />
    </div>
    <div class="container-fluid">

        <div class="row">

            <div class="col-12 py-2" v-if="allPermissions.length > 0">
                <button type="button" @click="newAdmin" class="btn btn-info">Novo Admin</button>
            </div>

            <div class="col-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nome</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Permissões</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="adm, key in admins" :key="key">
                            <th scope="row">{{ adm.id }}</th>
                            <td>{{ adm.nome }}</td>
                            <td>{{ adm.email }}</td>
                            <td>{{ adm.permissions.map(x => x.nome).join(', ') }}</td>
                            <td><button @click="openAdmin(key)" class="btn btn-sm btn-success">+</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { defineComponent } from 'vue'
import request from '@/libs/request'
import AddAdmin from './AddAdmin.vue'
import EditAdmin from './EditAdmin.vue'
import Alert from '@/components/Alert.vue'

</script>

<script lang="ts">

interface PermissionI {
    id:number,
    slug:string,
    nome:string
}

interface AdminI {
    id:number,
    nome:string,
    email:string,
    permissions:PermissionI[],
}

interface data {
    admins:AdminI[],
    adminSel:AdminI | null,
    showAlert:boolean,
    showForm:boolean,
    msg:string,
    type:string,
    keyAlert:number,
    component:string,
    allPermissions:PermissionI[],
    atualKey:number
}

export default defineComponent({

    components:{
        AddAdmin, EditAdmin
    },

    async created(){

        await this.list()

        let resp2 = await request
        .uri('user/admin/permissions')
        .post({})

        if(resp2.code() == 200){
            this.allPermissions = resp2.message()
        }
    },

    data():data {
        return {
            showAlert:false,
            showForm:false,
            admins:[],
            adminSel:null,
            msg:'',
            type:'',
            keyAlert:1,
            component:'AddAdmin',
            allPermissions:[],
            atualKey:-1
        }
    },

    methods: {
        
        async list(){

            let resp1 = await request
            .uri('user/admin/list')
            .post({})

            if(resp1.code() == 200){
                this.admins = resp1.message()
            }
        },  

        showMessage(message:string, type:string){
            this.msg  = message
            this.type = type
            this.keyAlert++
            this.showAlert = true
        },

        onError(message:string){
            this.showMessage(message, 'danger')
        },

        onDeleteAdmin(){
            this.list()
            this.showMessage('Admin deletado com sucesso!', 'success')
            this.hideForm()
        },

        onAddAdmin(admin:AdminI){
            this.admins.push(admin)
            this.showMessage('Admin criado com sucesso!', 'success')
            this.hideForm()
        },

        onChangeAdmin(){
            this.showMessage('Admin alterado com sucesso!', 'success')
        },

        hideForm(){
            this.showForm = false
        },
        
        newAdmin(){
            this.component = 'AddAdmin'
            this.showForm  = true
        },

        openAdmin(key:number){
            this.atualKey  = key
            this.adminSel  = this.admins[key]
            this.component = 'EditAdmin'
            this.showForm  = true
        },
        
    },
})

</script> 