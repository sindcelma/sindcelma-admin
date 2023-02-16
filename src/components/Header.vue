<template>
    <nav class="navbar navbar-expand-sm bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img :src="img" style="width: 80px" />
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/home" class="nav-link">home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/socios" class="nav-link">socios</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/sorteios" class="nav-link">sorteios</router-link>
                    </li>
                    <!--
                    <li class="nav-item">
                        <router-link to="/cct" class="nav-link">cct</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/estatisticas" class="nav-link">estatísticas</router-link>
                    </li>
                    -->
                </ul>
            </div>
        </div>
    </nav>
    <div class="container-fluid">
            <div class="row border-bottom">
                <div class="col-2">
                    <h5 class="p-1"><img :src="icon" alt="" style="width:25px;"> {{route.name}}</h5>
                </div>
                <div class="col-auto">
                    <ul class="nav mx-auto">
                        <li class="nav-item" v-for="item in submenus.getSubmenu(route.path)">
                            <router-link class="nav-link" :to="item.link" aria-current="page">{{ item.nome }}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Config from '@/libs/config';
import { useRoute } from 'vue-router';
import submenus from '@/router/submenus'

export default defineComponent({
    name:'HeaderVue',
    created(){
        this.setIcon(useRoute().path)
    },

    data() {
        return {
            img:Config.file('images/logo_no_bg.png'),
            route:useRoute(),
            icon:'',
            submenus:submenus
        }
    },

    methods: {
        setIcon(path:string){
            const pathArr = path.split('/')
            const icon = pathArr[1]
            this.icon = Config.file(`images/icons/${icon}_green.png`)
        },
    },

    watch:{
        "route.path": {
            handler(nv){
                this.setIcon(nv)
            }
        }
    }
})
</script>