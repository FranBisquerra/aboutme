<template>
  <Navbar/>
  <slot/>
  <Footer/>
</template>

<script setup lang="ts">
import Navbar from '../pages/front/components/Navbar.vue'
import Footer from '../pages/front/components/Footer.vue'
</script>
