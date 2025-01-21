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
                    </div>
                </div>
            </div>

            <!-- Only show buttons when there's an error or offline option needed -->
            <div v-if="retryCount > 0 || (showOfflineOption && !Cookies.get('authToken') && loadingProgress < 100)" class="flex flex-col gap-4 mt-4">
                <button v-if="showOfflineOption || retryCount > 0" @click="handleContinueOffline" class="bg-blue-54 text-white py-2 px-4 rounded hover:bg-blue-60 transition duration-300">
                    Doorgaan zonder internet
                </button>
                <button v-if="showOfflineOption && !Cookies.get('authToken')" @click="router.push('/login')" class="bg-white text-blue-54 border border-blue-54 py-2 px-4 rounded hover:bg-blue-50 transition duration-300">
                    Inloggen
                </button>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import AppNotification from '@/components/App/Notification.vue'
import AppIcon from '@/components/App/Icon.vue'

const emit = defineEmits(['loadingComplete'])
const router = useRouter()
const loadingProgress = ref(0)
const notificationRef = ref(null)
const targetProgress = ref(0)
let progressInterval = null
const LOADING_TIMEOUT = 8000 // Show offline option after 8 seconds
let loadingTimeout = null
const showOfflineOption = ref(false)

const quotes = [
    "Elke rep telt! 💪",
    "Je bent sterker dan je denkt! 🚀",
    "Maak er vandaag een geweldige training van! ⭐",
    "Klein beginnen, groot eindigen! 🎯",
    "Jij kan dit! 🔥"
]

const currentQuote = ref(quotes[0])
let quoteInterval
const MAX_RETRIES = 3
const RETRY_DELAY = 10000
const retryCount = ref(0)
const retryCountdown = ref(0)
let retryInterval = null

const getLoadingMessage = (progress) => {
    if (progress < 15) return "Verbinding maken..."
    if (progress < 30) return "App voorbereiden..."
    if (progress < 45) return "Gebruikersgegevens ophalen..."
    if (progress < 60) return "Oefeningen laden..."
    if (progress < 75) return "Voorkeuren instellen..."
    if (progress < 90) return "Bijna klaar..."
    if (progress < 100) return "Laatste stappen..."
    return "Klaar om te beginnen!"
}

const startRetryCountdown = () => {
    retryCountdown.value = RETRY_DELAY / 1000
    if (retryInterval) clearInterval(retryInterval)

    retryInterval = setInterval(() => {
        if (retryCountdown.value > 0) {
            retryCountdown.value--
        } else {
            clearInterval(retryInterval)
        }
    }, 1000)
}

const handleLoadingError = (error, step) => {
    console.error('Loading failed at step:', step, error)

    if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        startRetryCountdown()

        notificationRef.value?.addNotification(
            'Verbinding mislukt',
            `Opnieuw proberen over ${retryCountdown.value} seconden... (Poging ${retryCount.value}/${MAX_RETRIES})`,
            'error'
        )

        setTimeout(() => {
            startLoading()
        }, RETRY_DELAY)
    } else {
        notificationRef.value?.addNotification(
            'Laden mislukt',
            'Maximum aantal pogingen bereikt. Ververs de pagina handmatig om opnieuw te proberen.',
            'error'
        )
    }
}

// Progress animation function
const animateProgress = () => {
    if (progressInterval) clearInterval(progressInterval)

    progressInterval = setInterval(() => {
        if (loadingProgress.value < targetProgress.value) {
            loadingProgress.value = Math.min(loadingProgress.value + 1, targetProgress.value)
        }
    }, 50)
}

