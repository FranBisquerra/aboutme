<template>
  <Home :profile="profile"/>
  <Experience :profile="profile"/>
  <BackToTop/>
</template>

<script setup lang="ts">
import {useProfile} from '../../../queries/profile'
import Home from './Home.vue'
import Experience from './Experience.vue'
import BackToTop from '../components/BackToTop.vue'

const {data: profile} = useProfile()
</script>
