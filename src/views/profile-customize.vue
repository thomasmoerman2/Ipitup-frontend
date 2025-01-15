<template>
    <div class="container">
        <AppHeader title="Profile Customize" />

        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full bg-white flex justify-center items-start sticky top-0 z-[55]">
                <Beanhead :mask="true" :skin="skin" :body="body" :eye="eye" :eyebrows="eyebrows" :mouth="mouth" :lip-color="lipColor" :hair="hair" :hair-color="hairColor" :facial-hair="facialHair" :clothing="clothing" :clothing-color="clothingColor" :clothing-graphic="clothingGraphic" :hat="hat" :hat-color="hatColor" :accessory="accessory" />
            </div>

            <div class="w-full md:w-1/2 flex flex-col gap-4 pb-20">
                <!-- Appearance -->
                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Appearance</h3>
                    <AppOptions :options="[
                        { text: 'Light', value: 'light' },
                        { text: 'Yellow', value: 'yellow' },
                        { text: 'Brown', value: 'brown' },
                        { text: 'Dark', value: 'dark' },
                        { text: 'Red', value: 'red' },
                        { text: 'Black', value: 'black' }
                    ]" v-model="skin" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'Chest', value: 'chest' },
                        { text: 'Breasts', value: 'breasts' }
                    ]" v-model="body" class="flex-1 min-w-[150px]" />
                </div>

                <!-- Face -->
                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Face</h3>
                    <AppOptions :options="[
                        { text: 'Normal', value: 'normal-eyes' },
                        { text: 'Happy', value: 'happy-eyes' },
                        { text: 'Twitch', value: 'left-twitch-eyes' },
                        { text: 'Simple', value: 'simple-eyes' },
                        { text: 'Squint', value: 'squint-eyes' },
                        { text: 'Wink', value: 'wink' }
                    ]" v-model="eye" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Normal', value: 'normal' },
                        { text: 'Serious', value: 'serious' },
                        { text: 'Lowered', value: 'left-lowered' },
                        { text: 'Angry', value: 'angry' },
                    ]" v-model="eyebrows" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'Grin', value: 'grin' },
                        { text: 'Lips', value: 'lips' },
                        { text: 'Sad', value: 'sad' },
                        { text: 'Serious', value: 'serious' },
                        { text: 'Open', value: 'open' },
                        { text: 'Tongue', value: 'tongue' }
                    ]" v-model="mouth" class="flex-1 min-w-[150px]" />
                    <AppOptions v-if="mouth === 'lips'" :options="[
                        { text: 'Red', value: 'red' },
                        { text: 'Purple', value: 'purple' },
                        { text: 'Pink', value: 'pink' },
                        { text: 'Turquoise', value: 'turqoise' },
                        { text: 'Green', value: 'green' }
                    ]" v-model="lipColor" class="flex-1 min-w-[150px]" />
                </div>

                <!-- Hair -->
                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Hair</h3>
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Afro', value: 'afro' },
                        { text: 'Balding', value: 'balding' },
                        { text: 'Bob', value: 'bob' },
                        { text: 'Bun', value: 'bun' },
                        { text: 'Buzz', value: 'buzz' },
                        { text: 'Long', value: 'long' },
                        { text: 'Pixie', value: 'pixie' },
                        { text: 'Short', value: 'short' }
                    ]" v-model="hair" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'Blonde', value: 'blonde' },
                        { text: 'Orange', value: 'orange' },
                        { text: 'Black', value: 'black' },
                        { text: 'White', value: 'white' },
                        { text: 'Brown', value: 'brown' },
                        { text: 'Blue', value: 'blue' },
                        { text: 'Pink', value: 'pink' }
                    ]" v-model="hairColor" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Stubble', value: 'stubble' },
                        { text: 'Medium Beard', value: 'medium-beard' }
                    ]" v-model="facialHair" class="flex-1 min-w-[150px]" />
                </div>

                <!-- Clothing -->
                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Clothing</h3>
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Naked', value: 'naked' },
                        { text: 'Dress', value: 'dress' },
                        { text: 'Dress Shirt', value: 'dress-shirt' },
                        { text: 'Shirt', value: 'shirt' },
                        { text: 'Tank Top', value: 'tank-top' },
                        { text: 'V-Neck', value: 'v-neck' }
                    ]" v-model="clothing" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'White', value: 'white' },
                        { text: 'Blue', value: 'blue' },
                        { text: 'Black', value: 'black' },
                        { text: 'Green', value: 'green' },
                        { text: 'Red', value: 'red' }
                    ]" v-model="clothingColor" class="flex-1 min-w-[150px]" />
                </div>

                <!-- Accessories -->
                <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Accessories</h3>
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Beanie', value: 'beanie' },
                        { text: 'Turban', value: 'turban' }
                    ]" v-model="hat" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'White', value: 'white' },
                        { text: 'Blue', value: 'blue' },
                        { text: 'Black', value: 'black' },
                        { text: 'Green', value: 'green' },
                        { text: 'Red', value: 'red' }
                    ]" v-model="hatColor" class="flex-1 min-w-[150px]" />
                    <AppOptions :options="[
                        { text: 'None', value: 'none' },
                        { text: 'Round Glasses', value: 'round-glasses' },
                        { text: 'Tiny Glasses', value: 'tiny-glasses' },
                        { text: 'Shades', value: 'shades' }
                    ]" v-model="accessory" class="flex-1 min-w-[150px]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppHeader from '@/components/App/Header.vue';
import AppOptions from '@/components/App/Options.vue';
import { Beanhead } from 'beanheads-vue'
import { ref } from 'vue';

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
const clothingGraphic = ref('none');
const hat = ref('none');
const hatColor = ref('white');
const accessory = ref('none');
</script>