<script setup>
import {RouterView, useRoute, useRouter} from 'vue-router'
import {ChevronLeftIcon, CheckCircleIcon} from "@heroicons/vue/20/solid";

const router = useRouter();
const route = useRoute();



</script>

<template>
  <div class="hidden sm:block h-full">
    <div class="flex justify-center h-[100vh] items-center">
      <h1 class="font-bold text-2xl">Please visit this website on a mobile phone</h1>

    </div>
  </div>
  <div class="sm:hidden">
    <div class="absolute w-full max-w-3xl left-1/2 px-5 -translate-x-1/2 pt-5">
      <Router-view v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </Router-view>
    </div>
  </div>
  <button type="button" @click="router.go(-1)" v-if="route.path !== '/'" class="fixed bottom-6 left-6 rounded-full bg-indigo-900 p-3 text-white shadow-sm">
    <ChevronLeftIcon class="h-8 w-8" aria-hidden="true" />
  </button>
  <button type="button" @click="router.go(-1)" v-if="route.path === '/budget/envelope-assistant'" class="fixed bottom-6 left-[90px] rounded-full bg-indigo-900 p-3 text-white shadow-sm">
    <CheckCircleIcon class="h-8 w-8" aria-hidden="true" />
  </button>
</template>
<style>
</style>
