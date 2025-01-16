<template>
    <div>
        <div class="mb-10">
            <AppInput icon="search" placeholder="Search" />
        </div>

        <div class="flex flex-col gap-2.5">
            <SearchProfile id="1" img="https://picsum.photos/100" name="Thibo" username="thibo123" />
        </div>

    </div>
</template>
<script setup>
import AppInput from "@/components/App/Input.vue";
import SearchProfile from "@/components/Search/Profile.vue";
</script>