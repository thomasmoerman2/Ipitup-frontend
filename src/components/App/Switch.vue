<template>
    <label class="flex items-center gap-2 cursor-pointer" :for="id">
        <input type="checkbox" class="hidden" :checked="modelValue" @change="func_change" :id="id">
        <div class="relative w-[52px] h-[28px] rounded-full transition-all duration-300 ease-in-out border border-blue-24" :class="{
            'bg-blue-54': modelValue,
            'bg-blue-6': !modelValue
        }">
            <div class="absolute top-[2px] w-[22px] h-[22px] rounded-full transition-all duration-300 ease-in-out border border-blue-24" :class="{
                'translate-x-[26px] bg-white': modelValue,
                'translate-x-[2px] bg-blue-54': !modelValue
            }"></div>
        </div>
        <slot></slot>
    </label>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: 'switch'
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const func_change = (event) => {
    emit('update:modelValue', event.target.checked);
    emit('change', event.target.checked);
}
</script>