<template>
  <Home :profile="profile"/>
  <Experience :profile="profile"/>
  <BackToTop/>
</template>

<script setup lang="ts">
import {useProfile} from '../queries/profile'
import Home from '../components/Home.vue'
import Experience from '../components/Experience.vue'
import BackToTop from '../components/BackToTop.vue'

const {data: profile} = useProfile()
</script>
