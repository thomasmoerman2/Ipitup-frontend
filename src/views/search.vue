<template>
    <div>
        <div class="mb-4">
            <AppInput icon="search" placeholder="Search" @update:modelValue="set_searchQuery" />
        </div>

        <!-- Recent Searches -->
        <div v-if="recentSearches.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
            <div class="flex flex-wrap gap-2">
                <button v-for="search in recentSearches" :key="search" @click="set_searchQuery(search)" class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
                    {{ search }}
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-2.5">
            <SearchProfile v-for="profile in profiles" :key="profile.id" :id=String(profile.id) :avatar="profile.avatar" :fullname="profile.firstname + ' ' + profile.lastname" :firstname="profile.firstname" />
            <p v-if="profiles.length === 0 && searchQuery.length > 0" class="text-blue-54 text-sm">Geen resultaten gevonden</p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import AppInput from "@/components/App/Input.vue";
import SearchProfile from "@/components/Search/Profile.vue";
import Cookies from 'js-cookie';

const searchQuery = ref('');
const profiles = ref([]);
const recentSearches = ref([]);
const MAX_RECENT_SEARCHES = 5;

const saveToRecentSearches = (query) => {
    if (!query) return;

    // Get existing searches or initialize empty array
    let searches = Cookies.get('recentSearches');
    searches = searches ? JSON.parse(searches) : [];

    // Remove the query if it already exists and add it to the front
    searches = searches.filter(s => s !== query);
    searches.unshift(query);

    // Keep only the last MAX_RECENT_SEARCHES items
    searches = searches.slice(0, MAX_RECENT_SEARCHES);

    // Save back to cookies
    Cookies.set('recentSearches', JSON.stringify(searches));
    recentSearches.value = searches;
}

const set_searchQuery = (value) => {
    searchQuery.value = value;
    if (value.trim()) {
        const firstname = value.split(' ')[0];
        const lastname = value.split(' ')[1];
        searchProfiles(firstname, lastname);
        saveToRecentSearches(value);
    }
}

const searchProfiles = async (firstname, lastname) => {
    if (!firstname) return;

    try {
        let url = `${import.meta.env.VITE_API_URL}/api/users/fullname?firstname=${firstname}`;
        if (lastname) {
            url += `&lastname=${lastname}`;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        profiles.value = data.body;
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }


}

onMounted(() => {
    // Load recent searches from cookies
    const searches = Cookies.get('recentSearches');
    recentSearches.value = searches ? JSON.parse(searches) : [];
})
</script>