<template>
    <div class="flex flex-col gap-24 container">
        <div class="flex flex-col gap-10">
            <h1 class="capitalize underline font-caveat">header</h1>
            <AppHeader />
        </div>
        <div class="flex flex-col gap-10">
            <h1 class="capitalize underline font-caveat">button</h1>
            <AppButton text="Button" version="primary" />
            <AppButton text="Button" version="secondary" />
            <AppButton text="Button" version="tertiary" />
            <AppButton text="Button" version="outline" />
        </div>
        <div class="flex flex-col gap-10">
            <h1 class="capitalize underline font-caveat">navigation</h1>
            <AppNavigation />
        </div>
        <div class="flex flex-col gap-10">
            <h1 class="capitalize underline font-caveat">workout exercise</h1>
            <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
        </div>

        <div class="flex flex-col gap-10">
            <h1 class="capitalize underline font-caveat">workout</h1>
            xxxx
        </div>
    </div>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import AppHeader from '@/components/AppHeader.vue'
import AppNavigation from '@/components/AppNavigation.vue';
import WorkoutExercise from '@/components/WorkoutExercise.vue';
</script>