<template>

    <RouterLink to="/profile/settings" class="flex items-center gap-1">
        <AppIcon name="ArrowLeft" size="24" />
        <p class="font-medium text-[1.25rem]">Back</p>
    </RouterLink>

    <div class="flex flex-col md:flex-row gap-6">
        <!-- Avatar Preview -->
        <div class="w-full bg-white flex justify-center items-start sticky top-0 z-[55]">
            <Beanhead v-bind="{ mask: true, skin, body, eye, eyebrows, mouth, lipColor, hair, hairColor, facialHair, clothing, clothingColor, hat, hatColor, accessory }" class="w-full h-full translate-y-0 translate-x-0" />
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

        <AppButton text="Opslaan" version="primary" icon="false" @click="saveAvatarFetch" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppIcon from '@/components/App/Icon.vue';
import AppOptions from '@/components/App/Options.vue';
import AppButton from '@/components/App/Button.vue';
import { Beanhead } from 'beanheads-vue';
import { User, Smile, Scissors, Shirt, Glasses } from 'lucide-vue-next';
import Cookies from 'js-cookie';

const router = useRouter();
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


// Functie om avatar gegevens op te halen
const fetchAvatar = async () => {
    try {
        const userId = Cookies.get('userId');
        const token = Cookies.get('authToken');

        if (!userId || !token) {
            throw new Error('User ID or token not found in cookies');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch avatar');
        }

        const data = await response.json();
        console.log('Fetched avatar:', data.avatar);

        if (data.avatar) {
            const avatarParts = data.avatar.split('|');
            skin.value = avatarParts[0] || 'light';
            body.value = avatarParts[1] || 'chest';
            eye.value = avatarParts[2] || 'normal-eyes';
            eyebrows.value = avatarParts[3] || 'none';
            mouth.value = avatarParts[4] || 'grin';
            lipColor.value = avatarParts[5] || 'red';
            hair.value = avatarParts[6] || 'none';
            hairColor.value = avatarParts[7] || 'brown';
            facialHair.value = avatarParts[8] || 'none';
            clothing.value = avatarParts[9] || 'none';
            clothingColor.value = avatarParts[10] || 'white';
            hat.value = avatarParts[11] || 'none';
            hatColor.value = avatarParts[12] || 'white';
            accessory.value = avatarParts[13] || 'none';
        }
    } catch (error) {
        console.error('Error fetching avatar:', error.message);
    }
};

onMounted(fetchAvatar);

// Options definitions
const skinOptions = [
    { text: 'Licht', value: 'light' },
    { text: 'Geel', value: 'yellow' },
    { text: 'Bruin', value: 'brown' },
    { text: 'Donker', value: 'dark' },
    { text: 'Rood', value: 'red' },
    { text: 'Zwart', value: 'black' }
];

const bodyOptions = [
    { text: 'Man', value: 'chest' },
    { text: 'vrouw', value: 'breasts' },
    { text: 'X', value: 'chest' }
];

const eyeOptions = [
    { text: 'Normaal', value: 'normal-eyes' },
    { text: 'Content', value: 'content-eyes' },
    { text: 'Blij', value: 'happy-eyes' },
    { text: 'Hart', value: 'heart-eyes' },
    { text: 'Trillend', value: 'left-twitch-eyes' },
    { text: 'Simpel', value: 'simple-eyes' },
    { text: 'Scheel', value: 'squint-eyes' },
    { text: 'Knipoog', value: 'wink' }
];

const eyebrowOptions = [
    { text: 'None', value: 'none' },
    { text: 'Normaal', value: 'normal' },
    { text: 'Serieus', value: 'serious' },
    { text: 'Laag', value: 'left-lowered' },
    { text: 'Boos', value: 'angry' },
    { text: 'Bezorgd', value: 'concerned' }
];

const mouthOptions = [
    { text: 'Grijns', value: 'grin' },
    { text: 'Lippen', value: 'lips' },
    { text: 'Droevig', value: 'sad' },
    { text: 'Serieus', value: 'serious' },
    { text: 'Open', value: 'open' },
    { text: 'Tong', value: 'tongue' }
];

const lipColorOptions = [
    { text: 'Rood', value: 'red' },
    { text: 'Paars', value: 'purple' },
    { text: 'Roze', value: 'pink' },
    { text: 'Groen', value: 'green' }
];

const hairOptions = [
    { text: 'None', value: 'none' },
    { text: 'Afro', value: 'afro' },
    { text: 'Kaal', value: 'balding' },
    { text: 'Bob', value: 'bob' },
    { text: 'Knot', value: 'bun' },
    { text: 'Buzz', value: 'buzz' },
    { text: 'Lang', value: 'long' },
    { text: 'Pixie', value: 'pixie' },
    { text: 'Kort', value: 'short' }
];

const hairColorOptions = [
    { text: 'Blond', value: 'blonde' },
    { text: 'Oranje', value: 'orange' },
    { text: 'Zwart', value: 'black' },
    { text: 'Wit', value: 'white' },
    { text: 'Bruin', value: 'brown' },
    { text: 'Blauw', value: 'blue' },
    { text: 'Roze', value: 'pink' }
];

const facialHairOptions = [
    { text: 'None', value: 'none' },
    { text: 'Gestoppeld', value: 'stubble' },
    { text: 'Baard', value: 'medium-beard' }
];

const clothingOptions = [
    { text: 'None', value: 'none' },
    { text: 'T-shirt', value: 'shirt' },
    { text: 'Jurk', value: 'dress' },
    { text: 'V-hals', value: 'v-neck' },
    { text: 'Stropdas', value: 'dress-shirt' },
];

const colorOptions = [
    { text: 'Wit', value: 'white' },
    { text: 'Blauw', value: 'blue' },
    { text: 'Zwart', value: 'black' },
    { text: 'Groen', value: 'green' },
    { text: 'Rood', value: 'red' }
];

const hatOptions = [
    { text: 'None', value: 'none' },
    { text: 'Muts', value: 'beanie' },
    { text: 'Tulband', value: 'turban' }
];

const accessoryOptions = [
    { text: 'None', value: 'none' },
    { text: 'Rond', value: 'round-glasses' },
    { text: 'Klein', value: 'tiny-glasses' },
    { text: 'Zonnebril', value: 'shades' }
];


const saveAvatarFetch = async () => {
    try {
        const userId = Cookies.get('userId');
        const token = Cookies.get('authToken');

        if (!userId || !token) {
            throw new Error('User ID or token not found in cookies');
        }

        // Maak de string met avatar instellingen
        const avatarString = [
            "light",
            body.value,
            eye.value,
            eyebrows.value,
            mouth.value,
            lipColor.value,
            hair.value,
            hairColor.value,
            facialHair.value,
            clothing.value,
            clothingColor.value,
            hat.value,
            hatColor.value,
            accessory.value
        ].join('|');  // Gebruik een '|' als scheidingsteken

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/avatar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                avatar: avatarString
            }),
        });

        const data = await response.json();
        console.log('Avatar saved:', data);
        router.back();
    } catch (error) {
        console.error('Error saving avatar:', error.message);
    }
};

</script>

<style scoped>
*::-webkit-scrollbar {
    display: none;
}
</style>
