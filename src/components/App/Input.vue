<template>
    <label :for="inputId" class="flex flex-col gap-1">
        <span class="text-xs">{{ props.label }}</span>
        <div class="items-center relative flex gap-2 border border-black-40 rounded-md px-2.5 py-3">
            <AppIcon :name="props.icon" color="text-black-40" />
            <input :type="inputType" class="border-none w-full outline-none" :placeholder="props.placeholder" v-model="inputValue" :id="inputId" @input="func_input" @change="func_change" />
            <button v-if="props.type === 'password'" type="button" class="absolute right-2 top-1/2 -translate-y-1/2" @click="func_showPassword">
                <AppIcon :name="showPassword ? 'eyeOff' : 'eye'" color="text-black-100" />
            </button>
        </div>
    </label>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AppIcon from '@/components/App/Icon.vue';

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

const emit = defineEmits(['input', 'change', 'update:value']);

const showPassword = ref(false);
const inputValue = ref(props.value);
const inputId = ref(`input_${Date.now()}_${Math.random()}`);

// Watch for external value changes
watch(() => props.value, (newValue) => {
    inputValue.value = newValue;
});

const inputType = computed(() => {
    if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});

const func_showPassword = () => {
    showPassword.value = !showPassword.value;
};

const func_input = (event) => {
    const newValue = event.target.value;
    inputValue.value = newValue;
    emit('input', newValue);
    emit('update:value', newValue); // For v-model support
};

const func_change = (event) => {
    const newValue = event.target.value;
    inputValue.value = newValue;
    emit('change', newValue);
    emit('update:value', newValue); // For v-model support
};
</script>
