<template>
  <RouterLink to="/profile" class="flex items-center gap-1">
    <AppIcon name="ArrowLeft" :size="24" />
    <p class="font-medium text-[1.25rem]">Back</p>
  </RouterLink>

  <div class="w-full flex flex-col items-center justify-center gap-5">
    <RouterLink to="/profile/customize" class="w-max flex justify-center">
      <SettingsAvatar :id="userId" edit="true" />
    </RouterLink>
    <p class="text-sm text-black-100 lowercase">{{ formData.username }}</p>
    <AppSmallButton icon="Globe" :version="formData.accountStatus === 'Public' ? 'blue' : 'orange'" :text="formData.accountStatus === 'Public'
        ? 'Publieke gebruiker'
        : 'Privé gebruiker'
      " @click="toggleAccountStatus" />
  </div>

  <form class="flex flex-col gap-5" @submit.prevent="handleSave">
    <AppInput label="Voornaam" placeholder="Voornaam" v-model="formData.firstname" :value="formData.firstname" :disabled="isLoading" />
    <AppInput label="Achternaam" placeholder="Achternaam" v-model="formData.lastname" :value="formData.lastname" :disabled="isLoading" />
    <AppInput label="E-mail" placeholder="E-mail" v-model="formData.email" :value="formData.email" :disabled="isLoading" />
    <AppButton text="Wijzigingen opslaan" version="primary" icon="false" type="submit" :disabled="isLoading" />
  </form>

  <div class="flex flex-col gap-3">
    <strong>Wachtwoord aanpassen</strong>
    <AppButton text="Wachtwoord wijzigen" version="outline" icon="false" />
  </div>
  <div class="flex flex-col gap-3">
    <strong>Mij uitloggen</strong>
    <AppButton text="Uitloggen" version="3" icon="false" @click="handleLogout" :disabled="isLoading" />
  </div>
  <div class="flex flex-col gap-3">
    <strong>Account verwijderen</strong>
    <p class="text-sm text-black-100">
      <strong class="text-purple-102 uppercase">Opgelet!</strong> Account
      verwijderen is een eindige actie. Door deze actie te starten, wordt uw
      account permanent verwijderd en kunnen alle gegevens die aan uw account
      zijn gekoppeld, worden verwijderd. Dit kan niet worden teruggedraaid.
    </p>
    <AppButton text="Account verwijderen" version="4" icon="false" />
  </div>
  <div class="flex flex-wrap gap-3">
    <AppButton text="Credits" version="link" icon="false" />
    <AppButton text="Privacybeleid" version="link" icon="false" />
    <AppButton text="Cookiebeleid" version="link" icon="false" />
    <AppButton text="Disclaimer" version="link" icon="false" />
  </div>
  <AppNotification ref="notification" />
</template>

<script setup>
import SettingsAvatar from "@/components/Settings/Avatar.vue";
import AppSmallButton from "@/components/App/SmallButton.vue";
import AppButton from "@/components/App/Button.vue";
import AppInput from "@/components/App/Input.vue";
import AppIcon from "@/components/App/Icon.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import AppNotification from "@/components/App/Notification.vue";

const router = useRouter();
const notification = ref(null);
const isLoading = ref(false);
const userId = Cookies.get("userId") || "";

// Form data with initial values from cookies
const formData = ref({
  firstname: Cookies.get("userFirstname") || "",
  lastname: Cookies.get("userLastname") || "",
  email: Cookies.get("userEmail") || "",
  username: "@" + (Cookies.get("userFirstname") || "").toLowerCase(),
  accountStatus: Cookies.get("accountStatus") || "Private",
});

const handleSave = async () => {
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

    // Update cookies with new values
    Cookies.set("userFirstname", formData.value.firstname);
    Cookies.set("userLastname", formData.value.lastname);
    Cookies.set("userEmail", formData.value.email);

    notification.value?.addNotification(
      "Profiel bijgewerkt",
      "Je wijzigingen zijn opgeslagen",
      "success"
    );

    // Reload page after successful update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
    console.log("authToken ->", authToken);

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
</script>
