<template>
  <!-- Filter Buttons -->
  <div class="flex gap-2 justify-center w-full">
    <button
      @click="openSort"
      class="flex items-center justify-center gap-2 bg-[#E8F8F8] text-blue-48 rounded-lg px-4 py-2 w-1/2"
    >
      <AppIcon name="ChevronsUpDown" :size="16" />
      <span class="text-sm">Sorteren op</span>
    </button>
    <button
      @click="openFilter"
      class="flex items-center justify-center gap-2 bg-[#E8F8F8] text-blue-48 rounded-lg px-4 py-2 w-1/2"
    >
      <AppIcon name="Filter" :size="16" />
      <span class="text-sm">Filter</span>
    </button>
  </div>

  <AppNotification ref="notification" />

  <!-- Podium -->
  <div class="flex items-end justify-center">
    <div
      v-for="(winner, index) in podiumWinners"
      :key="winner.userId"
      class="flex flex-col items-center"
    >
    <SettingsAvatar class="mb-2.5 max-w-16 max-h-16" v-bind="winner.parsedAvatar" />
      <p class="text-xs" :class="{ 'font-bold': winner.userId === userId }">
        {{ winner.firstname }} {{ winner.lastname }}
      </p>

      <div class="flex items-center gap-1 mb-4">
        <AppIcon name="Gem" :size="10" color="text-blue-48" />
        <p class="text-xs font-bold text-blue-48">
          {{
            filters.locations.length > 0 &&
            winner.totalLocationScore !== undefined
              ? winner.totalLocationScore
              : winner.totalScore
          }}
        </p>
      </div>
      <PodiumSvg :position="[2, 1, 3][index]" />
    </div>
  </div>

  <!-- Dialogs -->
  <Transition name="dialog">
    <dialog
      v-if="sortDialogOpen"
      @click="sortDialogOpen = false"
      class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0"
    >
      <div class="dialog-content" @click.stop>
        <DialogSort
          :currentSort="selectedSort"
          @updateSort="applySort"
          @closeDialog="sortDialogOpen = false"
        />
      </div>
    </dialog>
  </Transition>

  <Transition name="dialog">
    <dialog
      v-if="filterDialogOpen"
      @click="filterDialogOpen = false"
      class="z-[66] border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0"
    >
      <div class="dialog-content" @click.stop>
        <DialogPodiumFilter
          :currentFilters="filters"
          @updateFilters="applyFilters"
          @closeDialog="filterDialogOpen = false"
        />
      </div>
    </dialog>
  </Transition>

  <!-- Search -->
  <AppInput icon="search" placeholder="Search" />

  <!-- Leaderboard -->
  <div v-for="(player, index) in displayedLeaderboard" :key="player.userId">
    <AppLeaderboardPostion
      :position="player.rank ? player.rank : index + 4"
      :name="`${player.firstname} ${player.lastname}`"
      :amount="player.score"
      :me="player.userId === userId ? 'true' : 'false'"
    />
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AppIcon from "@/components/App/Icon.vue";
import DialogSort from "@/components/Dialog/Sort.vue";
import DialogPodiumFilter from "@/components/Dialog/PodiumFilter.vue";
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import PodiumSvg from "@/components/Podium/PodiumSvg.vue";
import AppInput from "@/components/App/Input.vue";
import AppLeaderboardPostion from "@/components/App/LeaderboardPosition.vue";
import Cookies from "js-cookie";
import AppNotification from "@/components/App/Notification.vue";

const searchQuery = ref("");
const sortDialogOpen = ref(false);
const filterDialogOpen = ref(false);
const selectedSort = ref("globaal");
const userId = Number(Cookies.get("userId"));

const podiumWinners = ref([]);
const leaderboardData = ref([]);

const notification = ref(null);
let notificationShown = false;

const filters = ref({
  locations: [],
  minAge: null,
  maxAge: null,
});

const openSort = () => {
  sortDialogOpen.value = true;
};

const applySort = (sortType) => {
  selectedSort.value = sortType;
  fetchFilteredLeaderboard();
};

const openFilter = () => {
  filterDialogOpen.value = true;
};

const applyFilters = (newFilters) => {
  filters.value = { ...newFilters }; // Sla de nieuwe filterwaarden op
  fetchFilteredLeaderboard();
};

const displayedLeaderboard = computed(() => {
  return leaderboardData.value.map((player) => ({
    ...player,
    score:
      filters.value.locations.length > 0 &&
      player.totalLocationScore !== undefined
        ? player.totalLocationScore
        : player.totalScore,
  }));
});

