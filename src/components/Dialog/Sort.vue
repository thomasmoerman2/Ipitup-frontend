<template>
  <div class="flex flex-col gap-6 w-full px-3">
    <h1 class="font-bold">Sorteren op</h1>

    <AppOptions
      :options="[
        { text: 'Globaal', value: 'globaal' },
        { text: 'Lokaal', value: 'lokaal' },
        { text: 'Volgend', value: 'volgend' },
      ]"
      v-model="localSelectedSort"
      @change="handleSortChange"
    />

    <AppButton text="Opslaan" @click="func_closeDialog" version="1" icon="false" />
  </div>
</template>



<script setup>
import { ref, watch } from 'vue';
import AppButton from '@/components/App/Button.vue';
import AppOptions from '@/components/App/Options.vue';

const props = defineProps({
  currentSort: {
    type: String,
    default: 'globaal',
  }
});

const emit = defineEmits(['closeDialog', 'updateSort']);

// Maak een lokale kopie van de sorteerwaarde
const localSelectedSort = ref(props.currentSort);

// Zorg ervoor dat de waarde correct wordt gesynchroniseerd
watch(() => props.currentSort, (newValue) => {
  localSelectedSort.value = newValue;
}, { immediate: true }); // immediate zorgt ervoor dat de watch direct bij aanmaken wordt uitgevoerd

const handleSortChange = (value) => {
  localSelectedSort.value = value;
};

const func_closeDialog = () => {
  emit('updateSort', localSelectedSort.value);
  emit('closeDialog');
};
</script>
