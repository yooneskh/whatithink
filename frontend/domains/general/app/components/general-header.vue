<script setup>

const config = useAppConfig();
const user = useUser();


/* logout */

async function logoutUser() {
  await authenticationLogoutUser(useToken(), useUser());
  navigateTo({ name: 'general.home' });
}

</script>


<template>
  <header class="border-b-1">

    <content-container class="flex items-center py-2">

      <nuxt-link class="text-lg" :to="{ name: 'general.home' }">
        {{ config.brand.title }}
      </nuxt-link>

      <div class="grow" />

      <nuxt-link to="https://khoshghadam.com" target="_blank">
        <u-btn
          label="About Me"
          class="soft text-sm"
        />
      </nuxt-link>

    </content-container>

    <slot name="inside-bottom" />

  </header>
</template>