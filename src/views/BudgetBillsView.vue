<script setup>
import {onMounted, ref} from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid";
import {format} from "date-fns";
import {db} from "@/db";
import {useRouter} from "vue-router";
let time = ref(format(new Date(), 'MMMM'))

let balance = ref('')
let balanceText = ref('$0')
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
          balanceText.value =  '$' + match[1];
        }
      });
})

const saveMonth = async () => {

  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';
  db.budget
      .where('balance')
      .startsWith(desiredStartsWith)
      .toArray()
      .then((results) => {
        console.log(results)
        if (results.length > 0) {
          const result = results[0];
          balanceText.value =  '$' + balance.value;
          db.budget.update(result.id, { balance: desiredStartsWith + balance.value });
        } else {
          balanceText.value =  '$' + balance.value;
          db.budget.add({ balance: desiredStartsWith + balance.value });
        }
      })
      .catch((error) => {
        console.error('Fehler beim Suchen des Eintrags:', error);
      });


  let current = await db.envelopes
      .toArray()

  current.forEach(el => {
    db.envelopes
        .update(el.id, {balance: null})
  })

  router.go(-1)


}

</script>

<template>
  <main class="pb-200">
    <div class="flex">
      <div class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-3">Balance: {{balanceText}}</div>
      <div class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Savings: $33</div>

    </div>
    <h1 class="font-bold text-4xl text-left block mt-4">Balance</h1>
    <div class="mt-2">
      <p class="mb-5 text-md">After you paid all bills for this month, how much money is left? When you change this value, the balance of all envelops will be set to zero, that you can assign the money.</p>
      <form @submit.prevent="saveMonth">
        <div class="mt-2">
          <input type="number" v-model="balance" name="bills" id="bills" class="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="403" />
        </div>
        <button type="submit" class="mt-3 rounded-md bg-indigo-900 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm">Save</button>
      </form>

    </div>
  </main>
</template>
