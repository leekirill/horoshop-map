<script setup>
import { computed } from 'vue'

const props = defineProps({ cities: Array, searchValue: String, isOpen: Boolean })
const emit = defineEmits(['searchValue, selectCity', 'selectIsOpen'])
const arrowClass = computed(() => (props.isOpen ? 'arrow-icon arrow-icon--active' : 'arrow-icon'))

// const selectIsOpen
const handleInput = (e) => emit('searchValue', e.target.value)
const selectCity = (e) => emit('selectCity', e)
const selectIsOpen = () => emit('selectIsOpen')
</script>

<template>
  <form class="sidebar__form">
    <div class="sidebar__select" @click="selectIsOpen">
      <div class="sidebar__select sidebar__select--selected-item">
        <span>
          <slot />
        </span>
        <img :class="arrowClass" src="../assets/arrow-icon.svg" alt="arrow-icon" />
      </div>
      <Transition>
        <ul class="sidebar__select-list" v-show="isOpen">
          <li
            class="sidebar__select-item"
            v-for="(city, i) in props.cities"
            @click.stop="selectCity"
            :key="i"
          >
            {{ city.name }}
          </li>
        </ul>
      </Transition>
    </div>
    <div class="sidebar__search">
      <img
        class="sidebar__search-icon"
        :style="{ opacity: props.searchValue ? 1 : 0.3 }"
        src="../assets/search-icon.svg"
        alt="search-icon"
      />
      <input class="sidebar__input" @input="handleInput" placeholder="Search" />
    </div>
  </form>
</template>

<style></style>
