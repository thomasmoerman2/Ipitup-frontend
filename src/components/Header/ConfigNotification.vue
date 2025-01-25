<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-full opacity-0">
        <div v-if="message" class="fixed top-0 left-0 right-0 bg-blue-54 text-white py-2 px-4 text-center z-[70]">
            <div class="container mx-auto flex items-center justify-center gap-2">
                <span> {{ message }} </span>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { Transition } from 'vue';

const props = defineProps({
    message: {
        type: String,
        default: null
    }
});
</script>

<style scoped>
.transform {
    transform-origin: top;
}
</style>