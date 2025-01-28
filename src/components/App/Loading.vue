<template>
    <div class="fixed inset-0 bg-white/95 flex items-center justify-center z-[9999]">
        <div class="flex flex-col items-center gap-6">
            <!-- Animated figure doing pushups -->
            <div class="pushup-animation">
                <div class="figure">
                    <div class="head"></div>
                    <div class="body"></div>
                    <div class="arms"></div>
                    <div class="legs"></div>
                </div>
                <div class="ground"></div>
            </div>

            <!-- Loading text -->
            <div class="flex flex-col items-center gap-2">
                <p class="text-xl font-bold text-blue-54">Even opwarmen...</p>
                <p class="text-sm text-black-60">{{ loadingMessages[currentMessageIndex] }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loadingMessages = [
    "Doe alvast wat stretches! 🤸‍♂️",
    "Bijna klaar om te beginnen! 💪",
    "Drink wat water! 💧",
    "Adem diep in en uit... 🧘‍♂️",
    "Maak je klaar voor actie! 🏃‍♂️"
];

const currentMessageIndex = ref(0);

onMounted(() => {
    setInterval(() => {
        currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.length;
    }, 2000);
});
</script>

<style scoped>
.pushup-animation {
    width: 100px;
    height: 100px;
    position: relative;
}

.figure {
    position: absolute;
    width: 60px;
    height: 30px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pushup 1.5s infinite ease-in-out;
}

.head {
    width: 20px;
    height: 20px;
    background: #1CB2B7;
    border-radius: 50%;
    position: absolute;
    left: -10px;
}

.body {
    width: 60px;
    height: 10px;
    background: #1CB2B7;
    position: absolute;
    top: 15px;
}

.arms {
    width: 10px;
    height: 30px;
    background: #1CB2B7;
    position: absolute;
    left: 0;
    top: 15px;
    transform-origin: top;
    animation: arms 1.5s infinite ease-in-out;
}

.legs {
    width: 10px;
    height: 30px;
    background: #1CB2B7;
    position: absolute;
    right: 0;
    top: 15px;
}

.ground {
    width: 100px;
    height: 4px;
    background: #E5E7EB;
    position: absolute;
    bottom: 20px;
    border-radius: 2px;
}

@keyframes pushup {

    0%,
    100% {
        transform: translate(-50%, -50%) translateY(0);
    }

    50% {
        transform: translate(-50%, -50%) translateY(15px);
    }
}

@keyframes arms {

    0%,
    100% {
        transform: rotate(-20deg);
    }

    50% {
        transform: rotate(-40deg);
    }
}
</style>