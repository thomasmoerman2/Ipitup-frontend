<template>
    <div class="flex flex-col gap-10">
        <RouterLink to="/profile" class="flex items-center gap-1">
            <AppIcon name="ArrowLeft" size="24"/>
            <p class="font-medium text-[1.25rem]">Back</p>
        </RouterLink>

        <div class="flex flex-wrap justify-center gap-2.5 gap-y-5">
            <AppBadge  exercise="Pushup" amount="10" />
          <AppBadge exercise="Pushup" amount="25" />
          <AppBadge exercise="Pushup" amount="50" />
          <AppBadge state="false" exercise="Pushup" amount="100" />

          <AppBadge exercise="Squat" amount="100" />
          <AppBadge exercise="Squat" amount="200" />
          <AppBadge exercise="Squat" amount="500" />

          <AppBadge exercise="Pullup" amount="5" />
          <AppBadge exercise="Pullup" amount="10" />
          <AppBadge state="false" exercise="Pullup" amount="25" />
          <AppBadge state="false" exercise="Pullup" amount="50" />

          <AppBadge exercise="Situp" amount="50" />
          <AppBadge exercise="Situp" amount="100" />
          <AppBadge exercise="Situp" amount="200" />
        </div>
        

    </div>
</template>
<script setup>
import AppIcon from "@/components/App/Icon.vue";
import AppBadge from "@/components/App/Badge.vue";
</script>