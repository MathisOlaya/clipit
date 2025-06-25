import ApiService from '@/services/ApiService'
import { loadStripe } from '@stripe/stripe-js'
import { ref } from 'vue'

async function handleCheckout() {
  try {
    // Stripe instance
    const stripe = await loadStripe(
      'pk_test_51RdBBq2N2CmERs9FqqTGgJ0ua0fcxWfxpZibTIbueoKSRjLotv9mA7w42PXMTcgnuZCU4EJQINu31JzPtGDQcG5y00d4V9MqQa',
    )

    const response = await ApiService.createCheckoutSession()

    if (response.status === 200) {
      await stripe.redirectToCheckout({ sessionId: response.data.id })
    }
  } catch {}
}
<template>
  <h1>Tarifs</h1>
  <button @click="handleCheckout">Payer</button>