const fetchFilteredLeaderboard = async () => {
  const params = new URLSearchParams();

  if (filters.value.locations.length) {
    params.append("locationIds", filters.value.locations.join(","));
  }
  if (filters.value.minAge) {
    params.append("minAge", filters.value.minAge);
  }
  if (filters.value.maxAge) {
    params.append("maxAge", filters.value.maxAge);
  }
  if (selectedSort.value) {
    params.append("sortType", selectedSort.value);
  }

  if (selectedSort.value === "volgend") {
    if (userId && userId !== 0) {
      params.append("userId", userId);
    } else {
      console.error("User ID is missing or invalid.");
      return;
    }
  }

  console.log("API request:", params.toString());

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/leaderboard/filter?${params.toString()}`
    );
    let data = await response.json();
    console.log("Leaderboard API response:", data);

    if (response.ok && Array.isArray(data)) {
      if (data.length < 2) {
        console.warn("Not enough users found, switching to global.");
        selectedSort.value = "globaal";
        
        // Reset de age filters om spam te voorkomen
        filters.value.minAge = null;
        filters.value.maxAge = null;
        filters.value.locations = [];

        notification.value?.addNotification(
          "Te weinig gebruikers",
          "Er zijn te weinig gebruikers gevonden in deze leeftijdscategorie. We schakelen over naar de globale ranglijst.",
          "error"
        );

        fetchFilteredLeaderboard();
        return;
      }

      // Sorteer de lijst en bepaal de positie van de gebruiker
      data.sort(
        (a, b) =>
          (b.totalLocationScore ?? b.totalScore) -
          (a.totalLocationScore ?? a.totalScore)
      );

      let userIndex = data.findIndex(
        (player) => Number(player.userId) === userId
      );

      if (userIndex === -1) {
        console.warn(
          `User ${userId} not already in leaderboard, fetching user score.`
        );

        try {
          let userData;
          if (filters.value.locations.length) {
            const locationResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/leaderboard/location/${
                filters.value.locations[0]
              }/user/${userId}`
            );

            if (!locationResponse.ok) {
              throw new Error(`No data found for user ${userId} at location`);
            }

            userData = await locationResponse.json();
          } else {
            const userResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/user/${userId}`
            );

            if (!userResponse.ok) {
              throw new Error(`No data found for user ${userId}`);
            }

            userData = await userResponse.json();
          }

          const userEntry = {
            userId: userId,
            firstname: userData.firstname || "Jij",
            lastname: userData.lastname || "",
            totalScore: userData.totalScore || 0,
            totalLocationScore: userData.totalLocationScore || 0,
          };

          data.push(userEntry);
        } catch (fetchError) {
          console.warn(
            `Error fetching user data, adding user with default values: ${fetchError.message}`
          );

          data.push({
            userId: userId,
            firstname: Cookies.get("userFirstname") || "Jij",
            lastname: Cookies.get("userLastname") || "",
            totalScore: 0,
            totalLocationScore: 0,
          });
        }

        data.sort(
          (a, b) =>
            (b.totalLocationScore ?? b.totalScore) -
            (a.totalLocationScore ?? a.totalScore)
        );

        userIndex = data.findIndex(
          (player) => Number(player.userId) === userId
        );
      }

      const userRank = userIndex + 1;

      podiumWinners.value = data.length >= 3 
      ? [
          { ...data[1], parsedAvatar: parseAvatar(data[1].avatar) },
          { ...data[0], parsedAvatar: parseAvatar(data[0].avatar) },
          { ...data[2], parsedAvatar: parseAvatar(data[2].avatar) }
        ] 
      : data.slice(0, 3).map(winner => ({
          ...winner,
        parsedAvatar: parseAvatar(winner?.avatar)
      }));

      leaderboardData.value = data.slice(3, 10);

      if (userIndex >= 10) {
        leaderboardData.value.push({
          userId: userId,
          firstname: Cookies.get("userFirstname") || "Jij",
          lastname: Cookies.get("userLastname") || "",
          totalScore:
            filters.value.locations.length > 0
              ? data[userIndex].totalLocationScore
              : data[userIndex].totalScore,
          rank: userRank, 
        });
      }
    } else if (
      response.status === 404 ||
      data.message === "No leaderboard entries found with given filters."
    ) {
      console.warn(
        "No leaderboard data found, switching to global leaderboard."
      );

      selectedSort.value = "globaal";
      filters.value.minAge = null;
      filters.value.maxAge = null;
      filters.value.locations = [];

      notification.value?.addNotification(
        "Geen gebruikers gevonden",
        "We schakelen over naar de globale ranglijst.",
        "error"
      );

      fetchFilteredLeaderboard();
    } else {
      console.warn("No leaderboard data found:", data.message);
      podiumWinners.value = [];
      leaderboardData.value = [];
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
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
