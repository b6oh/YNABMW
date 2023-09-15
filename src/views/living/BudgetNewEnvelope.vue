<script setup>
import {BanknotesIcon, PlusCircleIcon, CurrencyDollarIcon, SunIcon, ChevronLeftIcon} from "@heroicons/vue/24/outline";
import {computed, onMounted, ref} from "vue";
import {format} from "date-fns";
import {db} from "@/db";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/vue/20/solid";
import {Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions} from "@headlessui/vue";
import {useRouter} from "vue-router";


const router = useRouter();


let balanceText = ref('$0')
const people = ref([])
const name = ref('')
const description = ref('')
const icon = ref(1)
const formStatus = ref('')

const saveEnvelope = async () => {
  if (name.value.length < 2) {
    formStatus.value = 'Please enter a name'
    return;
  }
  await db.envelopes.add({name: name.value, balance: null, icon: icon.value, description: description.value});
  router.go(-1)
}

onMounted(() => {


  fetch('/icons.json').then(res => res.json()).then(data => {
    console.log(data)
    for (let i = 0; i < data.length; i++)
      people.value.push({id: i, num: data[i].num, name: data[i].name})
  })

  people.value = people.value.reverse()
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
    <h1 class="font-bold text-4xl text-left block mt-5">New Envelope</h1>
    <form @submit.prevent="saveEnvelope" class="mt-5">
      <div>
        <label for="icon" class="block text-sm font-medium leading-6 text-gray-900">Icon</label>
        <select id="icon" name="location" v-model="icon" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option v-for="icon in people" :value="icon.num">{{ icon.name }}</option>
        </select>
      </div>
      <div class="mt-2">
        <label for="bills" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <input type="text" v-model="name" name="bills" id="bills" class="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" placeholder="Name" />
      </div>
      <div class="col-span-full mt-4">
        <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Description (optional)</label>
        <div class="mt-2">
          <textarea id="about" v-model="description" name="about" placeholder="For what is this envelope?" rows="3" class="block w-full p-3 text-md rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" />
        </div>
      </div>
      <p class="text-xs text-red-950">{{formStatus}}</p>
      <button type="submit" class="mt-3 rounded-md bg-black w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </form>
  </main>
</template>
