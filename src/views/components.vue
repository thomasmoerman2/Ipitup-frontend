<template>
  <div class="flex flex-col gap-24 container">
    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">header</h1>

    </div>
    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">button</h1>
      <AppButton text="Button" version="primary" />
      <AppButton text="Button" version="secondary" />
      <AppButton text="Button" version="tertiary" />
      <AppButton text="Button" version="outline" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">small button</h1>
      <AppSmallButton text="Button" version="blue" />
      <AppSmallButton text="Button" version="orange" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">Profile info</h1>
      <div class="flex justify-center gap-10">
        <ProfileInfo icon="Award" text="Geld" amount="5" />
        <ProfileInfo icon="RefreshCw" text="Ander geld" amount="1000" />
        <ProfileInfo icon="Gem" text="diamanten" amount="2" />
      </div>
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">navigation</h1>

    </div>
    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">workout exercise</h1>
      <WorkoutExercise img="https://picsum.photos/100" title="pushups" level="beginner" time="10" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">Search profile</h1>
      <SearchProfile img="https://picsum.photos/100" name="Thibo" username="thibo123" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">group option</h1>
      <AppOptions :options="[{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }]" v-model="selectedOption" @change="func_Emit2" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">checkbox</h1>
      <AppCheckbox />
      <AppCheckbox url="https://www.google.com" titleUrl="Google" title="External Link" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">filter</h1>
      <AppFilters />
      <AppFilters type="optie" optie="Optie" />

      <hr />
      <AppDialog type="search" title="Open Search" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">input</h1>
      <AppInput label="Username" placeholder="Username" id="username" />
      <AppInput label="Password" placeholder="Password" type="password" id="password" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">toggle</h1>
      <AppToggle @change="func_Emit" />
    </div>

    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">switch</h1>
      <div class="flex flex-col gap-5">
        <AppSwitch v-model="switchState1" id="switch1">Toggle me</AppSwitch>
        <AppSwitch v-model="switchState2" id="switch2">Another switch</AppSwitch>
      </div>
    </div>


    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">Badges</h1>
      <div class="flex justify-around gap-3 bg-black-20 py-5">
        <AppBadge exercise="Pushup" amount="25" />
        <AppBadge exercise="Squat" />
        <AppBadge exercise="Pullup" />
        <AppBadge exercise="Situp" />
      </div>
    </div>


    <div class="flex flex-col gap-10">
      <h1 class="capitalize underline font-caveat">workout</h1>
      xxxx
    </div>

  </div>
</template>

<script setup>
import AppButton from "@/components/App/Button.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import ProfileInfo from "@/components/Profile/Info.vue";
import WorkoutExercise from "@/components/Workout/Exercise.vue";
import AppOptions from "@/components/App/Options.vue";
import AppCheckbox from "@/components/App/Checkbox.vue";
import AppFilters from "@/components/App/Filters.vue";
import AppDialog from "@/components/App/Dialog.vue";
import AppInput from "@/components/App/Input.vue";
import AppToggle from "@/components/App/Toggle.vue";
import AppSwitch from "@/components/App/Switch.vue";
import SearchProfile from "@/components/Search/Profile.vue";
import AppBadge from "@/components/App/Badge.vue";

import { ref } from "vue";

const selectedOption = ref("1");
const switchState1 = ref(false);
const switchState2 = ref(false);

const func_Emit = (event) => {
  console.log(event);
};
const func_Emit2 = (option) => {
  console.log("Selected option:", option);
};
</script>
