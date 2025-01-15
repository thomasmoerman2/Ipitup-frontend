<template>
    <div class="w-full flex flex-col items-center justify-center gap-10">
        <button class="w-max flex justify-center">
            <SettingsAvatar />
        </button>
        <p class="text-sm text-black-100 lowercase">@Gebruikersnaam</p>
    </div>
    <AppInput label="Gebruikersnaam" placeholder="Gebruikersnaam" />
    <AppInput label="E-mail" placeholder="E-mail" />
    <AppInput label="Voornaam" placeholder="Voornaam" />
    <AppInput label="Achternaam" placeholder="Achternaam" />
    <AppInput label="Leeftijd" placeholder="Leeftijd" type="number" />
    <AppButton text="Wijzigingen opslaan" version="primary" icon="false" />
    <div class="flex flex-col gap-3">
        <strong>Wachtwoord aanpassen</strong>
        <AppButton text="Wachtwoord wijzigen" version="outline" icon="false" />
    </div>
    <div class="flex flex-col gap-3">
        <strong>Mij uitloggen</strong>
        <AppButton text="Uitloggen" version="3" icon="false" />
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
import AppHeader from '@/components/App/Header.vue';
import SettingsAvatar from '@/components/Settings/Avatar.vue';
import AppButton from '@/components/App/Button.vue';
import AppInput from '@/components/App/Input.vue';
import AppNavigation from '@/components/App/Navigation.vue';
</script>