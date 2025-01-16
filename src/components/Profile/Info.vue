<template>
    <div class="flex flex-col gap-4 items-center">
        <AppIcon :name="props.icon" :size="24" color="text-blue-54" />
        <p class="text-xs font-bold">{{ text }}</p>
        <p class="text-xs">{{ amount }}</p>
    </div>
</template>

<script setup>
import AppIcon from "@/components/App/Icon.vue";

const props = defineProps
    ({
        icon: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
    });
</script>