<template>
    <div class="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-blue-6 to-white px-4 overflow-hidden py-8">
        <!-- Main content -->
        <div class="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
            <!-- App intro -->
            <div class="flex flex-col items-center gap-4 mb-12">
                <h1 class="text-4xl font-bold text-blue-54 animate-fade-in">Workout App</h1>
                <p class="text-black-60 text-center animate-slide-up">Maak je klaar voor je workout!</p>
            </div>

            <!-- Loading indicator -->
            <div class="flex flex-col items-center gap-6 mb-8">
                <div class="relative w-full flex items-center justify-center">
                    <!-- Animated workout icon -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-24 h-24 bg-blue-54 rounded-full flex items-center justify-center shadow-lg">
                            <AppIcon name="Dumbbell" :size="32" color="text-white" class="animate-bounce-slow" />
                        </div>
                        <p class="text-2xl font-bold text-blue-54">
                            {{ Math.round(loadingProgress) }}%
                        </p>
                    </div>
                </div>

                <!-- Loading status -->
                <div class="flex flex-col items-center gap-4">
                    <div class="w-48 h-1.5 bg-blue-12 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-54 transition-all duration-700 ease-out" :style="{ width: `${loadingProgress}%` }">
                        </div>
                    </div>
                    <div class="h-12 text-center">
                        <transition name="fade" mode="out-in">
                            <p :key="loadingProgress" class="text-sm text-black-60">
                                {{ getLoadingMessage(loadingProgress) }}
                                <span v-if="retryCount > 0" class="block text-xs text-black-60">
                                    Opnieuw proberen over {{ retryCountdown }} seconden...
                                    (Poging {{ retryCount }}/{{ MAX_RETRIES }})
                                </span>
                            </p>
                        </transition>
                        <transition name="fade" mode="out-in">
                            <p :key="currentQuote" class="text-sm text-black-60 italic mt-1">
                                {{ currentQuote }}
                            </p>
                        </transition>
                        <button v-if="retryCount >= MAX_RETRIES" @click="handleContinueOffline" class="mt-4 bg-blue-54 text-white py-2 px-4 rounded hover:bg-blue-60 transition duration-300">
                            Continue Offline
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Logos -->
        <div class="flex flex-col items-center gap-4">
            <strong class="text-xs text-black-60">Powered by</strong>
            <div class="flex items-center justify-center flex-wrap gap-8 px-4 max-w-2xl">
                <div class="flex items-center justify-center w-24 bg-white rounded-lg p-2">
                    <img src="/logo/howest.png" alt="Howest" class="max-h-full max-w-full object-contain hover:scale-105 transition-transform" />
                </div>
                <div class="flex items-center justify-center w-24 bg-white rounded-lg p-2">
                    <img src="/logo/sport-beweging.png" alt="Sport Beweging" class="max-h-full max-w-full object-contain hover:scale-105 transition-transform" />
                </div>
            </div>
        </div>

        <!-- Silent notifications for errors only -->
        <AppNotification ref="notificationRef" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppNotification from '@/components/App/Notification.vue';
import AppIcon from '@/components/App/Icon.vue';

const userStore = useUserStore();
const loadingProgress = ref(0);
const notificationRef = ref(null);

const quotes = [
    "Elke rep telt! 💪",
    "Je bent sterker dan je denkt! 🚀",
    "Maak er vandaag een geweldige training van! ⭐",
    "Klein beginnen, groot eindigen! 🎯",
    "Jij kan dit! 🔥"
];

const currentQuote = ref(quotes[0]);
let quoteInterval;

const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY = 10000; // 10 seconds in milliseconds
const retryCount = ref(0);
const retryCountdown = ref(0);
let retryInterval = null;

const getLoadingMessage = (progress) => {
    if (progress < 15) return "Verbinding maken...";
    if (progress < 30) return "App voorbereiden...";
    if (progress < 45) return "Gebruikersgegevens ophalen...";
    if (progress < 60) return "Oefeningen laden...";
    if (progress < 75) return "Voorkeuren instellen...";
    if (progress < 90) return "Bijna klaar...";
    if (progress < 100) return "Laatste stappen...";
    return "Klaar om te beginnen!";
};

