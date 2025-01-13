<template>
    <label v-for="(item, key) in props.items" :key="key" :for="`toggle-${key}`" class="flex items-center gap-2 w-max">
        <input type="checkbox" :id="`toggle-${key}`" class="hidden" v-model="toggleStates[key]" @change="emitChange(key)" />
        <span class="py-2 px-3 rounded-xl transition" :class="{
            'bg-blue-54 text-blue-6': toggleStates[key],
            'bg-blue-6 text-blue-84': !toggleStates[key]
        }">
            {{ item }}
        </span>
    </label>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        default: () => ['items', 'items', 'items']
    },
    modelValue: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:modelValue', 'change', 'selected-items']);

const toggleStates = ref([]);

const selectedItems = computed(() =>
    props.items.filter((_, i) => toggleStates.value[i])
);

onMounted(() => {
    toggleStates.value = props.modelValue.length ? [...props.modelValue] : props.items.map(() => false);
    emit('selected-items', selectedItems.value);
});

watch(() => props.modelValue, (newValue) => {
    if (newValue.length) {
        toggleStates.value = [...newValue];
        emit('selected-items', selectedItems.value);
    }
}, { deep: true });

const emitChange = (index) => {
    emit('update:modelValue', toggleStates.value);
    emit('change', {
        index,
        value: toggleStates.value[index],
        states: toggleStates.value,
        selectedItems: selectedItems.value
    });
    emit('selected-items', selectedItems.value);
};
</script>