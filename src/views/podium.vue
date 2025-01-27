<template>
  <!-- Filter Buttons -->
  <div class="flex gap-2 justify-center w-full">
    <AppDialog type="sort" :currentSort="selectedSort" @updateSort="applySort" @closeDialog="sortDialogOpen = false" title="Sorteren op" icon="ChevronsUpDown" buttonClass="w-1/2" />
    <AppDialog type="podium-filter" :currentFilters="filters" @updateFilters="applyFilters" @closeDialog="filterDialogOpen = false" title="Filter" icon="Filter" buttonClass="w-1/2" />
  </div>

  <AppNotification ref="notification" />

  <!-- Podium -->
  <div class="flex items-end justify-center">
    <div v-for="(winner, index) in podiumWinners" :key="winner.userId" class="flex flex-col items-center">
      <SettingsAvatar class="mb-2.5 max-w-16 max-h-16" :id="`${winner.userId}`" />
      <p class="text-xs" :class="{ 'font-bold': winner.userId === userId }">{{ winner.firstname }} {{ winner.lastname }}</p>

      <div class="flex items-center gap-1 mb-4">
        <AppIcon name="Gem" :size="10" color="text-blue-48" />
        <p class="text-xs font-bold text-blue-48">
          {{ filters.locations.length > 0 && winner.totalLocationScore !== undefined ? winner.totalLocationScore : winner.totalScore }}
        </p>
      </div>
      <PodiumSvg :position="[2, 1, 3][index]" />
    </div>
  </div>

  <!-- Search -->
  <AppInput icon="search" placeholder="Search" />

  <!-- Leaderboard -->
  <div v-for="(player, index) in displayedLeaderboard" :key="player.userId">
    <AppLeaderboardPostion :position="player.rank ? player.rank : index + 4" :name="`${player.firstname} ${player.lastname}`" :amount="player.score" :me="player.userId === userId ? 'true' : 'false'" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppIcon from '@/components/App/Icon.vue';
import AppDialog from '@/components/App/Dialog.vue';
import SettingsAvatar from '@/components/Settings/Avatar.vue';
import PodiumSvg from '@/components/Podium/PodiumSvg.vue';
import AppInput from '@/components/App/Input.vue';
import AppLeaderboardPostion from '@/components/App/LeaderboardPosition.vue';
import Cookies from 'js-cookie';
import AppNotification from '@/components/App/Notification.vue';

const sortDialogOpen = ref(false);
const filterDialogOpen = ref(false);
const selectedSort = ref('globaal');
const userId = Number(Cookies.get('userId'));

const podiumWinners = ref([]);
const leaderboardData = ref([]);

const notification = ref(null);

const filters = ref({
  locations: [],
  minAge: null,
  maxAge: null,
});

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters }; // Sla de nieuwe filterwaarden op
  fetchFilteredLeaderboard();
};

const displayedLeaderboard = computed(() => {
  return leaderboardData.value.map((player) => ({
    ...player,
    score: filters.value.locations.length > 0 && player.totalLocationScore !== undefined ? player.totalLocationScore : player.totalScore,
  }));
});

