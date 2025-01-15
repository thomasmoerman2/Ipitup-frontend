<template>
    <label :for="inputId" class="flex flex-col gap-1">
        <span class="text-xs">{{ props.label }}</span>
        <div class="relative flex items-center gap-2 border border-black-40 rounded-md px-2.5 py-3">
            <AppIcon :name="props.icon" color="text-black-40" />
            <input :type="showPassword ? 'text' : type" class="border-none w-full outline-none" :placeholder="props.placeholder" :value="value" @input="func_input" :id="inputId" @change="func_change" />
            <button v-if="type === 'password'" type="button" class="absolute right-2 top-1/2 -translate-y-1/2" @click="func_showPassword">
                <AppIcon :name="showPassword ? 'eyeOff' : 'eye'" color="text-black-100" />
            </button>
        </div>
    </label>
</template>

<script setup>
import AppIcon from '@/components/App/Icon.vue';
import { ref, onMounted } from 'vue';

const generateUniqueId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `input_${timestamp}_${random}`;
};

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
    }
});

const showPassword = ref(false);
const type = ref(props.type);
const value = ref(props.value);
const inputId = ref('');

onMounted(() => {
    inputId.value = generateUniqueId();
});

const func_showPassword = () => {
    showPassword.value = !showPassword.value;
};

const func_change = (event) => {
    value.value = event.target.value;
};

const emit = defineEmits(['input']);

const func_input = (event) => {
    emit('input', event.target.value);
};
</script>
