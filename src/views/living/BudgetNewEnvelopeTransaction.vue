<script setup>
import {computed, onMounted, ref} from "vue";
import {format} from "date-fns";
import {db} from "@/db";
import {useRoute, useRouter} from "vue-router";
import {ChevronRightIcon} from "@heroicons/vue/20/solid";
const route = useRoute();
const router = useRouter();

let balanceText = ref('$0')
let envelopeName = ref('')
let balanceMain = ref(null)
let clickedSug = ref(false)
let what = ref('')
let balanceId = ref(null)
let memos = ref([])
let balance = ref(null)
let formStatus = ref('')
let formStatus2 = ref('')
let amount = ref(null)
let envelopeDescription = ref('')
let envelopeBalance = ref('$0')
function generateFourDigitUUID() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let uuid = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters.charAt(randomIndex);
  }
  return uuid;
}
const saveTransaction = async (type) => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';
  if (!amount.value && !what.value) {
    formStatus.value = 'Please enter a value'
    formStatus2.value = 'Please enter a memo'
    return;
  }
  if (!amount.value && what.value) {
    formStatus.value = 'Please enter a value'
    return;
  }
  if (amount.value && !what.value) {
    formStatus2.value = 'Please enter a memo'
    return;
  }
  let current = await db.envelopes
      .get(parseInt(route.params.id.toString()))

  let balanceC = parseFloat(current.balance)
  let amountC = parseFloat(amount.value)
  if (balanceC < amountC) {
    amount.value = null;
    formStatus.value = 'You don\'t have that money'
    return
  }
  balanceMain.value -= amountC


  db.envelopes
      .update(parseInt(route.params.id.toString()), {
        balance:  (balanceC - amountC).toFixed(2),
      })
  envelopeBalance.value =  '$' + (balanceC - amountC).toFixed(2)
  db.budget.update(balanceId.value, {balance: desiredStartsWith + (balanceMain.value - amountC).toFixed(2)})
  balanceText.value = (balanceMain.value - amountC).toFixed(2)
  if (current.transactions === undefined) {
    db.envelopes
        .update(parseInt(route.params.id.toString()), {
          transactions: [{
            id: generateFourDigitUUID(),
            amount: amountC,
            date: format(new Date(), 'MMM. do hh:mm aaa, yyyy'),
            what: what.value,
            year: format(new Date(), 'yyyy'),
            month: format(new Date(), 'MM')

          }]
        })
  } else {
    let transactions = current.transactions;
    transactions.push({
      id: generateFourDigitUUID(),
      amount: amountC,
      date: format(new Date(), 'MMM. do hh:mm aaa, yyyy'),
      what: what.value,
      year: format(new Date(), 'yyyy'),
      month: format(new Date(), 'MM')
    })

    db.envelopes
        .update(parseInt(route.params.id.toString()), {
          transactions: transactions
        })

  }

  const memos = await db.memos.where('name').equals(what.value).first();

  console.log(memos)

  if (!memos) {
    db.memos.add({
      name: what.value
    })
  }


  if (type === 1) {
    router.go(-1)
  }
  if (type === 2) {
    amount.value = ''
    what.value = ''
  }

}

const sug = (memo) => {
  what.value = memo
  clickedSug.value = true
}

onMounted(async () => {
  const desiredStartsWith = format(new Date(), 'MM-yyyy') + '_';

  const routeName =  await route.params.id;

  memos.value = await db.memos.toArray()
  console.log(memos.value)

  db.envelopes
      .where('id')
      .equals(parseInt(routeName.toString()))
      .toArray().then((result) => {
    envelopeName.value = result[0].name
    envelopeDescription.value = result[0].description
    envelopeBalance.value = '$' + parseInt(result[0].balance).toFixed(2)
    balance.value = parseInt(result[0].balance).toFixed(2)
  })


  db.budget
      .where('balance')
      .startsWith(desiredStartsWith)
      .toArray()
      .then((results) => {
        if (results.length > 0) {
          const regexPattern = /_(.*)/;
          balanceId.value = results[0].id
          const match = results[0].balance.match(regexPattern);
          balanceText.value = match[1];
          balanceMain.value = match[1];
        }
      });

})

const filteredMemos= computed(() => {
  const filter = what.value.toLowerCase();
  return memos.value.filter((tr) => tr.name.toLowerCase().includes(filter));
});
</script>
<template>
  <main class="pb-24">
    <div class="flex">
      <div
          class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-3">
        Balance: ${{ balanceText }}
      </div>
      <div
          class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Savings: $33
      </div>

    </div>
    <h1 class="font-bold text-4xl text-left block mt-5">{{ envelopeName }}</h1>
    <p class="text-gray-600 text-md mt-2">{{ envelopeDescription }}</p>


    <div class="flex justify-between items-center my-5">
      <div class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-md font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-3">
        {{ envelopeBalance }}
      </div>
    </div>

    <div class="mt-5">
      <div class="mt-2">
        <label for="bills" @input="stats" class="block text-sm font-medium leading-6 text-gray-900">Amount</label>
        <input type="number" v-model="amount" name="bills" id="bills" class="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6" placeholder="0.50" />
      </div>
      <p class="text-xs mt-2" v-if="amount > 0">{{  (100 / balance * amount).toFixed(2) }}% of Enevelope</p>
      <p class="text-xs mt-1"  v-if="amount > 0">{{  (100 / balanceMain * amount).toFixed(2)}}% of Budget</p>
      <p class="text-xs text-red-800">{{formStatus}}</p>
    </div>
    <div class="mt-2">
      <div>
        <label for="bills" class="block text-sm font-medium leading-6 text-gray-900">Payee</label>
        <input type="text" v-model="what" @input="clickedSug = false" name="bills" id="bills" class="block pl-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6" placeholder="Take Away" />
      </div>
      <ul role="list" class="divide-y divide-white/5 mt-2" v-if="!clickedSug">
        <li v-for="memo in filteredMemos" v-if="what.length > 0" @click="sug(memo.name)" :key="memo.id" class="relative rounded flex justify-between px-2 items-center space-x-4 py-1 bg-white">
                  <span class="truncate">{{ memo.name }}</span>
                  <span class="absolute inset-0" />
          <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
        </li>
      </ul>
      <p class="text-xs text-red-800">{{formStatus2}}</p>

      <button @click="saveTransaction(1)" type="submit" class="mt-8 w-full rounded-md mr-2 bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm">Save</button>
      <button @click="saveTransaction(2)" type="submit" class="mt-3 w-full rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm">Save and add another</button>

    </div>

  </main>
</template>
