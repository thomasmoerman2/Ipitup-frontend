<template>
    <div class="container">
        <AppHeader title="Profile Customize" />

        <div class="flex flex-col md:flex-row gap-6">
            <!-- Avatar Preview -->
            <div class="w-full bg-white flex justify-center items-start sticky top-0 z-[55]">
                <Beanhead v-bind="{ mask: true, skin, body, eye, eyebrows, mouth, lipColor, hair, hairColor, facialHair, clothing, clothingColor, hat, hatColor, accessory }" />
            </div>

            <!-- Customization Panel -->
            <div class="w-full md:w-1/2 flex flex-col gap-4 pb-5">
                <!-- Category Tabs -->
                <div class="flex gap-2 p-2 bg-blue-6 rounded-md overflow-x-scroll">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="flex items-center gap-2 p-2 rounded-md transition-colors whitespace-nowrap" :class="activeTab === tab.id ? 'bg-blue-54 text-white' : 'text-blue-84'">
                        <component :is="tab.icon" class="w-4 h-4" />
                        <span class="text-sm">{{ tab.name }}</span>
                    </button>
                </div>

                <!-- Options Panel -->
                <div class="flex flex-col gap-4">
                    <!-- Appearance Options -->
                    <div v-if="activeTab === 'appearance'" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Skin Tone</h3>
                            <AppOptions :options="skinOptions" v-model="skin" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Body Type</h3>
                            <AppOptions :options="bodyOptions" v-model="body" class="flex-1" />
                        </div>
                    </div>

                    <!-- Face Options -->
                    <div v-if="activeTab === 'face'" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Eye Style</h3>
                            <AppOptions :options="eyeOptions" v-model="eye" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Eyebrow Style</h3>
                            <AppOptions :options="eyebrowOptions" v-model="eyebrows" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Mouth Style</h3>
                            <AppOptions :options="mouthOptions" v-model="mouth" class="flex-1" />
                        </div>
                        <div v-if="mouth === 'lips'" class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Lip Color</h3>
                            <AppOptions :options="lipColorOptions" v-model="lipColor" class="flex-1" />
                        </div>
                    </div>

                    <!-- Hair Options -->
                    <div v-if="activeTab === 'hair'" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Hairstyle</h3>
                            <AppOptions :options="hairOptions" v-model="hair" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2" v-if="hair !== 'none'">
                            <h3 class="text-sm font-semibold text-blue-84">Hair Color</h3>
                            <AppOptions :options="hairColorOptions" v-model="hairColor" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Facial Hair</h3>
                            <AppOptions :options="facialHairOptions" v-model="facialHair" class="flex-1" />
                        </div>
                    </div>

                    <!-- Clothing Options -->
                    <div v-if="activeTab === 'clothing'" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Style</h3>
                            <AppOptions :options="clothingOptions" v-model="clothing" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Color</h3>
                            <AppOptions :options="colorOptions" v-model="clothingColor" class="flex-1" />
                        </div>
                    </div>

                    <!-- Accessories Options -->
                    <div v-if="activeTab === 'accessories'" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Hat Style</h3>
                            <AppOptions :options="hatOptions" v-model="hat" class="flex-1" />
                        </div>
                        <div v-if="hat !== 'none'" class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Hat Color</h3>
                            <AppOptions :options="colorOptions" v-model="hatColor" class="flex-1" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-sm font-semibold text-blue-84">Glasses</h3>
                            <AppOptions :options="accessoryOptions" v-model="accessory" class="flex-1" />
                        </div>
                    </div>
                </div>
            </div>

            <AppButton text="Save" version="primary" icon="false" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/App/Header.vue';
import AppOptions from '@/components/App/Options.vue';
import AppButton from '@/components/App/Button.vue';
import { Beanhead } from 'beanheads-vue';
import { User, Smile, Scissors, Shirt, Glasses } from 'lucide-vue-next';

// Active tab state
const activeTab = ref('appearance');

// Tab definitions
const tabs = [
    { id: 'appearance', name: 'Body', icon: User },
    { id: 'face', name: 'Face', icon: Smile },
    { id: 'hair', name: 'Hair', icon: Scissors },
    { id: 'clothing', name: 'Clothes', icon: Shirt },
    { id: 'accessories', name: 'Extras', icon: Glasses }
];

