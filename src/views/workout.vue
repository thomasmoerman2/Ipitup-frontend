<template>
  <div>
    <div class="mb-10 flex gap-2">
      <AppFilters icon="Filter" text="Filter" />
      <AppFilters version="dark" icon="X" text="Pushups" />
      <AppFilters version="dark" icon="X" text="Level 1" />
    </div>

    <div></div>

    <div class="flex flex-col gap-3">
      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />

      <WorkoutExercise img="https://picsum.photos/100" title="dips" level="1" time="10" />

      <WorkoutExercise img="https://picsum.photos/100" title="pullups" level="1" time="10" />

      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />

      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="1" time="10" />
    </div>

  </div>
</template>
<script setup>
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppFilters from "@/components/App/Filters.vue";
</script>
