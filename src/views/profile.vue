<template>

  <div class="flex flex-col  justify-between gap-10">
    <div class="flex flex-col items-center gap-5">
      <SettingsAvatar />
      <div class="flex flex-col items-center">
        <p class="font-bold mb-[0.3125rem]">{{ userData.firstname }} {{ userData.lastname }}</p>
        <p class="text-xs">{{ userData.username }}</p>
      </div>
      <RouterLink to="/profile/settings">
        <AppSmallButton version="blue" text="Profiel bewerken" />
      </RouterLink>
    </div>

    <div class="flex justify-around w-full">
      <ProfileInfo icon="Award" text="Badges" amount="7" />
      <ProfileInfo icon="RefreshCw" text="Oefeningen" amount="29" />
      <ProfileInfo icon="Gem" text="Punten" amount="544" />

    </div>

    <div>
      <p class="font-bold">Moving time</p>
      <div class="w-fit whitespace-nowrap py-3">
        <AppOptions :options="[
          { text: 'Deze week', value: 'Deze week' },
          { text: 'Deze maand', value: 'Deze maand' }
        ]" v-model="selectedOption" @change="handleOptionChange" />
      </div>
      <div class="flex w-full bg-blue-6 h-[10rem] justify-center items-center text-center">[Grafiek]</div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <p class="font-bold w-full">Badges</p>

      <div class="flex flex-wrap justify-center gap-2">
        <AppBadge exercise="Pushup" amount="100" />
        <AppBadge exercise="Squat" amount="500" />
        <AppBadge exercise="Pullup" amount="200" />
        <AppBadge exercise="Situp" amount="50" />
      </div>
      <RouterLink to="/badges">
        <AppSmallButton version="blue" text="Alle badges" />
      </RouterLink>

    </div>

    <!-- <div class="flex items-center font-bold justify-center">
      <p >Non-stop</p>
      <AppIcon name="Flame" color="text-blue-48" size="20"/>
      <p>8</p>
    </div> -->
  </div>

</template>

<script setup>
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import ProfileInfo from "@/components/Profile/Info.vue";
import AppOptions from "@/components/App/Options.vue";
import AppBadge from "@/components/App/Badge.vue";
import AppIcon from "@/components/App/Icon.vue";
import { ref, onMounted } from 'vue';
import { AppleIcon } from "lucide-vue-next";
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const router = useRouter();
const userData = ref({
  firstname: Cookies.get('userFirstname') || '',
  lastname: Cookies.get('userLastname') || '',
  email: Cookies.get('userEmail') || '',
  username: '@' + (Cookies.get('userFirstname') || '').toLowerCase(),
  accountStatus: Cookies.get('accountStatus') || 'Private'
})

const selectedOption = ref('1');

const handleOptionChange = (option) => {
  console.log('Selected option:', option);
};

onMounted(() => {
  if (!Cookies.get('authToken')) {
    router.push('/login')
  }
})
</script>
