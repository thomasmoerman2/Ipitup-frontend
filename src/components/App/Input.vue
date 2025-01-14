<template>
    <label :for="props.id" class="flex flex-col gap-1">
        <span class="text-xs">{{ props.label }}</span>
        <div class="relative flex gap-2 border border-black-40 rounded-md px-2.5 py-3">
            <AppIcon :name="props.icon" color="text-black-40" />
            <input :type="type" class="border-none w-full outline-none" :placeholder="props.placeholder" :value="value" @input="func_input" :id="props.id" @change="func_change" />
            <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <AppIcon name="eyeOff" v-if="props.type === 'password' && showPassword" @click="func_showPassword"  />
                <AppIcon name="eye" v-else-if="props.type === 'password' && !showPassword" @click="func_showPassword" />
            </div>
        </div>
    </label>
</template>

<script setup>
import AppIcon from '@/components/App/Icon.vue';
import { ref } from 'vue';


const props = defineProps({
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Placeholder'
    },
    value: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: 'input',
        required: true
    }
})

const showPassword = ref(false)
const type = ref(props.type)
const value = ref(props.value)

const func_showPassword = () => {
    showPassword.value = !showPassword.value

    if (showPassword.value) {
        type.value = 'text'
    } else {
        type.value = 'password'
    }
}

const func_change = (event) => {
    value.value = event.target.value
}

const emit = defineEmits(['input'])

const func_input = (event) => {
    emit('input', value.value)
}
</script>