// Add retry countdown function
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

// Update the error handling in startLoading
const handleLoadingError = (error, step) => {
    console.error('Loading failed at step:', step, error);

    if (retryCount.value < MAX_RETRIES) {
        retryCount.value++;
        startRetryCountdown();

        notificationRef.value?.addNotification(
            'Verbinding mislukt',
            `Opnieuw proberen over ${retryCountdown.value} seconden... (Poging ${retryCount.value}/${MAX_RETRIES})`,
            'error'
        );

        // Schedule retry
        setTimeout(() => {
            startLoading();
        }, RETRY_DELAY);
    } else {
        notificationRef.value?.addNotification(
            'Laden mislukt',
            'Maximum aantal pogingen bereikt. Ververs de pagina handmatig om opnieuw te proberen.',
            'error'
        );
    }
};

// Update the startLoading function
const startLoading = async () => {
    try {
        loadingProgress.value = 0;

        // Step 1: Health check (0-15%)
        try {
            const healthCheck = await fetch(`${import.meta.env.VITE_API_URL}/api/config/health`);
            if (!healthCheck.ok) throw new Error('Health check failed');
            loadingProgress.value = 15;
        } catch (error) {
            return handleLoadingError(error, 'health-check');
        }

        // Step 2: App preparation (15-30%)
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('appPrepared', true);

        if (localStorage.getItem('loggedIn')) {
            if (localStorage.getItem('userData')) {
                loadingProgress.value = 100;
                emit('loading-complete', null);
                return null;
            } else {
                loadingProgress.value = 30;
            }
        } else {
            loadingProgress.value = 30;
        }

        // Step 3: User data (30-45%)
        try {
            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`);
            if (!userResponse.ok) throw new Error('User data fetch failed');
            const userData = await userResponse.json();
            localStorage.setItem('userData', JSON.stringify(userData));
            loadingProgress.value = 45;
        } catch (error) {
            return handleLoadingError(error, 'user-data');
        }

        // Step 4: Exercises (45-60%)
        try {
            const exerciseResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises`);
            if (!exerciseResponse.ok) throw new Error('Exercise data fetch failed');
            const exerciseData = await exerciseResponse.json();
            localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
            loadingProgress.value = 60;
        } catch (error) {
            throw new Error('Kan oefeningen niet laden');
        }

        // Step 5: User preferences (60-75%)
        try {
            loadingProgress.value = 75;
        } catch (error) {
            throw new Error('Kan voorkeuren niet instellen');
        }

        // Step 6: Final preparations (75-90%)
        await new Promise(resolve => setTimeout(resolve, 300));
        if (localStorage.getItem('userData') && localStorage.getItem('exerciseData') && localStorage.getItem('appPrepared')) {
            loadingProgress.value = 90;
        } else {
            throw new Error('Kan niet klaar zijn');
        }

        // Step 7: Completion (90-100%)
        await new Promise(resolve => setTimeout(resolve, 200));
        loadingProgress.value = 100;

        // Emit completion after a short delay
        setTimeout(() => {
            emit('loading-complete', null);
        }, 300);

    } catch (error) {
        handleLoadingError(error, 'unknown');
        return null;
    }
};

// Start loading and quote rotation on mount
onMounted(() => {
    startLoading();
    quoteInterval = setInterval(() => {
        const currentIndex = quotes.indexOf(currentQuote.value);
        currentQuote.value = quotes[(currentIndex + 1) % quotes.length];
    }, 3000);
});

// Clean up on unmount
onUnmounted(() => {
    if (quoteInterval) clearInterval(quoteInterval);
    if (retryInterval) clearInterval(retryInterval);
});

// Add emit declaration
const emit = defineEmits(['loading-complete']);

// Add continue offline handler
const handleContinueOffline = () => {
    try {
        // Set a flag in the store to indicate offline mode
        localStorage.setItem('goOffline', true);

        // Complete the loading process
        loadingProgress.value = 100;

        // Emit with null to indicate offline mode
        emit('loading-complete', null);

        return null; // Explicit return for the event handler
    } catch (error) {
        console.error('Error in offline mode:', error);
        return null; // Always return null for the event handler
    }
};
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

/* Add new animation for the icon */
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
