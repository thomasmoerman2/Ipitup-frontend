<template>
  <RouterLink to="/profile" class="flex items-center gap-1">
    <AppIcon name="ArrowLeft" :size="24" />
    <p class="font-medium text-[1.25rem]">Back</p>
  </RouterLink>

  <div class="w-full flex flex-col items-center justify-center gap-5">
    <RouterLink to="/profile/customize" class="w-max flex justify-center">
      <SettingsAvatar :id="userId" edit="true" />
    </RouterLink>
    <div class="flex flex-col items-center">
      <p class="font-bold mb-[0.3125rem]">{{ formData.firstname }} {{ formData.lastname }}</p>
    </div>
    <AppSmallButton icon="Globe" :version="formData.accountStatus === 'Public' ? 'blue' : 'orange'" :text="formData.accountStatus === 'Public'
      ? 'Publieke gebruiker'
      : 'Privé gebruiker'
      " @click="toggleAccountStatus" />
  </div>

  <form class="flex flex-col gap-5" @submit.prevent="handleSave">
    <AppInput label="Voornaam" placeholder="Voornaam" v-model="formData.firstname" :disabled="isLoading" />
    <AppInput label="Achternaam" placeholder="Achternaam" v-model="formData.lastname" :disabled="isLoading" />
    <AppInput label="E-mail" placeholder="E-mail" v-model="formData.email" :disabled="isLoading" />
    <AppButton text="Wijzigingen opslaan" version="primary" icon="false" type="submit" :disabled="isLoading" />
  </form>

  <div class="flex flex-col gap-3">
    <strong>Wachtwoord aanpassen</strong>
    <AppButton v-if="!showPasswordInput" text="Wachtwoord wijzigen" version="outline" icon="false" @click="showPasswordInput = true" />
    <div v-if="showPasswordInput" class="flex flex-col gap-3">
      <AppInput label="Huidig wachtwoord" type="password" placeholder="Huidig wachtwoord" v-model="passwordData.currentPassword" :disabled="isLoading" />
      <AppInput label="Nieuw wachtwoord" type="password" placeholder="Nieuw wachtwoord" v-model="passwordData.newPassword" :disabled="isLoading" />
      <AppButton text="Bevestigen" version="primary" icon="false" @click="handlePasswordChange" :disabled="isLoading" />
      <AppButton text="Annuleren" version="outline" icon="false" @click="cancelPasswordChange" />
    </div>
  </div>

  <div class="flex flex-col gap-3">
    <strong>Mij uitloggen</strong>
    <AppButton text="Uitloggen" version="3" icon="false" @click="handleLogout" :disabled="isLoading" />
  </div>
  <div class="flex flex-col gap-3">
    <strong>Account verwijderen</strong>
    <div v-if="showDeleteInput" class="flex flex-col gap-3">
      <AppInput v-model="deletePassword" type="password" placeholder="Huidig wachtwoord" class="border-gray-300 rounded-md" />
      <p class="text-sm text-black-100">
        <strong class="text-black-100 uppercase">Opgelet!</strong> Account
        verwijderen is een eindige actie. Door deze actie te starten, wordt uw
        account permanent verwijderd en kunnen alle gegevens die aan uw account
        zijn gekoppeld, worden verwijderd. Dit kan niet worden teruggedraaid.
      </p>
      <AppButton text="Bevestigen" version="primary" :disabled="!deletePassword" icon="false" @click="handleAccountDeletion" />
      <AppButton text="Annuleren" version="outline" icon="false" @click="cancelAccountDeletion" />
    </div>
    <AppButton text="Account verwijderen" version="4" icon="false" @click="showDeleteInput = true" v-if="!showDeleteInput" />
  </div>

  <div class="flex flex-wrap gap-3">
    <AppButton v-for="policy in policies" :key="policy.id" :text="policy.name" :link="policy.url" version="link" icon="false" />
  </div>
  <AppNotification ref="notification" />
</template>

<script setup>
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppButton from "@/components/App/Button.vue";
import AppInput from "@/components/App/Input.vue";
import AppIcon from "@/components/App/Icon.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import AppNotification from "@/components/App/Notification.vue";


const router = useRouter();
const notification = ref(null);
const isLoading = ref(false);
const userId = Cookies.get("userId") || "";
const policies = ref([]);
const deleteConfirmation = ref("");
const showDeleteInput = ref(false);
const deletePassword = ref("");

const showPasswordInput = ref(false);
const passwordData = ref({
  currentPassword: "",
  newPassword: "",
});


// Form data with initial values from cookies
const formData = ref({
  firstname: Cookies.get("userFirstname") || "",
  lastname: Cookies.get("userLastname") || "",
  email: Cookies.get("userEmail") || "",
  username: "@" + (Cookies.get("userFirstname") || "").toLowerCase(),
  accountStatus: Cookies.get("accountStatus") || "Private",
});

