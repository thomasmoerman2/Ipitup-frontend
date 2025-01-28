<template>
    <div class="w-[10rem] h-[10rem] flex items-center justify-center relative">
        <div v-if="avatarData" class="w-full h-full flex items-center justify-center">
            <component :is="BeanheadRaw" :key="'beanhead_' + props.id + '_' + instanceId + '_' + avatarData.skin" :mask="true" v-bind="avatarData" data-id="1" ref="beanheadComponent" />
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

// Add ref to component
const beanheadComponent = ref(null);

const exportAsSvg = async () => {
    if (beanheadComponent.value) {
        const svgElement = beanheadComponent.value.$el;
        if (svgElement && svgElement.tagName === 'svg') {
            // Force multiple reflows and ensure styles are computed
            svgElement.getBoundingClientRect();
            window.getComputedStyle(svgElement).getPropertyValue('transform');

            // Wait a tiny bit to ensure rendering
            await new Promise(resolve => setTimeout(resolve, 50));

            // Clone the SVG to avoid modifying the original
            const clonedSvg = svgElement.cloneNode(true);

            // Set explicit width and height
            clonedSvg.setAttribute('width', '160');
            clonedSvg.setAttribute('height', '160');
            clonedSvg.setAttribute('viewBox', '0 0 160 160');

            // Ensure all child elements are visible
            const allElements = clonedSvg.getElementsByTagName('*');
            for (let el of allElements) {
                if (el.style) {
                    el.style.display = el.style.display || 'inherit';
                    el.style.visibility = el.style.visibility || 'visible';
                }
            }

            // Force reflow on clone
            clonedSvg.getBoundingClientRect();
            window.getComputedStyle(clonedSvg).getPropertyValue('transform');

            return clonedSvg.outerHTML;
        }
    }
    return null;
};

// Expose the export method
defineExpose({
    exportAsSvg
});

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

const avatarData = ref({});

const loadAvatar = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/avatar/${props.id}`);

        if (!response.ok) throw new Error('Failed to fetch avatar');

        const userData = await response.json();
        console.log('Loading avatar for ID:', props.id, userData);

        if (userData.avatar) {
            const avatarParts = userData.avatar.split('|');

            // Set new data directly
            avatarData.value = {
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
            };
        }
    } catch (error) {
        console.error('Error loading avatar:', error);

        // Set default data directly
        avatarData.value = {
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
        };
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