const startLoading = async () => {
    try {
        loadingProgress.value = 0
        targetProgress.value = 0
        showOfflineOption.value = false

        // Set timeout to show offline option
        loadingTimeout = setTimeout(() => {
            showOfflineOption.value = true
            notificationRef.value?.addNotification(
                'Laden duurt langer dan verwacht',
                'Je kan offline doorgaan of wachten op verbinding',
                'info'
            )
        }, LOADING_TIMEOUT)

        // Quick check for auth before starting
        const authToken = Cookies.get('authToken')
        const userId = Cookies.get('userId')
        if (!authToken || !userId) {
            if (loadingTimeout) clearTimeout(loadingTimeout)
            showOfflineOption.value = true
            targetProgress.value = 100
            animateProgress()
            notificationRef.value?.addNotification(
                'Niet ingelogd',
                'Je kan offline doorgaan of inloggen voor meer functies',
                'info'
            )
            return
        }

        // Step 1: Check auth and health (0-15%)
        try {
            targetProgress.value = 15
            animateProgress()

            const healthCheck = await fetch(`${import.meta.env.VITE_API_URL}/api/config/health`)
            if (!healthCheck.ok) throw new Error('Health check failed')
        } catch (error) {
            return handleLoadingError(error, 'health-check')
        }

        // Step 2: Verify token (15-30%)
        try {
            targetProgress.value = 30
            animateProgress()

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            if (!response.ok) {
                // Clear invalid cookies
                Cookies.remove('userId')
                Cookies.remove('authToken')
                Cookies.remove('userFirstname')
                Cookies.remove('userLastname')
                Cookies.remove('userEmail')
                Cookies.remove('accountStatus')
                if (loadingTimeout) clearTimeout(loadingTimeout)
                // Reload page instead of redirecting
                window.location.reload()
                return
            }
        } catch (error) {
            return handleLoadingError(error, 'token-verify')
        }

        // Step 3: Load user data (30-45%)
        try {
            targetProgress.value = 45
            animateProgress()

            const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`)
            if (!userResponse.ok) throw new Error('User data fetch failed')
        } catch (error) {
            return handleLoadingError(error, 'user-data')
        }

        // Step 4: Load exercises (45-60%)
        try {
            targetProgress.value = 60
            animateProgress()

            const exerciseResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/activity/user/${userId}`)
            if (!exerciseResponse.ok) throw new Error('Exercise data fetch failed')
        } catch (error) {
            return handleLoadingError(error, 'exercise-data')
        }

        // Faster final steps
        targetProgress.value = 75
        animateProgress()
        await new Promise(resolve => setTimeout(resolve, 200))

        targetProgress.value = 90
        animateProgress()
        await new Promise(resolve => setTimeout(resolve, 200))

        targetProgress.value = 100
        animateProgress()
        await new Promise(resolve => setTimeout(resolve, 200))

        // Clear timeout since loading completed successfully
        if (loadingTimeout) clearTimeout(loadingTimeout)

        // Redirect after a short delay
        setTimeout(() => {
            router.push('/')
        }, 300)

    } catch (error) {
        handleLoadingError(error, 'unknown')
    }
}

const handleContinueOffline = () => {
    try {
        if (loadingTimeout) clearTimeout(loadingTimeout)
        localStorage.setItem('goOffline', true)
        targetProgress.value = 100
        animateProgress()
    } catch (error) {
        console.error('Error in offline mode:', error)
        notificationRef.value?.addNotification(
            'Error in offline mode',
            'An unexpected error occurred',
            'error'
        )
    }
}

// Watch for loading progress to complete
const handleLoadingComplete = () => {
    if (loadingProgress.value === 100) {
        // Add fade out animation class
        document.querySelector('.min-h-screen')?.classList.add('fade-out')
        // Navigate and emit after animation
        setTimeout(() => {
            emit('loadingComplete')
        }, 500)
    }
}

// Watch loading progress
watch(loadingProgress, (newValue) => {
    if (newValue === 100) {
        handleLoadingComplete()
    }
})

// Start loading and quote rotation on mount
onMounted(() => {
    startLoading()
    quoteInterval = setInterval(() => {
        const currentIndex = quotes.indexOf(currentQuote.value)
        currentQuote.value = quotes[(currentIndex + 1) % quotes.length]
    }, 3000)
})

// Clean up all intervals and timeouts
onUnmounted(() => {
    if (quoteInterval) clearInterval(quoteInterval)
    if (retryInterval) clearInterval(retryInterval)
    if (progressInterval) clearInterval(progressInterval)
    if (loadingTimeout) clearTimeout(loadingTimeout)
})
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
