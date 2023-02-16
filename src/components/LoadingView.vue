<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 p-5">
                <img :src="img" class="d-block mx-auto" style="width: 100px;" alt="">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import Config from '../libs/config';

export default defineComponent({
    data() {
        return {
            img:Config.file('images/loading.gif')
        }
    },
})
</script>