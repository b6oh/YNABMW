import { createRouter, createWebHistory } from 'vue-router'
import BudgetHome from "@/views/BudgetHome.vue";
import BillsView from "@/views/BudgetBillsView.vue";
import BudgetEnvelopes from "@/views/living/BudgetEnvelopes.vue";
import BudgetNewEnvelope from "@/views/living/BudgetNewEnvelope.vue";
import BudgetEnvelopeDetail from "@/views/living/BudgetEnvelopeDetail.vue";
import BudgetNewEnvelopeTransaction from "@/views/living/BudgetNewEnvelopeTransaction.vue";
import BudgetEnvelopeAssistant from "@/views/living/BudgetEnvelopeAssistant.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BudgetHome
    },
    {
      path: '/budget/bills',
      name: 'budget-bills',
      component: BillsView
    },
    {
      path: '/budget/envelope/:id',
      name: 'budget-envelope-detail',
      component: BudgetEnvelopeDetail
    },
    {
      path: '/budget/envelope-assistant',
      name: 'budget-envelope-assistant',
      component: BudgetEnvelopeAssistant
    },
    {
      path: '/budget/new-envelope-transaction/:id',
      name: 'budget-new-envelope-transaction',
      component: BudgetNewEnvelopeTransaction
    },
    {
      path: '/budget/envelopes',
      name: 'budget-envelopes',
      component: BudgetEnvelopes
    },
    {
      path: '/budget/new-envelope',
      name: 'budget-new-envelope',
      component: BudgetNewEnvelope
    },

  ]
})

export default router
