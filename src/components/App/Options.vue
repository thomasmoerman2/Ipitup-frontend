<template>
    <div class="flex justify-center w-full bg-blue-6 text-xs rounded-md p-1 gap-1.5">
        <label v-for="option in options" class="flex items-center gap-2 option" :class="{ 'selected': chosenOption === option }" @click="func_chooseOption(option)" :for="option">
            <input type="radio" :checked="chosenOption === option" class="hidden" :value="option" :id="option">
            {{ option }}
        </label>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['chooseOption', 'update:modelValue', 'change'])
const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    modelValue: {
        type: String,
        default: ''
    }
})

const chosenOption = ref(props.modelValue || props.options[0])

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        chosenOption.value = newValue;
    }
});

const func_chooseOption = (option) => {
    chosenOption.value = option
    emit('chooseOption', option)
    emit('update:modelValue', option)
    emit('change', option)
}

defineExpose({
    chosenOption
})
</script>

<style scoped lang="postcss">
.selected {
    @apply bg-blue-54 text-white;
}

.option {
    @apply py-1.5 rounded-md w-full flex justify-center items-center;
}
</style>