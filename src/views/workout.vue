<template>
  <div>
    <div class="mt-10 mb-10 flex gap-2">
      <AppFilters type="filter" />
      <AppFilters type="optie" optie="Pushups" />
      <AppFilters type="optie" optie="Level 1" />
    </div>

    <div></div>

    <div class="flex flex-col gap-3">
      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" url="pushups" />
      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" url="pushups" />

      <WorkoutExercise img="https://picsum.photos/100" title="pullups" level="beginner" time="10" url="pullups" />

      <WorkoutExercise img="https://picsum.photos/100" title="dips" level="beginner" time="10" url="dips" />

      <WorkoutExercise img="https://picsum.photos/100" title="squats" level="beginner" time="10" url="squats" />
    </div>

  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppFilters from "@/components/App/Filters.vue";
</script>
