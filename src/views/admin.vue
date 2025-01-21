<template>
    <div class="bg-gray-50 py-8 rounded-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Navigation Tabs -->
            <div class="mb-8 bg-white rounded-xl shadow-sm p-2">
                <nav class="flex space-x-4">
                    <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
                        currentTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                        'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200'
                    ]">
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <div class="bg-white rounded-xl shadow-sm">
                <!-- Header with Add Button -->
                <div class="p-6 sm:p-8 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h2 class="text-3xl font-bold text-gray-900">{{ currentTabName }}</h2>
                        <button @click="showAddModal = true" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                            Add New {{ currentTabName.slice(0, -1) }}
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="flex justify-center items-center p-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>

                <!-- Content -->
                <div v-else class="p-6 sm:p-8">
                    <!-- Items List -->
                    <div class="divide-y divide-gray-200">
                        <!-- Users Table -->
                        <template v-if="currentTab === 'user'">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthdate</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="user in items" :key="user.userId">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <img :src="user.avatar || '/user.png'" alt="" class="h-10 w-10 rounded-full">
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-gray-900">
                                                            {{ user.userFirstname }} {{ user.userLastname }}
                                                        </div>
                                                        <div class="text-sm text-gray-500">
                                                            Score: {{ user.totalScore }} | Streak: {{ user.dailyStreak }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{{ user.userEmail }}</div>
                                                <div class="text-xs text-gray-500">{{ new Date(user.birthDate).toLocaleDateString() }}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.accountStatus === 'Public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                                                    {{ user.accountStatus }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ new Date(user.birthDate).toLocaleDateString() }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button @click="confirmPasswordReset(user)" class="text-blue-600 hover:text-blue-900 font-medium">
                                                    Reset Password
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </template>

                        <!-- Activities Table -->
                        <template v-else-if="currentTab === 'activity'">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity ID</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="activity in items" :key="activity.activityId">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ activity.activityId }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ activity.userId }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ activity.activityScore }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ activity.activityDuration }}s</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ new Date(activity.activityDate).toLocaleString() }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.locationId || '-' }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.exerciseId || '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </template>

                        <!-- Other Items List -->
                        <template v-else>
                            <div v-for="item in items" :key="getItemId(item)" class="p-6">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <!-- Exercise Item -->
                                        <template v-if="currentTab === 'exercise'">
                                            <h3 class="text-lg font-medium text-gray-900">{{ item.exerciseName }}</h3>
                                            <p class="mt-1 text-sm text-gray-500">{{ item.exerciseInstructions }}</p>
                                            <div class="mt-2 flex items-center gap-4">
                                                <span class="text-sm text-gray-500">Type: {{ item.exerciseType }}</span>
                                                <span class="text-sm text-gray-500">Time: {{ item.exerciseTime }}s</span>
                                            </div>
                                        </template>

                                        <!-- Location Item -->
                                        <template v-if="currentTab === 'location'">
                                            <h3 class="text-lg font-medium text-gray-900">{{ item.locationName }}</h3>
                                            <p class="mt-1 text-sm text-gray-500">{{ item.locationCountry }}</p>
                                        </template>

                                        <!-- Badge Item -->
                                        <template v-if="currentTab === 'badge'">
                                            <div class="flex items-center">
                                                <div>
                                                    <h3 class="text-lg font-medium text-gray-900">{{ item.badgeName }}</h3>
                                                    <p class="mt-1 text-sm text-gray-500">{{ item.badgeDescription }}</p>
                                                    <p class="mt-1 text-sm text-blue-500">Required Amount: {{ item.badgeAmount }}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="ml-4 flex-shrink-0 flex space-x-2">
                                        <button @click="editItem(item)" class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md text-sm font-medium transition-colors">
                                            Edit
                                        </button>
                                        <button @click="confirmDelete(item)" class="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-2xl w-full p-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-900">
                    {{ showEditModal ? 'Edit' : 'Add' }} {{ currentTabName.slice(0, -1) }}
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-500 p-2">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-6">
                <template v-if="currentTab === 'exercise'">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Exercise Name</label>
                        <input v-model="formData.exerciseName" type="text" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
                        <input v-model="formData.exerciseType" type="text" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                        <textarea v-model="formData.exerciseInstructions" rows="4" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time (seconds)</label>
                        <input v-model="formData.exerciseTime" type="number" min="1" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                </template>

                <template v-if="currentTab === 'location'">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                        <input v-model="formData.locationName" type="text" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input v-model="formData.locationCountry" type="text" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                </template>

                <template v-if="currentTab === 'badge'">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                        <input v-model="formData.badgeName" type="text" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea v-model="formData.badgeDescription" rows="4" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Required Amount</label>
                        <input v-model="formData.badgeAmount" type="number" min="0" class="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                </template>
            </div>

            <div class="mt-8 flex justify-end space-x-4">
                <button @click="closeModal" class="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors duration-200">
                    Cancel
                </button>
                <button @click="submitForm" :disabled="isLoading" class="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition-colors duration-200 disabled:opacity-50">
                    {{ isLoading ? 'Saving...' : (showEditModal ? 'Update' : 'Add') }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-md w-full p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p class="text-gray-500">
                Are you sure you want to delete this {{ currentTabName.slice(0, -1).toLowerCase() }}? This action cannot be undone.
            </p>
            <div class="mt-8 flex justify-end space-x-4">
                <button @click="showDeleteModal = false" class="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors duration-200">
                    Cancel
                </button>
                <button @click="deleteItem" :disabled="isLoading" class="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors duration-200 disabled:opacity-50">
                    {{ isLoading ? 'Deleting...' : 'Delete' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showPasswordResetModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-md w-full p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Password Reset</h3>
            <p class="text-gray-500">
                Are you sure you want to reset the password for {{ selectedUser?.userFirstname }} {{ selectedUser?.userLastname }}?
                They will receive an email with instructions to set a new password.
            </p>
            <div class="mt-8 flex justify-end space-x-4">
                <button @click="showPasswordResetModal = false" class="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors duration-200">
                    Annuleren
                </button>
                <button @click="resetPassword" :disabled="isLoading" class="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition-colors duration-200 disabled:opacity-50">
                    {{ isLoading ? 'Verzenden...' : 'Wachtwoord resetten' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Password Display Modal -->
    <div v-if="showNewPasswordModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-md w-full p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Nieuw wachtwoord</h3>
            <div class="flex gap-2 mb-4">
                <input type="text" :value="newPassword" readonly class="flex-1 px-4 py-2 border rounded-lg bg-gray-50" />
                <button @click="copyPassword" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Kopiëren
                </button>
            </div>
            <div class="flex justify-end">
                <button @click="showNewPasswordModal = false" class="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors duration-200">
                    Sluiten
                </button>
            </div>
        </div>
    </div>

    <!-- Silent notifications -->
    <AppNotification ref="notification" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AppNotification from '@/components/App/Notification.vue'

const tabs = [
    { id: 'exercise', name: 'Exercises' },
    { id: 'location', name: 'Locations' },
    { id: 'badge', name: 'Badges' },
    { id: 'user', name: 'Users' },
    { id: 'activity', name: 'Activities' }
]

const currentTab = ref('exercise')
const apiPath = import.meta.env.VITE_API_URL
const items = ref([])
const isLoading = ref(false)
const formData = ref({})
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showPasswordResetModal = ref(false)
const showNewPasswordModal = ref(false)
const selectedItem = ref(null)
const selectedUser = ref(null)
const notification = ref(null)
const newPassword = ref('')

// Computed Properties
const currentTabName = computed(() => {
    return tabs.find(tab => tab.id === currentTab.value)?.name || ''
})

const difficultyClass = (difficulty) => {
    const classes = {
        1: 'bg-green-100 text-green-800',
        2: 'bg-blue-100 text-blue-800',
        3: 'bg-yellow-100 text-yellow-800',
        4: 'bg-orange-100 text-orange-800',
        5: 'bg-red-100 text-red-800'
    }
    return classes[difficulty] || 'bg-gray-100 text-gray-800'
}

// Methods
const getItemId = (item) => {
    switch (currentTab.value) {
        case 'exercise':
            return item.exerciseId
        case 'location':
            return item.locationId
        case 'badge':
            return item.badgeId
        case 'activity':
            return item.activityId
        case 'user':
            return item.userId
        default:
            return item.id
    }
}

const fetchItems = async () => {
    try {
        isLoading.value = true
        items.value = [] // Clear items before fetching new ones

        const endpoint = `${apiPath}/api/${currentTab.value}`
        const response = await fetch(endpoint)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        items.value = data
    } catch (error) {
        console.error('Error fetching items:', error)
        items.value = [] // Reset items on error
    } finally {
        isLoading.value = false
    }
}

const submitForm = async () => {
    try {
        isLoading.value = true
        const method = showEditModal.value ? 'update' : 'add'
        const endpoint = currentTab.value === 'user' ? 'user' : `${currentTab.value}s`

        // Add any necessary ID fields based on the table
        if (showEditModal.value) {
            switch (currentTab.value) {
                case 'exercise':
                    formData.value.exerciseId = selectedItem.value.exerciseId
                    break
                case 'location':
                    formData.value.locationId = selectedItem.value.locationId
                    break
                case 'badge':
                    formData.value.badgeId = selectedItem.value.badgeId
                    break
                case 'activity':
                    formData.value.activityId = selectedItem.value.activityId
                    break
            }
        }

        const response = await fetch(`${apiPath}/api/${endpoint}/${method}`, {
            method: showEditModal.value ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData.value)
        })

        if (response.ok) {
            await fetchItems()
            closeModal()
        }
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        isLoading.value = false
    }
}

const editItem = (item) => {
    selectedItem.value = item
    formData.value = { ...item }
    showEditModal.value = true
}

const confirmDelete = (item) => {
    selectedItem.value = item
    showDeleteModal.value = true
}

const deleteItem = async () => {
    try {
        isLoading.value = true
        const response = await fetch(`${apiPath}/api/${currentTab.value}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ id: selectedItem.value.id })
        })

        if (response.ok) {
            await fetchItems()
            showDeleteModal.value = false
        }
    } catch (error) {
        console.error('Error deleting item:', error)
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    showAddModal.value = false
    showEditModal.value = false
    formData.value = {}
    selectedItem.value = null
}

const confirmPasswordReset = (user) => {
    selectedUser.value = user
    showPasswordResetModal.value = true
}

const copyPassword = async () => {
    try {
        await navigator.clipboard.writeText(newPassword.value)
        notification.value?.addNotification(
            'Gekopieerd',
            'Wachtwoord is gekopieerd naar het klembord',
            'success'
        )
        // Auto-dismiss notification after 2 seconds
        setTimeout(() => {
            notification.value?.clearNotifications()
        }, 2000)
    } catch (error) {
        notification.value?.addNotification(
            'Kopiëren mislukt',
            'Probeer het wachtwoord handmatig te kopiëren',
            'error'
        )
    }
}

const resetPassword = async () => {
    try {
        isLoading.value = true
        const response = await fetch(`${apiPath}/api/user/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ userId: selectedUser.value.userId })
        })

        const data = await response.json()

        if (response.ok) {
            showPasswordResetModal.value = false
            if (data.newPassword) {
                newPassword.value = data.newPassword
                showNewPasswordModal.value = true
            } else {
                notification.value?.addNotification(
                    'Wachtwoord reset',
                    'Reset instructies zijn verzonden via e-mail',
                    'success'
                )
            }
        } else {
            throw new Error(data.message || 'Failed to reset password')
        }
    } catch (error) {
        console.error('Error resetting password:', error)
        notification.value?.addNotification(
            'Reset mislukt',
            'Er ging iets mis bij het resetten van het wachtwoord',
            'error'
        )
    } finally {
        isLoading.value = false
    }
}

// Watch for tab changes
watch(currentTab, () => {
    fetchItems()
})

// Initial fetch
onMounted(() => {
    fetchItems()
})
</script>