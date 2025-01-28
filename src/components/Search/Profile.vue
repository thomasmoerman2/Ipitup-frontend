<template>
  <RouterLink :to="`/user/${id}`" class="flex items-center justify-between h-max">
    <div class="flex items-center">
      <div class="w-16 h-10 flex items-center justify-center mb-4">
        <Beanhead v-bind="{ mask: true, ...parseAvatar(avatar) }" class="w-full h-full translate-y-0 translate-x-0" />
      </div>
      <p class="font-bold">{{ fullname }}</p>
    </div>
    <p v-if="showUsername" class="text-xs text-black-40">@{{ firstname }}</p>
  </RouterLink>
</template>

<script setup>
import { Beanhead } from 'beanheads-vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  showUsername: {
    type: Boolean,
    default: true, // Standaard tonen we de username
  },
});

const parseAvatar = (avatarString) => {
  const avatarParts = avatarString.split('|');
  return {
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
    accessory: avatarParts[13] || 'none',
  };
};
</script>
