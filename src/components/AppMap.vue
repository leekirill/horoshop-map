<script setup>
import { defineProps } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import API_KEY from '../api/API_KEY'

const props = defineProps({ location: Object })
</script>

<template>
  <GoogleMap :api-key="API_KEY" class="map" :center="location" :zoom="15">
    <Marker :options="{ position: props.location }" />
  </GoogleMap>
</template>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 680px;
  @media (max-width: 768px) {
    height: 340px;
  }
}
</style>
