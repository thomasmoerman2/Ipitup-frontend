<template>
  <div
    class="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-blue-6 to-white px-4 overflow-hidden py-8"
  >
    <!-- Main content -->
    <div
      class="flex-1 flex flex-col items-center justify-center w-full max-w-sm"
    >
      <!-- App intro -->
      <div class="flex flex-col items-center gap-4 mb-12">
        <h1 class="text-4xl font-bold text-blue-54 animate-fade-in">
          Workout App
        </h1>
        <p class="text-black-60 text-center animate-slide-up">
          Maak je klaar voor je workout!
        </p>
      </div>

      <!-- Loading indicator -->
      <div class="flex flex-col items-center gap-6 mb-8">
        <div class="relative w-full flex items-center justify-center">
          <!-- Animated workout icon -->
          <div class="flex flex-col items-center gap-2">
            <div
              class="w-24 h-24 bg-blue-54 rounded-full flex items-center justify-center shadow-lg"
            >
              <AppIcon
                name="Dumbbell"
                :size="32"
                color="text-white"
                class="animate-bounce-slow"
              />
            </div>
            <p class="text-2xl font-bold text-blue-54">
              {{ Math.round(loadingProgress) }}%
            </p>
          </div>
        </div>

        <!-- Loading status -->
        <div class="flex flex-col items-center gap-4">
          <div class="w-48 h-1.5 bg-blue-12 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-54 transition-all duration-700 ease-out"
              :style="{ width: `${loadingProgress}%` }"
            ></div>
          </div>
          <div class="h-12 text-center">
            <transition name="fade" mode="out-in">
              <p :key="loadingProgress" class="text-sm text-black-60">
                {{ getLoadingMessage(loadingProgress) }}
                <span v-if="retryCount > 0" class="block text-xs text-black-60">
                  Opnieuw proberen over {{ retryCountdown }} seconden... (Poging
                  {{ retryCount }}/{{ MAX_RETRIES }})
                </span>
              </p>
            </transition>
            <transition name="fade" mode="out-in">
              <p :key="currentQuote" class="text-sm text-black-60 italic mt-1">
                {{ currentQuote }}
              </p>
            </transition>
          </div>
        </div>
      </div>

      <!-- Only show buttons when there's an error, offline option needed, or for skipping -->
      <div
        v-if="retryCount > 0 || showSkipOption"
        class="flex flex-col gap-4 mt-4"
      >
        <button
          v-if="showOfflineOption || retryCount > 0"
          @click="handleContinueOffline"
          class="bg-blue-54 text-white py-2 px-4 rounded hover:bg-blue-60 transition duration-300"
        >
          Doorgaan zonder internet
          <span class="block text-xs"
            >Sommige functies zullen niet beschikbaar zijn</span
          >
        </button>
        <button
          v-if="!loadingComplete"
          @click="handleSkipLoading"
          class="bg-white text-blue-54 border border-blue-54 py-2 px-4 rounded hover:bg-blue-50 transition duration-300"
        >
          Loading overslaan
          <span class="block text-xs"
            >Beperkte functionaliteit beschikbaar</span
          >
        </button>
      </div>
    </div>

    <!-- Logos -->
    <div class="flex flex-col items-center gap-4">
      <strong class="text-xs text-black-60">Powered by</strong>
      <div
        class="flex items-center justify-center flex-wrap gap-8 px-4 max-w-2xl"
      >
        <div
          class="flex items-center justify-center w-24 bg-white rounded-lg p-2"
        >
          <img
            src="/logo/howest.png"
            alt="Howest"
            class="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
          />
        </div>
        <div
          class="flex items-center justify-center w-24 bg-white rounded-lg p-2"
        >
          <img
            src="/logo/sport-beweging.png"
            alt="Sport Beweging"
            class="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>

    <!-- Silent notifications for errors only -->
    <AppNotification ref="notificationRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import AppNotification from "@/components/App/Notification.vue";
import AppIcon from "@/components/App/Icon.vue";

const emit = defineEmits(["loadingComplete"]);
const router = useRouter();
const loadingProgress = ref(0);
const notificationRef = ref(null);
const targetProgress = ref(0);
let progressInterval = null;
const LOADING_TIMEOUT = 3000; // Show offline option after 3 seconds
let loadingTimeout = null;
const showOfflineOption = ref(false);
const showSkipOption = ref(true);
const loadingComplete = ref(false);

const quotes = [
  "Elke rep telt! 💪",
  "Je bent sterker dan je denkt! 🚀",
  "Maak er vandaag een geweldige training van! ⭐",
  "Klein beginnen, groot eindigen! 🎯",
  "Jij kan dit! 🔥",
];

