<script setup>
import {onMounted, ref} from "vue";
import {
  CreditCardIcon,
  EnvelopeIcon,
  BanknotesIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
import {format} from "date-fns";
import {db} from "@/db";
import {useRouter} from "vue-router";

let balanceText = ref('$0');
const router = useRouter()

onMounted(() => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';

  db.budget
      .where('balance')
      .startsWith(desiredStartsWith)
      .toArray()
      .then((results) => {
        console.log(results)
        if (results.length > 0) {
          const regexPattern = /_(.*)/;

          const match = results[0].balance.match(regexPattern);
          balanceText.value = '$' + match[1];
        }
      });
})
</script>

<template>
  <main class="pb-200">
    <div class="flex">
      <div
          class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-3">
        Balance: {{ balanceText }}
      </div>
      <div
          class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Savings: $33
      </div>

    </div>
    <h1 class="font-bold text-4xl text-left block mt-5">BrokeFrugal</h1>
    <p class="text-gray-600 text-md mt-2">This app tries to help with tools for living a good life with few money. The goal is having something in the savings account after some time.</p>
    <div class="flex flex-wrap justify-between mt-6">
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/bills" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <CreditCardIcon class="h-10 text-black"/>
          <p class="font-bold text-xs text-center">Account</p>
        </router-link>
      </div>
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/envelopes" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <EnvelopeIcon class="h-10 text-black"/>
          <p class="font-bold text-xs text-center">Envelopes</p>
        </router-link>
      </div>
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/bills" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <BanknotesIcon class="h-10 text-black"/>
          <p class="font-bold text-xs text-center">Saving</p>
        </router-link>
      </div>
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/bills" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <ArrowPathIcon class="h-10 text-black"/>
          <p class="font-bold text-xs text-center">Subscriptions</p>
        </router-link>
      </div>
    </div>
  </main>
</template>
