<template>
    <div class="w-[10rem] h-[10rem] flex items-center justify-center relative">
        <Beanhead v-bind="{ mask: true, skin, body, eye, eyebrows, mouth, lipColor, hair, hairColor, facialHair, clothing, clothingColor, hat, hatColor, accessory }" />
        <div v-if="edit === 'true'" class="rounded-full bg-blue-18 w-6 h-6 flex items-center drop-shadow-md justify-center absolute bottom-3 right-6">
            <AppIcon name="pen" color="text-blue-108" :size="14" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppIcon from '@/components/App/Icon.vue';
import { Beanhead } from 'beanheads-vue';

// Default avatar values
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

const props = defineProps({
    edit: {
        type: String,
        default: "false",
    },
    id: {
        type: String,
        required: true,
        default: "1",
    },
});
const loadAvatar = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar/${props.id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch avatar');
        }

        const userData = await response.json();
        if (userData.avatar) {
            const avatarParts = userData.avatar.split('|');
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
        console.error('Error loading avatar:', error);
    }
};


onMounted(() => {
    loadAvatar();
});
</script>
