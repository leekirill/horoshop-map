<script setup>
import { defineProps } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import API_KEY from '../api/API_KEY'

const props = defineProps({ location: Object })
</script>

<template>
  <GoogleMap :api-key="API_KEY" style="width: 100%; height: 680px" :center="location" :zoom="15">
    <Marker :options="{ position: props.location }" />
  </GoogleMap>
</template>
<style></style>
