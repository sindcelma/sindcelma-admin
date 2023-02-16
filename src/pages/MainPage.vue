import { defineComponent } from 'vue';
<template>
    <HeaderVue />
    <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderVue from '@/components/Header.vue'

export default defineComponent({
    components: { HeaderVue },
})

</script>