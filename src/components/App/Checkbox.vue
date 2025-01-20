<template>
    <div class="flex items-center gap-2">
        <input type="checkbox" class="hidden" id="checkbox">
        <label for="checkbox" class="flex items-center gap-1" @click="func_toggleChecked">
            <div class="w-[12px] h-[12px] border border-blue-54 bg-white rounded-[4px] overflow-hidden">
                <div :class="{ 'translate-y-0': blnChecked, 'translate-y-3': !blnChecked }" class="transition">
                    <AppIcon :name="blnChecked ? 'Check' : ''" :size="10" />
                </div>
            </div>
            <span class="ml-2 text-xs">{{ title }}</span>
            <a :href="url" target="_blank" v-if="url" class="text-blue-54 underline text-xs">{{ titleUrl }}</a>
        </label>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppIcon from '@/components/App/Icon.vue'

const props = defineProps({
    checked: {
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

const blnChecked = ref(props.checked)

const func_toggleChecked = () => {
    blnChecked.value = !blnChecked.value
}

defineExpose({
    blnChecked
})
</script>