// Avatar properties
const skin = ref('light');
const body = ref('chest');
const eye = ref('normal-eyes');
const eyebrows = ref('none');
const mouth = ref('grin');
const lipColor = ref('red');
const hair = ref('none');
const hairColor = ref('brown');
const facialHair = ref('none');
const clothing = ref('none');
const clothingColor = ref('white');
const hat = ref('none');
const hatColor = ref('white');
const accessory = ref('none');

// Options definitions
const skinOptions = [
    { text: 'Light', value: 'light' },
    { text: 'Yellow', value: 'yellow' },
    { text: 'Brown', value: 'brown' },
    { text: 'Dark', value: 'dark' },
    { text: 'Red', value: 'red' },
    { text: 'Black', value: 'black' }
];

const bodyOptions = [
    { text: 'Man', value: 'chest' },
    { text: 'Woman', value: 'breasts' }
];

const eyeOptions = [
    { text: 'Normal', value: 'normal-eyes' },
    { text: 'Content', value: 'content-eyes' },
    { text: 'Happy', value: 'happy-eyes' },
    { text: 'Heart', value: 'heart-eyes' },
    { text: 'Twitch', value: 'left-twitch-eyes' },
    { text: 'Simple', value: 'simple-eyes' },
    { text: 'Squint', value: 'squint-eyes' },
    { text: 'Wink', value: 'wink' }
];

const eyebrowOptions = [
    { text: 'None', value: 'none' },
    { text: 'Normal', value: 'normal' },
    { text: 'Serious', value: 'serious' },
    { text: 'Lowered', value: 'left-lowered' },
    { text: 'Angry', value: 'angry' },
    { text: 'Concerned', value: 'concerned' }
];

const mouthOptions = [
    { text: 'Grin', value: 'grin' },
    { text: 'Lips', value: 'lips' },
    { text: 'Sad', value: 'sad' },
    { text: 'Serious', value: 'serious' },
    { text: 'Open', value: 'open' },
    { text: 'Tongue', value: 'tongue' }
];

const lipColorOptions = [
    { text: 'Red', value: 'red' },
    { text: 'Purple', value: 'purple' },
    { text: 'Pink', value: 'pink' },
    { text: 'Green', value: 'green' }
];

const hairOptions = [
    { text: 'None', value: 'none' },
    { text: 'Afro', value: 'afro' },
    { text: 'Balding', value: 'balding' },
    { text: 'Bob', value: 'bob' },
    { text: 'Bun', value: 'bun' },
    { text: 'Buzz', value: 'buzz' },
    { text: 'Long', value: 'long' },
    { text: 'Pixie', value: 'pixie' },
    { text: 'Short', value: 'short' }
];

const hairColorOptions = [
    { text: 'Blonde', value: 'blonde' },
    { text: 'Orange', value: 'orange' },
    { text: 'Black', value: 'black' },
    { text: 'White', value: 'white' },
    { text: 'Brown', value: 'brown' },
    { text: 'Blue', value: 'blue' },
    { text: 'Pink', value: 'pink' }
];

const facialHairOptions = [
    { text: 'None', value: 'none' },
    { text: 'Stubble', value: 'stubble' },
    { text: 'Beard', value: 'medium-beard' }
];

const clothingOptions = [
    { text: 'None', value: 'none' },
    { text: 'Shirt', value: 'shirt' },
    { text: 'Dress', value: 'dress' },
    { text: 'V-Neck', value: 'v-neck' },
    { text: 'Dress Shirt', value: 'dress-shirt' },
];

const colorOptions = [
    { text: 'White', value: 'white' },
    { text: 'Blue', value: 'blue' },
    { text: 'Black', value: 'black' },
    { text: 'Green', value: 'green' },
    { text: 'Red', value: 'red' }
];

const hatOptions = [
    { text: 'None', value: 'none' },
    { text: 'Beanie', value: 'beanie' },
    { text: 'Turban', value: 'turban' }
];

const accessoryOptions = [
    { text: 'None', value: 'none' },
    { text: 'Round', value: 'round-glasses' },
    { text: 'Tiny', value: 'tiny-glasses' },
    { text: 'Shades', value: 'shades' }
];
</script>

<style scoped>
*::-webkit-scrollbar {
    display: none;
}
</style>
