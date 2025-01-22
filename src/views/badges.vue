<template>
    <div class="flex flex-col gap-10">
      <RouterLink to="/profile" class="flex items-center gap-1">
        <AppIcon name="ArrowLeft" size="24" />
        <p class="font-medium text-[1.25rem]">Back</p>
      </RouterLink>
  
      <div class="flex justify-between font-bold">
        <div class="w-max text-center">
          <p>{{ obtainedBadgeCount }} / {{ totalBadgeCount }} behaald</p>
        </div>
        <div class="w-max flex items-center text-center">
          <p>Non-stop</p>
          <AppIcon name="Flame" color="text-blue-48" size="20" />
          <p>{{ dailyStreak }}</p>
        </div>
      </div>
  
      <div v-for="(badges, category) in groupedBadges" :key="category" class="flex flex-col gap-5">
        <!-- Categorie titel -->
        <h2 class="text-lg font-semibold text-center pb-1 pt-6">{{ category }}</h2>
        <div class="flex flex-wrap justify-center gap-2.5 gap-y-5">
          <AppBadge 
            v-for="badge in badges" 
            :key="badge.badgeId" 
            :exercise="badge.badgeName" 
            :amount="badge.badgeAmount" 
            :state="badge.obtained ? 'true' : 'false'" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import Cookies from 'js-cookie';
  import AppIcon from "@/components/App/Icon.vue";
  import AppBadge from "@/components/App/Badge.vue";
  
  // Reactieve variabelen
  const allBadges = ref([]);
  const dailyStreak = ref(0);
  
  // Functie om alle badges met gebruikersvoortgang op te halen
  const fetchAllBadgesWithUserProgress = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/badge/all/${userId}`);
      const data = await response.json();
  
      if (data && Array.isArray(data)) {
        allBadges.value = data;
        console.log("Fetched all badges with user progress:", allBadges.value);
      } else {
        console.warn("No badges found.");
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };
  
  // Functie om de daily streak op te halen
  const fetchUserDailyStreak = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/dailystreak/${userId}`);
      const data = await response.json();
  
      if (data && typeof data.dailyStreak === 'number') {
        dailyStreak.value = data.dailyStreak;
      } else {
        console.warn("Daily streak not found.");
      }
    } catch (error) {
      console.error("Error fetching daily streak:", error);
    }
  };
  
  // Computed property om badges te groeperen op categorie (bijv. Push-up, Sit-up, Squat)
  const groupedBadges = computed(() => {
    return allBadges.value.reduce((acc, badge) => {
      if (!acc[badge.badgeName]) {
        acc[badge.badgeName] = [];
      }
      acc[badge.badgeName].push(badge);
      return acc;
    }, {});
  });
  
  // Totaal aantal behaalde badges
  const obtainedBadgeCount = computed(() => {
    return allBadges.value.filter(badge => badge.obtained).length;
  });
  
  // Totaal aantal beschikbare badges
  const totalBadgeCount = computed(() => {
    return allBadges.value.length;
  });
  
  // Ophalen bij pagina-initialisatie
  onMounted(async () => {
    await fetchAllBadgesWithUserProgress();
    await fetchUserDailyStreak();
  });
  </script>
  