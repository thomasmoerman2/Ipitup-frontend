<template>
  <div class="container">
    <AppHeader title="Workout" />
    <div class="mt-10 mb-10 flex gap-2">
        <AppFilters type="filter"/>
        <AppFilters type="optie" optie="Pushups"/>
        <AppFilters type="optie" optie="Level 1"/>
    </div>

    <div></div>

    <div class="flex flex-col gap-3">
      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />
      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />

      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />

      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />

      <WorkoutExercise
        img="https://picsum.photos/100"
        title="pushups"
        level="beginner"
        time="10"
      />
    </div>
    <AppNavigation />
  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppHeader from "@/components/App/Header.vue";
import AppNavigation from "@/components/App/Navigation.vue";
import AppFilters from "@/components/App/Filters.vue";
</script>
