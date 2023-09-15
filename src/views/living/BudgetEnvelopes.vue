<script setup>
import {
  BellIcon,
  BanknotesIcon,
  BoltIcon,
  BookOpenIcon,
  CakeIcon,
  CalculatorIcon,
  ClockIcon,
  CloudIcon,
  ComputerDesktopIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FilmIcon,
  FlagIcon,
  HomeIcon,
  HeartIcon,
  KeyIcon,
  LightBulbIcon,
  LockClosedIcon,
  MapIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  PaintBrushIcon,
  PaperClipIcon,
  PencilIcon,
  PrinterIcon,
  ShoppingBagIcon,
  TvIcon,
  TruckIcon,
  Battery0Icon,
  PuzzlePieceIcon,
  Battery100Icon,
  PlusCircleIcon,
  HandRaisedIcon,
  SunIcon,
  ChevronLeftIcon
} from "@heroicons/vue/24/outline";
import {onMounted, ref} from "vue";
import {format} from "date-fns";
import {db} from "@/db";
import {useRouter} from "vue-router";


let balanceText = ref('$0')
let envelopes = ref([])
const router = useRouter()
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
        }
      });
})
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
    <h1 class="font-bold text-4xl text-left block mt-5">Envelopes</h1>
    <p class="text-gray-600 text-sm mt-2">Go through the month, save and budget with the money left.</p>
    <div class="flex flex-wrap justify-between mt-6">
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/new-envelope" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <PlusCircleIcon class="text-black h-10"/>
          <p class="font-bold text-xs text-center">New Envelope</p>
        </router-link>
      </div>
      <div class="pr-2 pt-2 w-1/2">
        <router-link to="/budget/envelope-assistant" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <PuzzlePieceIcon class="text-black h-10"/>
          <p class="font-bold text-xs text-center">Assistant</p>
        </router-link>
      </div>
      <div class="pr-2 pt-2 w-1/2" v-for="env in envelopes" :key="env.id">
        <router-link :to="{path: '/budget/envelope/' + env.id }" class="bg-white p-4 w-full h-40 rounded-lg justify-center flex flex-col">
          <SunIcon class="text-black h-10" v-if="env.icon === 1"/>
          <PuzzlePieceIcon class="text-black h-10" v-if="env.icon === 2"/>
          <HandRaisedIcon class="text-black h-10" v-if="env.icon === 3"/>
          <Battery100Icon class="text-black h-10" v-if="env.icon === 4"/>
          <Battery0Icon class="text-black h-10" v-if="env.icon === 5"/>
          <BellIcon class="text-black h-10" v-if="env.icon === 6"/>
          <BoltIcon class="text-black h-10" v-if="env.icon === 7"/>
          <BookOpenIcon class="text-black h-10" v-if="env.icon === 8"/>
          <CakeIcon class="text-black h-10" v-if="env.icon === 9"/>
          <CalculatorIcon class="text-black h-10" v-if="env.icon === 10"/>
          <ClockIcon class="text-black h-10" v-if="env.icon === 11"/>
          <CloudIcon class="text-black h-10" v-if="env.icon === 12"/>
          <ComputerDesktopIcon class="text-black h-10" v-if="env.icon === 13"/>
          <FaceFrownIcon class="text-black h-10" v-if="env.icon === 14"/>
          <FaceSmileIcon class="text-black h-10" v-if="env.icon === 15"/>
          <FilmIcon class="text-black h-10" v-if="env.icon === 16"/>
          <FlagIcon class="text-black h-10" v-if="env.icon === 17"/>
          <HomeIcon class="text-black h-10" v-if="env.icon === 18"/>
          <HeartIcon class="text-black h-10" v-if="env.icon === 19"/>
          <KeyIcon class="text-black h-10" v-if="env.icon === 20"/>
          <LightBulbIcon class="text-black h-10" v-if="env.icon === 21"/>
          <LockClosedIcon class="text-black h-10" v-if="env.icon === 22"/>
          <MapIcon class="text-black h-10" v-if="env.icon === 23"/>
          <MusicalNoteIcon class="text-black h-10" v-if="env.icon === 24"/>
          <NewspaperIcon class="text-black h-10" v-if="env.icon === 25"/>
          <PaintBrushIcon class="text-black h-10" v-if="env.icon === 26"/>
          <PaperClipIcon class="text-black h-10" v-if="env.icon === 27"/>
          <PencilIcon class="text-black h-10" v-if="env.icon === 28"/>
          <PrinterIcon class="text-black h-10" v-if="env.icon === 29"/>
          <ShoppingBagIcon class="text-black h-10" v-if="env.icon === 30"/>
          <TvIcon class="text-black h-10" v-if="env.icon === 31"/>
          <TruckIcon class="text-black h-10" v-if="env.icon === 32"/>
          <p class="font-bold text-xs text-center">{{ env.name }}</p>
          <div class="info w-full text-center">
            <strong class="text-lg text-center text-green-700" v-if="env.balance">${{env.balance}}</strong>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>