const fetchFilteredLeaderboard = async () => {
  const params = new URLSearchParams();

  // Voeg geselecteerde locatiefilters toe als ze aanwezig zijn
  if (filters.value.locations.length) {
    params.append('locationIds', filters.value.locations.join(','));
  }

  // Voeg de minimum leeftijd toe aan de query als deze is ingesteld
  if (filters.value.minAge) {
    params.append('minAge', filters.value.minAge);
  }

  // Voeg de maximum leeftijd toe aan de query als deze is ingesteld
  if (filters.value.maxAge) {
    params.append('maxAge', filters.value.maxAge);
  }

  // Voeg het geselecteerde sorteertype toe ('globaal', 'locaal' 'volgend')
  if (selectedSort.value) {
    params.append('sortType', selectedSort.value);
  }


  // Als de gebruiker op 'volgend' sorteert, moet zijn/haar ID worden toegevoegd aan de query
  if (selectedSort.value === 'volgend') {
    if (userId && userId !== 0) {
      params.append('userId', userId);
    } else {
      console.error('User ID is missing or invalid.');
      notification.value?.addNotification(
        'Fout',
        'Gebruikers-ID ontbreekt of is ongeldig.',
        'error'
      );
      return;
    }
  }

  console.log('API request:', params.toString());

  try {
    // Voer de API-aanroep uit om de leaderboard-gegevens op te halen
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard/filter?${params.toString()}`);
    let data = await response.json();
    console.log('Leaderboard API response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch leaderboard data');
    }
    // Controleer of de respons succesvol is en data een array bevat
    if (response.ok && Array.isArray(data)) {

      // Als er minder dan 2 gebruikers zijn, schakel dan over naar de globale ranglijst
      if (data.length < 2) {
        console.warn('Not enough users found, switching to global.');
        selectedSort.value = 'globaal';

        // Reset filters om te voorkomen dat de lijst leeg blijft
        filters.value.minAge = null;
        filters.value.maxAge = null;
        filters.value.locations = [];

        notification.value?.addNotification(
          'Te weinig gebruikers',
          'Geen gebruikers gevonden. We schakelen over naar de globale ranglijst.',
          'error'
        );

        // Roep de functie opnieuw aan met de globale ranglijst
        fetchFilteredLeaderboard();
        return;
      }

      // Sorteer de lijst van spelers op basis van hun scores
      data = data.sort((a, b) => (b.totalLocationScore || b.totalScore) - (a.totalLocationScore || a.totalScore));

      // Zoek de huidige gebruiker in de geretourneerde lijst
      let userIndex = data.findIndex((player) => Number(player.userId) === userId);

      // Als de gebruiker niet in de top 10 staat, haal zijn/haar gegevens apart op
      if (userIndex === -1) {
        console.log(`User ${userId} not in Top 10 of leaderboard, fetching user score.`);

        try {
          let userData;
          if (filters.value.locations.length) {
            // Haal de gebruikersscore op voor een specifieke locatie
            const locationIds = filters.value.locations.join(',');
            const locationResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard/location/${filters.value.locations[0]}/user/${userId}`);
            console.log('API personal totalLocationScore:', locationResponse);
            if (!locationResponse.ok) {
              throw new Error(`No data found for user ${userId} at location`);
            }

            userData = await locationResponse.json();
          } else {
            // Haal algemene gebruikersgegevens op
            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`);

            if (!userResponse.ok) {
              throw new Error(`No data found for user ${userId}`);
            }

            userData = await userResponse.json();
          }

          // Voeg de huidige gebruiker toe aan de lijst met standaardwaarden als back-up
          const userEntry = {
            userId: userId,
            firstname: userData.firstname || 'Jij',
            lastname: userData.lastname || '',
            totalScore: userData.totalScore || 0,
            totalLocationScore: userData.totalLocationScore || 0,
          };

          data.push(userEntry);
        } catch (fetchError) {
          console.warn(`Error fetching user data, adding user with default values: ${fetchError.message}`);

          // Voeg een standaardgebruiker toe als er een probleem is bij het ophalen van de data
          data.push({
            userId: userId,
            firstname: Cookies.get('userFirstname') || 'Jij',
            lastname: Cookies.get('userLastname') || '',
            totalScore: 0,
            totalLocationScore: 0,
          });
        }

        // Sorteer opnieuw om de toegevoegde gebruiker correct te plaatsen
        data = await data.sort((a, b) => (b.totalLocationScore || b.totalScore) - (a.totalLocationScore || a.totalScore));
        console.log('API personal added:', data);
        // Zoek opnieuw naar de huidige gebruiker
        userIndex = data.findIndex((player) => Number(player.userId) === userId);
      }

      const userRank = userIndex + 1;

      // Update het podium met de top 3 winnaars
      podiumWinners.value =
        data.length >= 3
          ? [
            { ...data[1], parsedAvatar: await parseAvatar(data[1].avatar) }, // Tweede plaats
            { ...data[0], parsedAvatar: await parseAvatar(data[0].avatar) }, // Eerste plaats
            { ...data[2], parsedAvatar: await parseAvatar(data[2].avatar) }, // Derde plaats
          ]
          : data.slice(0, 3).map((winner) => ({
            ...winner,
            parsedAvatar: parseAvatar(winner?.avatar),
          }));

      console.log("Podium winners data:", podiumWinners.value.map(winner => ({
        position: podiumWinners.value.indexOf(winner) + 1,
        userId: winner.userId,
        firstname: winner.firstname,
        avatar: winner.avatar
      })));

      // Toon de top 10 spelers behalve de podiumwinnaars
      leaderboardData.value = data.slice(3, 10);

      console.log("leaderboardData ->", podiumWinners.value);

      // Als de gebruiker niet in de top 10 staat, voeg hem toe met zijn rang
      if (userIndex >= 10) {
        leaderboardData.value.push({
          userId: userId,
          firstname: Cookies.get('userFirstname') || 'Jij',
          lastname: Cookies.get('userLastname') || '',
          totalScore: filters.value.locations.length > 0 ? data[userIndex].totalLocationScore : data[userIndex].totalScore,
          rank: userRank,
        });
      }
    }
    // Als er geen gebruikers zijn gevonden, overschakelen naar globale ranglijst
    else if (response.status === 404 || data.message === 'No leaderboard entries found with given filters.') {
      console.warn('No leaderboard data found, switching to global leaderboard.');

      selectedSort.value = 'globaal';
      filters.value.minAge = null;
      filters.value.maxAge = null;
      filters.value.locations = [];

      notification.value?.addNotification(
        'Geen gebruikers gevonden',
        'We schakelen over naar de globale ranglijst.',
        'error'
      );

      await fetchFilteredLeaderboard();
    } else {
      // Indien er andere fouten optreden of geen data is ontvangen
      console.warn('No leaderboard data found:', data.message);
      podiumWinners.value = [];
      leaderboardData.value = [];
    }
  } catch (error) {
    // Foutafhandeling bij netwerkaanvragen of andere onverwachte fouten
    console.error('Error fetching leaderboard data:', error);

    notification.value?.addNotification(
      'Geen gebruikers gevonden',
      'We schakelen over naar de globale ranglijst.',
      'error'
    );

    selectedSort.value = 'globaal';
    filters.value.minAge = null;
    filters.value.maxAge = null;
    filters.value.locations = [];

    await fetchFilteredLeaderboard();
  }
};


const parseAvatar = (avatarString) => {
  if (!avatarString || typeof avatarString !== 'string') {
    return {
      skin: 'light',
      body: 'chest',
      eye: 'normal-eyes',
      eyebrows: 'none',
      mouth: 'grin',
      lipColor: 'red',
      hair: 'none',
      hairColor: 'brown',
      facialHair: 'none',
      clothing: 'none',
      clothingColor: 'white',
      hat: 'none',
      hatColor: 'white',
      accessory: 'none',
    };
  }

  const avatarParts = avatarString.split('|');

  return {
    skin: avatarParts[0] || 'light',
    body: avatarParts[1] || 'chest',
    eye: avatarParts[2] || 'normal-eyes',
    eyebrows: avatarParts[3] || 'none',
    mouth: avatarParts[4] || 'grin',
    lipColor: avatarParts[5] || 'red',
    hair: avatarParts[6] || 'none',
    hairColor: avatarParts[7] || 'brown',
    facialHair: avatarParts[8] || 'none',
    clothing: avatarParts[9] || 'none',
    clothingColor: avatarParts[10] || 'white',
    hat: avatarParts[11] || 'none',
    hatColor: avatarParts[12] || 'white',
    accessory: avatarParts[13] || 'none',
  };
};

onMounted(() => {
  fetchFilteredLeaderboard();
});
</script>

<style scoped>
.dialog-content {
  @apply w-full h-max bg-black-15 flex flex-col gap-5 items-center px-2 pt-4 pb-6 fixed bottom-0 left-0 z-[55] rounded-3xl;
}

dialog::backdrop {
  background-color: rgba(13, 13, 13, 0.55);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 2px;
}

.scrollbar-track-black-10::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollbar-thumb-blue-54::-webkit-scrollbar-thumb {
  background: #1cb2b7;
  border-radius: 4px;
}
</style>
