<template>
    <div class="flex flex-wrap justify-center w-full bg-blue-6 text-xs rounded-md p-1 gap-1.5">
        <label v-for="option in props.options" :key="option.value" :for="generateId(option.value)" class="flex flex-1 items-center gap-2 px-3 option" :class="{ 'selected': chosenOption === option.value }" @click="func_chooseOption(option.value)">
            <input type="radio" :checked="chosenOption === option.value" class="hidden" :value="option.value" :id="generateId(option.value)">
            {{ option.text }}
        </label>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['chooseOption', 'update:modelValue', 'change'])
const props = defineProps({
    options: {
        type: Array,
        required: true,
        validator: (value) => {
            return value.every(option =>
                typeof option === 'object' &&
                'text' in option &&
                'value' in option
            )
        }
    },
    modelValue: {
        type: String,
        default: ''
    }
})

const generateId = (value) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `option_${timestamp}_${value}_${random}`;
};

const chosenOption = ref(props.modelValue || props.options[0]?.value)

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        chosenOption.value = newValue;
    }
});

const func_chooseOption = (value) => {
    chosenOption.value = value
    emit('chooseOption', value)
    emit('update:modelValue', value)
    emit('change', value)
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