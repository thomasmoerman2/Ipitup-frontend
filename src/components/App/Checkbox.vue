<template>
    <div class="flex items-center gap-2">
        <input type="checkbox" class="hidden" :id="id" :checked="checked" v-model="checked" @change="handleChange">
        <label :for="id" class="flex items-center gap-1">
            <div class="w-[12px] h-[12px] border border-blue-54 bg-white rounded-[4px] overflow-hidden">
                <div :class="{ 'translate-y-0': checked, 'translate-y-3': !checked }" class="transition">
                    <AppIcon :name="checked ? 'Check' : ''" :size="10" />
                </div>
            </div>
            <span class="ml-2 text-xs">{{ title }}</span>
            <a :href="url" target="_blank" v-if="url" class="text-blue-54 underline text-xs">{{ titleUrl }}</a>
        </label>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppIcon from '@/components/App/Icon.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Checkbox'
    },
    url: {
        type: String,
        default: ''
    },
    titleUrl: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'change'])
const checked = ref(props.modelValue)

// Generate unique ID for the checkbox
const id = computed(() => `checkbox-${Math.random().toString(36).slice(2, 11)}`)

const handleChange = (event) => {
    emit('update:modelValue', event.target.checked)
    emit('change', event.target.checked)
}

defineExpose({
    checked
})
</script>