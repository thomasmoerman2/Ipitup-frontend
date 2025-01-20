<template>
    <RouterLink to="/profile" class="flex items-center gap-1">
        <AppIcon name="ArrowLeft" size="24" />
        <p class="font-medium text-[1.25rem]">Back</p>
    </RouterLink>

    <div class="w-full flex flex-col items-center justify-center gap-5">
        <RouterLink to="/profile/customize" class="w-max flex justify-center">
            <SettingsAvatar edit="true" />
        </RouterLink>
        <p class="text-sm text-black-100 lowercase">@Gebruikersnaam</p>
        <AppSmallButton icon="Globe" version="blue" text="Publieke gebruiker" />
    </div>

    <div class="flex flex-col gap-5">
        <AppInput label="Gebruikersnaam" placeholder="Gebruikersnaam" />
        <AppInput label="E-mail" placeholder="E-mail" />
        <AppInput label="Voornaam" placeholder="Voornaam" />
        <AppInput label="Achternaam" placeholder="Achternaam" />
        <AppInput label="Leeftijd" placeholder="Leeftijd" type="number" />
        <AppButton text="Wijzigingen opslaan" version="primary" icon="false" />
    </div>

    <div class="flex flex-col gap-3">
        <strong>Wachtwoord aanpassen</strong>
        <AppButton text="Wachtwoord wijzigen" version="outline" icon="false" />
    </div>
    <div class="flex flex-col gap-3">
        <strong>Mij uitloggen</strong>
        <AppButton text="Uitloggen" version="3" icon="false" @click="fetch_logout" />
    </div>
    <div class="flex flex-col gap-3">
        <strong>Account verwijderen</strong>
        <p class="text-sm text-black-100"><strong class="text-purple-102 uppercase">Opgelet!</strong> Account verwijderen is een eindige actie. Door deze actie te starten, wordt uw account permanent verwijderd en kunnen alle gegevens die aan uw account zijn gekoppeld, worden verwijderd. Dit kan niet worden teruggedraaid.</p>
        <AppButton text="Account verwijderen" version="2" icon="false" />
    </div>
    <div class="flex flex-wrap gap-3">
        <AppButton text="Credits" version="link" icon="false" />
        <AppButton text="Privacybeleid" version="link" icon="false" />
        <AppButton text="Cookiebeleid" version="link" icon="false" />
        <AppButton text="Disclaimer" version="link" icon="false" />
    </div>

</template>

<script setup>
import SettingsAvatar from '@/components/Settings/Avatar.vue';
import AppSmallButton from '@/components/App/SmallButton.vue';
import AppButton from '@/components/App/Button.vue';
import AppInput from '@/components/App/Input.vue';
import AppIcon from '@/components/App/Icon.vue';

const fetch_logout = async () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('exerciseData');
    localStorage.removeItem('appPrepared');
    window.location.href = '/';
}

</script>