const handleSave = async () => {
  if (!isEmailValid.value) {
    notification.value?.addNotification(
      "Ongeldige e-mail",
      "Voer een geldig e-mailadres in.",
      "error"
    );
    return;
  }

  try {
    isLoading.value = true;
    const authToken = Cookies.get("authToken");
    const userId = Cookies.get("userId");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          firstname: formData.value.firstname,
          lastname: formData.value.lastname,
          email: formData.value.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    Cookies.set("userFirstname", formData.value.firstname);
    Cookies.set("userLastname", formData.value.lastname);
    Cookies.set("userEmail", formData.value.email);

    notification.value?.addNotification(
      "Profiel bijgewerkt",
      "Je wijzigingen zijn opgeslagen",
      "success"
    );

  } catch (error) {
    console.error("Save error:", error);
    notification.value?.addNotification(
      "Opslaan mislukt",
      "Er ging iets mis bij het opslaan van je wijzigingen",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};


// Add auth check on mount
onMounted(() => {
  if (!Cookies.get("authToken")) {
    router.push("/login");
  }
});

const handleLogout = async () => {
  try {
    isLoading.value = true;
    const authToken = Cookies.get("authToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    // Clear all cookies

    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userFirstname");
    Cookies.remove("userLastname");
    Cookies.remove("userEmail");
    Cookies.remove("accountStatus");
    Cookies.remove("isAdmin");
    Cookies.remove("userLeaderboardScore");
    Cookies.remove("totalScore");
    Cookies.remove("activitiesCount");
    Cookies.remove("badgeCount");
    Cookies.remove("followers");
    Cookies.remove("following");

    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
    notification.value.addNotification(
      "Uitloggen mislukt",
      "Er ging iets mis. Probeer het opnieuw.",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

const toggleAccountStatus = async () => {
  try {
    isLoading.value = true;
    const newStatus =
      formData.value.accountStatus === "Public" ? "Private" : "Public";

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/accountstatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ accountStatus: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update account status");
    }

    formData.value.accountStatus = newStatus;
    Cookies.set("accountStatus", newStatus, { expires: 1 });

    notification.value?.addNotification(
      "Accountstatus gewijzigd",
      `Je account is nu ${newStatus === "Public" ? "publiek" : "privé"}`,
      "success"
    );
  } catch (error) {
    console.error("Error toggling account status:", error);
    notification.value?.addNotification(
      "Wijzigen mislukt",
      "Er ging iets mis bij het wijzigen van je accountstatus",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

const handleAccountDeletion = async () => {
  if (!deletePassword.value) {
    notification.value?.addNotification(
      "Fout",
      "Je moet je huidige wachtwoord invoeren om door te gaan",
      "error"
    );
    return;
  }

  try {
    isLoading.value = true;
    const authToken = Cookies.get("authToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword: deletePassword.value }),  // Huidig wachtwoord verzenden
      }
    );

    if (!response.ok) {
      const error = await response.json();
      notification.value?.addNotification("Fout", error.message, "error");
      return;
    }

    // Verwijder cookies en stuur naar de homepagina
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("userFirstname");
    Cookies.remove("userLastname");
    Cookies.remove("userEmail");
    Cookies.remove("accountStatus");
    Cookies.remove("isAdmin");

    notification.value?.addNotification(
      "Account verwijderd",
      "Je account is succesvol verwijderd",
      "success"
    );

    router.push("/");
  } catch (error) {
    console.error("Error deleting account:", error);
    notification.value?.addNotification(
      "Verwijderen mislukt",
      "Er ging iets mis bij het verwijderen van je account",
      "error"
    );
  } finally {
    isLoading.value = false;
    showDeleteInput.value = false;
    deletePassword.value = "";
  }
};


const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
});

const handlePasswordChange = async () => {
  try {
    isLoading.value = true;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/password/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("authToken")}`,
      },
      body: JSON.stringify({
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      notification.value?.addNotification("Fout", error.message, "error");
      return;
    }

    // Wachtwoord succesvol bijgewerkt
    notification.value?.addNotification("Wachtwoord gewijzigd", "Je wachtwoord is succesvol aangepast", "success");

    // Verberg de wachtwoordvelden
    showPasswordInput.value = false;
    passwordData.value.currentPassword = "";
    passwordData.value.newPassword = "";

  } catch (error) {
    console.error("Error updating password:", error);
    notification.value?.addNotification("Fout", "Er ging iets mis bij het wijzigen van je wachtwoord", "error");
  } finally {
    isLoading.value = false;
  }
};




const cancelPasswordChange = () => {
  showPasswordInput.value = false;
  passwordData.value.currentPassword = "";
  passwordData.value.newPassword = "";
};

const cancelAccountDeletion = () => {
  showDeleteInput.value = false; // Verberg het invoerveld voor wachtwoord
  deletePassword.value = ""; // Wis het ingevoerde wachtwoord
};




</script>
