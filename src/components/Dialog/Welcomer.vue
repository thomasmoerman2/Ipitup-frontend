<template>
    <div class="flex flex-col items-center p-6 max-w-md mx-auto text-center gap-6">
        <!-- Logo -->
        <div class="flex justify-center items-center text-teal-500">
            <AppIcon name="Atom" size="80" />
        </div>

        <!-- Heading -->
        <h1 class="text-2xl font-bold text-gray-800">Maak een account aan!</h1>

        <!-- Main text -->
        <p class="text-gray-600 leading-relaxed">
            Zet jouw avontuur voort met ons en <span class="text-orange-500">haal het beste uit jezelf!</span> Word lid van onze community en daag andere leden uit om de top te bereiken. Maak vandaag jou gratis een account aan en ontdek nieuwe mogelijkheden!
        </p>

        <!-- Secondary text -->
        <p class="text-gray-700 italic">
            Waarom twijfelen? Aan de hand van jou versleutelde gegevens ben jij de enigste die kan inloggen!
        </p>

        <!-- CTA Button -->
        <RouterLink to="/register" class="w-full py-4 px-6 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            Start met een account
        </RouterLink>
    </div>
</template>

<script setup>
import AppIcon from '@/components/App/Icon.vue';
import { RouterLink } from 'vue-router';
</script>