<template>
    <div class="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
        <div class="flex flex-col items-center gap-2">
            <h1 class="text-6xl font-bold text-blue-54">404</h1>
            <p class="text-2xl font-semibold text-black-100">Pagina niet gevonden</p>
        </div>

        <p class="text-black-60 max-w-md">
            Sorry, we kunnen de pagina die je zoekt niet vinden. Misschien is deze verplaatst of verwijderd.
        </p>

        <div class="flex flex-col gap-3">
            <RouterLink to="/" class="px-6 py-3 bg-blue-54 text-white rounded-md hover:bg-blue-42 transition-colors">
                Terug naar home
            </RouterLink>

            <button @click="goBack" class="px-6 py-3 border border-blue-54 text-blue-54 rounded-md hover:bg-blue-6 transition-colors">
                Ga terug
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => router.go(-1);
</script>