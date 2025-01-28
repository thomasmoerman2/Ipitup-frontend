<template>
    <Filter stroke-width="2.5" size="32" />
    <h1 class="font-bold">Filter</h1>
    <n-config-provider :theme-overrides="themeOverrides" class="w-full">
        <n-space vertical>
            <n-slider v-model:value="value" range :step="1" />
        </n-space>
    </n-config-provider>
    <AppButton text="Opslaan" @click="func_closeDialog" version="1" icon="false" />
</template>

<script setup>
import AppButton from '@/components/App/Button.vue';
import { Filter } from 'lucide-vue-next';
import { NSlider, NSpace, NConfigProvider } from 'naive-ui';
import { ref } from 'vue';
const emit = defineEmits(['closeDialog'])

const value = ref([50, 70])

const func_closeDialog = () => {
    emit('closeDialog')
}


const themeOverrides = {
    common: {
        primaryColor: '#35babf'
    },
}
</script>