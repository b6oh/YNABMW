<script setup>
import {
  TrashIcon,
  PlusCircleIcon, ChevronLeftIcon, MagnifyingGlassIcon, ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import {computed, onMounted, ref} from "vue";
import {add, format, sub} from "date-fns";
import {db} from "@/db";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

let balanceText = ref('$0')
let envelopeName = ref('')
let filterText = ref('')
let balance = ref(null)
let transactions = ref([])
let envelope = ref([])
let hasBalance = ref(null)
let envelopeDescription = ref('')
let envelopeBalance = ref('$0')
let time = ref(format(new Date(), 'MMMM, yyyy'))
let currentDate = ref(new Date())
const deleteTransaction = async (id, amount) => {
  const newTransactions = transactions.value.filter(item => item.id !== id);
  let current = await db.envelopes.get(parseInt(route.params.id))
  console.log(current.balance)
  console.log(amount)
  db.envelopes.update(parseInt(route.params.id), {
    transactions: JSON.parse(JSON.stringify(newTransactions)),
    balance: (parseFloat(current.balance) + parseFloat(amount)).toFixed(2)
  })

  envelopeBalance.value = '$' + (parseFloat(current.balance) + parseFloat(amount)).toFixed(2)

  let a = await db.envelopes.get(parseInt(route.params.id))
  if (a.transactions === undefined) {
    transactions.value = [];
  } else {
    transactions.value = a.transactions.filter(e => e.month === format(new Date(currentDate.value), 'MM') && e.year === format(new Date(currentDate.value), 'yyyy'));
    ;
  }
}

const deleteEnvelope = async () => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';

  let current = await db.envelopes.get(parseInt(route.params.id))

  db.budget
      .where('balance')
      .startsWith(desiredStartsWith)
      .toArray()
      .then((results) => {
        console.log(results)
        if (results.length > 0) {
          const regexPattern = /_(.*)/;

          const match = results[0].balance.match(regexPattern);
          balanceText.value = '$' + (parseFloat(match[1]) + parseFloat(filteredTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)));
          db.budget.update(results[0].id, {
            balance: desiredStartsWith + (parseFloat(match[1]) + parseFloat(filteredTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)))
          })
        }
      });

  await db.budget
      .where('balance')
      .startsWith(desiredStartsWith)

  await db.envelopes
      .where('id')
      .equals(parseInt(parseInt(route.params.id))).delete()


  router.go(-1)

}

onMounted(async () => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';

  const routeName = await route.params.id;


  db.envelopes
      .where('id')
      .equals(parseInt(routeName.toString()))
      .toArray().then((result) => {
    if (result[0].transactions) {
      transactions.value = result[0].transactions.reverse().filter(e => e.month === format(new Date(currentDate.value), 'MM') && e.year === format(new Date(currentDate.value), 'yyyy'));
    }
    envelope.value = result[0]
    envelopeName.value = result[0].name
    envelopeDescription.value = result[0].description
    envelopeBalance.value = '$' + result[0].balance
    balance.value = result[0].balance
    if (result[0].balance > 0) {
      hasBalance.value = true;
    }
  })


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
          ;
        }
      });
})

const backForward = (value) => {
  if (value === 1) {
    time.value = format(sub(new Date(currentDate.value), {
      months: 1,
    }), 'MMMM, yyyy')
    currentDate.value = sub(new Date(currentDate.value), {months: 1})
  }
  if (value === 2) {
    time.value = format(add(new Date(currentDate.value), {
      months: 1,
    }), 'MMMM, yyyy')
    currentDate.value = add(new Date(currentDate.value), {months: 1})
  }
  console.log(transactions.value)
  transactions.value = envelope.value.transactions.filter(e => e.month === format(new Date(currentDate.value), 'MM') && e.year === format(new Date(currentDate.value), 'yyyy'));

}

const filteredTransactions = computed(() => {
  const filter = filterText.value.toLowerCase();
  return transactions.value.filter((tr) => tr.what.toLowerCase().includes(filter));
});
</script>
<template>
  <main class="pb-24">
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
    <h1 class="font-bold text-4xl text-left block mt-5">{{ envelopeName }}</h1>
    <p class="text-gray-600 text-md mt-2">{{ envelopeDescription }}</p>


    <div class="flex justify-between items-center my-5">
      <div v-if="balance > 0"
           class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-md font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-3">
        Balance: {{ envelopeBalance }}
      </div>
    </div>


    <div class="mt-6" v-if="hasBalance">
      <div class="flex flex-wrap justify-between">
        <div class="pr-2 pt-2 w-1/2">
          <router-link :to="{path: '/budget/new-envelope-transaction/' + route.params.id}"
                       class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
            <PlusCircleIcon class="text-black h-10"/>
            <p class="font-bold text-xs text-center">New transaction</p>
          </router-link>
        </div>
      </div>
      <div class="mt-4 f-full">

        <h3 class="text-xl font-bold mt-6">Transactions</h3>
        <div class="flex items-center justify-between my-4 w-full">
          <ChevronLeftIcon class="h-7" @click="backForward(1)"/>
          <p class="font-bold">{{ time }}</p>
          <ChevronRightIcon class="h-7" @click="backForward(2)"/>

        </div>
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
          </div>
          <input type="text" v-model="filterText" name="search" id="search"
                 class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Search payee"/>
        </div>
        <p v-if="filteredTransactions.length === 0" class="my-6">You have no transactions yet</p>
        <div v-if="filteredTransactions.length > 0" class="mt-6">
          <div class="mt-3">
            <div class="flex justify-between my-6">
              <strong class="text-sm">Total:</strong>

              <p class="ml-auto inline-flex h-fit self-center flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                ${{ filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toFixed(2) }}
              </p>

            </div>
            <div v-for="tr in filteredTransactions" :key="tr.id"
                 class="flex justify-between bg-white rounded-lg px-4 py-2 my-2">
              <div class="flex flex-col">
                <p class="font-bold text-sm">{{ tr.what }}</p>
                <p class="text-xs">{{ tr.date }}</p>
              </div>
              <p class="ml-auto inline-flex h-fit self-center flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                ${{ tr.amount.toFixed(2) }}</p>
              <TrashIcon @click="deleteTransaction(tr.id, tr.amount)" class="h-4 ml-2 self-center"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4">
      <p>You currently have no balance in this envelope. Please use the assistant to asign money.</p>
    </div>
    <button @click="deleteEnvelope" type="button"
            class="mt-3 rounded-md bg-red-900 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm">Delete this
      Envelope
    </button>

  </main>
</template>
