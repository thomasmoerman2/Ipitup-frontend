<template>
  <div class="flex flex-col gap-6 w-full px-3">
    <h1 class="font-bold">Sorteren op</h1>

    <AppOptions
      :options="[
        { text: 'Globaal', value: 'globaal' },
        { text: 'Lokaal', value: 'lokaal' },
        { text: 'Volgend', value: 'volgend' },
      ]"
      v-model="selectedSort"
      @change="handleSortChange"
    />

    <AppButton text="Opslaan" @click="func_closeDialog" version="1" icon="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '@/components/App/Button.vue';
import AppOptions from '@/components/App/Options.vue';

const emit = defineEmits(['closeDialog']);

const selectedSort = ref('volgend');

const handleSortChange = (value) => {
  selectedSort.value = value;
};

const func_closeDialog = () => {
  emit('closeDialog');
};
</script>
