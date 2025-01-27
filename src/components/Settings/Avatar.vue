<template>
    <div class="w-[10rem] h-[10rem] flex items-center justify-center relative">
        <div v-if="avatarData" class="w-full h-full flex items-center justify-center">
            <component :is="BeanheadRaw" :key="'beanhead_' + props.id + '_' + instanceId + '_' + avatarData.skin" :mask="true" v-bind="avatarData" />
        </div>
        <div v-if="edit === 'true'" class="rounded-full bg-blue-18 w-6 h-6 flex items-center drop-shadow-md justify-center absolute bottom-3 right-6">
            <AppIcon name="pen" color="text-blue-108" :size="14" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, markRaw } from 'vue';
import AppIcon from '@/components/App/Icon.vue';
import { Beanhead } from 'beanheads-vue';

// Mark the Beanhead component as raw to prevent Vue from making it reactive
const BeanheadRaw = markRaw(Beanhead);

const instanceId = Date.now() + '_' + Math.random();

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

const avatarData = reactive({});

const loadAvatar = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar/${props.id}`);

        if (!response.ok) throw new Error('Failed to fetch avatar');

        const userData = await response.json();
        console.log('Loading avatar for ID:', props.id, userData);

        if (userData.avatar) {
            const avatarParts = userData.avatar.split('|');

            // Clear existing data first
            Object.keys(avatarData).forEach(key => delete avatarData[key]);

            // Set new data
            Object.assign(avatarData, {
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
                accessory: avatarParts[13] || 'none'
            });
        }
    } catch (error) {
        console.error('Error loading avatar:', error);

        // Clear existing data first
        Object.keys(avatarData).forEach(key => delete avatarData[key]);

        // Set default data
        Object.assign(avatarData, {
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
            accessory: 'none'
        });
    }
};

// Watch for changes in the ID prop
watch(() => props.id, (newId, oldId) => {
    if (newId !== oldId) {
        loadAvatar();
    }
});

watch(() => avatarData, (newVal) => {
  console.log('Updated avatar data:', newVal);
}, { deep: true });


onMounted(loadAvatar);
</script>