const currentQuote = ref(quotes[0]);
let quoteInterval;
const MAX_RETRIES = 3;
const RETRY_DELAY = 10000;
const retryCount = ref(0);
const retryCountdown = ref(0);
let retryInterval = null;

localStorage.removeItem("animationPlayed");

const clearAllCookies = () => {
  Cookies.remove("authToken");
  Cookies.remove("userId");
  Cookies.remove("userFirstname");
  Cookies.remove("userLastname");
  Cookies.remove("userEmail");
  Cookies.remove("accountStatus");
  Cookies.remove("isAdmin");
  Cookies.remove("userLeaderboardScore");
  Cookies.remove("totalScore");
  Cookies.remove("activitiesCount");
  Cookies.remove("badgeCount");
  Cookies.remove("followers");
  Cookies.remove("following");
};
const validateToken = async () => {
  const authToken = Cookies.get("authToken");
  console.log(
    "Checking auth token:",
    authToken ? "Token exists" : "No token found"
  );
  if (!authToken) {
    console.log("No auth token found, validation failed");
    return false;
  }

  try {
    console.log("Validating token with backend...");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.log("Token validation failed, clearing cookies...");
      clearAllCookies();
      console.log("Cookies cleared due to token validation failure");
      return false;
    }

    console.log("isAdmin:", Cookies.get("isAdmin"));

    //fetch user data
    const userId = Cookies.get("userId");
    const userDataResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/${userId}`
    );
    const userData = await userDataResponse.json();

    if (!userData || typeof userData !== "object") {
      console.error("Invalid user data format received");
      clearAllCookies();
      console.log("Cookies cleared due to invalid user data format");
      return false;
    }

    try {
      Cookies.set("userId", userData.userId);
      Cookies.set("userFirstname", userData.firstname);
      Cookies.set("userLastname", userData.lastname);
      Cookies.set("userEmail", userData.email);
      Cookies.set("accountStatus", userData.accountStatus);
      Cookies.set("isAdmin", userData.isAdmin || false);
      Cookies.set("userLeaderboardScore", userData.totalScore);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Failed to update user data:", error);
      clearAllCookies();
      console.log("Cookies cleared due to user data update failure");
      return false;
    }

    console.log("Token validation successful");
    return true;
  } catch (error) {
    console.error("Token validation error:", error.message);
    clearAllCookies();
    console.log("Cookies cleared due to token validation error");
    return false;
  }
};

const getLoadingMessage = (progress) => {
  if (progress < 25) return "App starten...";
  if (progress < 50) return "Verbinding controleren...";
  if (progress < 75) return "Inloggegevens controleren...";
  if (progress < 100) return "Gebruikersgegevens laden...";
  return "Klaar om te beginnen!";
};

const startRetryCountdown = () => {
  retryCountdown.value = RETRY_DELAY / 1000;
  if (retryInterval) clearInterval(retryInterval);

  retryInterval = setInterval(() => {
    if (retryCountdown.value > 0) {
      retryCountdown.value--;
    } else {
      clearInterval(retryInterval);
    }
  }, 1000);
};
// Progress animation function
const animateProgress = () => {
  if (progressInterval) clearInterval(progressInterval);

  progressInterval = setInterval(() => {
    if (loadingProgress.value < targetProgress.value) {
      // Faster progress updates - bigger steps
      loadingProgress.value = Math.min(
        loadingProgress.value + 5,
        targetProgress.value
      );
    }
  }, 20); // Reduced from 50ms to 20ms for smoother animation
};

const startLoading = async () => {
  try {
    loadingProgress.value = 0;
    targetProgress.value = 0;
    showOfflineOption.value = false;

    // Check if we're already in offline/limited mode
    if (
      localStorage.getItem("goOffline") === "true" ||
      localStorage.getItem("skipLoading") === "true"
    ) {
      targetProgress.value = 100;
      animateProgress();
      return;
    }

    // Immediately show we're checking connection
    targetProgress.value = 25;
    animateProgress();

    let healthCheckSuccess = false;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const healthCheck = await fetch(
          `${import.meta.env.VITE_API_URL}/api/config/health`
        );
        if (!healthCheck.ok) {
          throw new Error(`Health check failed: ${healthCheck.status}`);
        }
        healthCheckSuccess = true;
        console.log("Health check successful");
        // Immediately show success
        targetProgress.value = 50;
        animateProgress();
        break;
      } catch (error) {
        console.error(`Health check attempt ${attempt} failed:`, error);
        if (attempt === MAX_RETRIES) {
          console.error("All health check attempts failed");
          showOfflineOption.value = true;
          targetProgress.value = 100;
          animateProgress();
          notificationRef.value?.addNotification(
            "Offline modus",
            "De server is niet bereikbaar. Je kunt offline doorgaan met beperkte functionaliteit.",
            "error"
          );
          localStorage.setItem("goOffline", "true");
          localStorage.setItem(
            "offlineModeStartTime",
            new Date().toISOString()
          );
          localStorage.setItem("lastError", "Server niet bereikbaar");
          return;
        } else {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    if (!healthCheckSuccess) return;

    // Start token validation immediately
    console.log("Starting token validation...");
    targetProgress.value = 75;
    animateProgress();

    try {
      const isValidToken = await validateToken();
      if (!isValidToken) {
        console.log("Token validation failed, showing offline option");
        if (loadingTimeout) clearTimeout(loadingTimeout);
        showOfflineOption.value = true;
        targetProgress.value = 100;
        animateProgress();
        notificationRef.value?.addNotification(
          "Niet ingelogd",
          "Je kan offline doorgaan of inloggen voor meer functies",
          "warning"
        );
        localStorage.setItem("goOffline", "true");
        localStorage.setItem("offlineModeStartTime", new Date().toISOString());
        localStorage.setItem("lastError", "Niet ingelogd");
        return;
      }
      // Complete loading immediately after successful validation
      targetProgress.value = 100;
      animateProgress();
    } catch (error) {
      console.error("Token validation error:", error);
      showOfflineOption.value = true;
      targetProgress.value = 100;
      animateProgress();
      notificationRef.value?.addNotification(
        "Validatie fout",
        "Er was een probleem met het valideren van je sessie. Je kunt offline doorgaan of opnieuw inloggen.",
        "error"
      );
      localStorage.setItem("goOffline", "true");
      localStorage.setItem("offlineModeStartTime", new Date().toISOString());
      localStorage.setItem("lastError", "Validatie fout");
      return;
    }
  } catch (error) {
    console.error("Loading error:", error);
    showOfflineOption.value = true;
    targetProgress.value = 100;
    animateProgress();
    notificationRef.value?.addNotification(
      "Error",
      "Er ging iets mis tijdens het laden",
      "error"
    );
    localStorage.setItem("goOffline", "true");
    localStorage.setItem("offlineModeStartTime", new Date().toISOString());
    localStorage.setItem("lastError", "Onverwachte fout");
  }
};

const handleContinueOffline = () => {
  try {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    localStorage.setItem("goOffline", "true");
    localStorage.removeItem("skipLoading"); // Ensure only one mode is active
    targetProgress.value = 100;
    animateProgress();
    // Set session start time for offline mode
    localStorage.setItem("offlineModeStartTime", new Date().toISOString());
  } catch (error) {
    console.error("Error in offline mode:", error);
    notificationRef.value?.addNotification(
      "Error in offline mode",
      "An unexpected error occurred",
      "error"
    );
  }
};

const handleSkipLoading = () => {
  try {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    localStorage.setItem("skipLoading", "true");
    localStorage.removeItem("goOffline"); // Ensure only one mode is active
    targetProgress.value = 100;
    animateProgress();
    // Set session start time for limited mode
    localStorage.setItem("limitedModeStartTime", new Date().toISOString());
    notificationRef.value?.addNotification(
      "Beperkte modus",
      "Sommige functies zijn mogelijk niet beschikbaar in deze modus",
      "info"
    );
  } catch (error) {
    console.error("Error in skip loading:", error);
    notificationRef.value?.addNotification(
      "Error",
      "Er is iets misgegaan",
      "error"
    );
  }
};

const handleLoadingComplete = () => {
  if (loadingProgress.value === 100) {
    loadingComplete.value = true;
    // If loading completes normally, clear any offline/limited mode flags
    if (!showOfflineOption.value && retryCount.value === 0) {
      localStorage.removeItem("goOffline");
      localStorage.removeItem("skipLoading");
      localStorage.removeItem("offlineModeStartTime");
      localStorage.removeItem("limitedModeStartTime");
    }
    // Add fade out animation class
    document.querySelector(".min-h-screen")?.classList.add("fade-out");
    // Navigate and emit after animation
    setTimeout(() => {
      emit("loadingComplete");
    }, 500);
  }
};

// Watch loading progress
watch(loadingProgress, (newValue) => {
  if (newValue === 100) {
    handleLoadingComplete();
  }
});

// Start loading and quote rotation on mount
onMounted(() => {
  startLoading();
  quoteInterval = setInterval(() => {
    const currentIndex = quotes.indexOf(currentQuote.value);
    currentQuote.value = quotes[(currentIndex + 1) % quotes.length];
  }, 3000);
});

// Clean up all intervals and timeouts
onUnmounted(() => {
  if (quoteInterval) clearInterval(quoteInterval);
  if (retryInterval) clearInterval(retryInterval);
  if (progressInterval) clearInterval(progressInterval);
  if (loadingTimeout) clearTimeout(loadingTimeout);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-out {
  animation: fade-out 0.5s ease-out forwards;
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
