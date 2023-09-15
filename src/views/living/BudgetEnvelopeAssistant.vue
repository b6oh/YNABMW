<script setup>
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "@heroicons/vue/24/outline";
import {computed, onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import {add, format, sub} from "date-fns";
import {db} from "@/db";
import {useRouter} from "vue-router";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
const router = useRouter()

let balanceText = ref('$0')
let filterText = ref('')
let balance = ref(0);
let balanceCopy = ref(0);
let envelopes = ref([])
let transactions = ref([])
let time = ref(format(new Date(), 'MMMM, yyyy'))
let currentDate = ref(new Date())
let indexTransaction = ref(null)

const open = ref(false)


const backForward = (value) => {
  if (value === 1) {
    time.value = format(sub(new Date(currentDate.value), {
      months: 1,
    }), 'MMMM, yyyy')
    currentDate.value= sub(new Date(currentDate.value), {months: 1})
  }
  if (value === 2) {
    time.value = format(add(new Date(currentDate.value), {
      months: 1,
    }), 'MMMM, yyyy')
    currentDate.value= add(new Date(currentDate.value), {months: 1})
  }
  console.log(envelopes.value)
  transactions.value = envelopes.value[indexTransaction.value].transactions.filter(e => e.month === format(new Date(currentDate.value), 'MM') && e.year === format(new Date(currentDate.value), 'yyyy') );

}

onUnmounted(() => {
  envelopes.value.forEach((el) => {
    db.envelopes.update(el.id, {balance: el.balance})
  })
})

const showTransactions = (tr, index) => {
  transactions.value = tr.filter(e => e.month === format(new Date(currentDate.value), 'MM') && e.year === format(new Date(currentDate.value), 'yyyy') );
  open.value = true
  indexTransaction.value = index;
}

onMounted(() => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';
  db.envelopes
      .toArray()
      .then((results) => {
        envelopes.value = results
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
          balance.value = match[1];
          balanceCopy.value = match[1];
          recalc()

        }
      });
})

const calcAmount = (transactions) => {
  let sumByYearAndMonth = {};

  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    let key = transaction.year + '-' + transaction.month; // Erstelle einen Schlüssel aus year und month

    if (sumByYearAndMonth[key]) {
      sumByYearAndMonth[key] += transaction.amount;
    } else {
      sumByYearAndMonth[key] = transaction.amount;
    }
  }
  return sumByYearAndMonth
}

const recalc = (index) => {

  let sum = 0;


  console.log(index)

  envelopes.value.forEach(el => {
    if (el.balance === '' || el.balance === null) {
      sum += 0;
    } else {
      sum += parseFloat(el.balance);
    }
  })

  balanceCopy.value = (balance.value - sum).toFixed(2)
  if (balanceCopy.value < 0) {
    envelopes.value[index].balance = 0;
    recalc()
  }

}

const filteredTransactions = computed(() => {
  const filter = filterText.value.toLowerCase();
  return transactions.value.filter((tr) => tr.what.toLowerCase().includes(filter));
});



</script>
<template>
  <main class="pb-24 relative">
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div class="px-4 sm:px-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-2xl mb-10 font-semibold leading-6 text-gray-900">Transactions</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="open = false">
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center justify-between px-2">
                      <ChevronLeftIcon class="h-7" @click="backForward(1)"/>
                      <p class="font-bold">{{time}}</p>
                      <ChevronRightIcon class="h-7" @click="backForward(2)"/>

                    </div>
                    <div class="relative mt-6 flex-1 px-4 sm:px-6">
                      <div class="relative mt-2 rounded-md shadow-sm">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input type="text"  v-model="filterText" name="search" id="search" class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Search payee" />
                      </div>
                      <div class="flex justify-between mt-3">
                        <strong class="text-sm">Total:</strong>

                        <p class="ml-auto inline-flex h-fit self-center flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          ${{filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toFixed(2) }}
                        </p>

                      </div>

                      <div v-if="filteredTransactions.length > 0">
                        <div class="mt-3">
                          <div v-for="tr in filteredTransactions" class="flex border-b-2 border-gray-100 justify-between bg-white py-2 my-2">
                            <div class="flex flex-col">
                              <p class="font-bold text-sm">{{tr.what}}</p>
                              <p class="text-xs">{{tr.date}}</p>
                            </div>
                            <p class="ml-auto inline-flex h-fit self-center flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">${{tr.amount.toFixed(2)}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
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
    <h1 class="font-bold text-4xl text-left block mt-5">Assistant</h1>
    <p class="text-gray-600 text-md mt-2">Assign your money to the envelopes</p>
    <div class="flex justify-between items-center my-5">
      <div :class="[balanceCopy < 0 ? 'bg-red-50' : 'bg-green-50']"
           class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-md font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        To assign: ${{ balanceCopy }}
      </div>
    </div>
    <div class="mt-10">
      <div v-if="envelopes.length === 0">
        <p class="text-md mb-3">You don't have any envelopes yet. Create one.</p>
        <router-link to="/budget/new-envelope" class="mt-3 rounded-md bg-indigo-900 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm">Create Envelope</router-link>

      </div>
      <div v-for="(person, index) in envelopes" :key="person.id" class="bg-white py-5 px-6 rounded-lg mb-4">
        <h4 class="font-bold text-xs uppercase">Name</h4>
        <p class="text-md mb-3">{{ person.name }}</p>
        <h4 class="font-bold text-xs uppercase">Assigned</h4>
        <small class="text-xs">Balance: ${{balanceCopy}}</small>

        <div class="mb-3">
          <div class="mt-2">
            <input type="number" v-model="person.balance" @input="recalc(index)" name="bills" id="bills"
                   class="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="39"/>
          </div>
        </div>
        <h4 class="font-bold text-xs uppercase" v-if="person.transactions">Transactions</h4>
        <div class="text-md underline cursor-pointer"  @click="showTransactions(person.transactions, index)" v-if="person.transactions">{{
            '$' +  calcAmount(person.transactions)[format(new Date(), 'yyyy-MM')].toFixed(2)
          }}
        </div>
      </div>
    </div>
  </main>
</template>
