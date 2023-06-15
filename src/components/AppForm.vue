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

<style lang="scss">
.sidebar {
  position: relative;
  background: #fff;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #fff;
    padding: 20px 20px 0px 20px;
    border-bottom: 1px solid #e6e6e6;
  }
  &__select {
    position: relative;
    padding: 10px 14px;
    border-radius: 4px;
    border: none;
    z-index: 1;
    cursor: pointer;
    background: #f2f2f2;
    transition: 250ms;

    &:hover {
      background: #f5f5f5;
    }
  }
  &__select--selected-item {
    display: flex;
    justify-content: space-between;
    padding: 0;
    background: none;
  }

  &__select-list {
    position: absolute;
    width: 100%;
    height: 300px;
    overflow-y: scroll;
    background: #fff;
    top: 40px;
    left: 0;
    margin: 0px 0px;
    border-radius: 0px 0px 4px 4px;
    @media (max-width: 768px) {
      height: 260px;
    }
  }

  &__select-item {
    padding: 14px;
    cursor: pointer;
    transition: 250ms;
    &:hover {
      background: #f2f2f2;
    }
  }
  &__places-list {
    margin: 0;
    overflow-y: scroll;
    height: 558px;
    @media (max-width: 768px) {
      height: 218px;
    }
  }
  &__places-item {
    padding: 18px 20px;
    border-bottom: 1px solid #e6e6e6;
    transition: 250ms;

    h3 {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 14px;
      margin: 0;
    }
    &:hover {
      background: #fafafa;
    }
  }
  &__search {
    display: flex;
    align-items: center;
    &-icon {
      width: 16px;
      height: 16px;
      opacity: 0.3;
      transition: 250ms;
    }
  }
  &__input {
    width: 100%;
    height: 38px;
    padding: 0 20px 0 8px;
    border: 0px solid #fff;
    @media (max-width: 768px) {
      font-size: 16px;
    }
    &:focus {
      outline: none;
    }
  }
}

::-webkit-scrollbar {
  width: 10px;
  background: #fff;
  padding: 0 2px;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  width: 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  border: 2px solid #fff;
}

.arrow-icon {
  transition: 250ms;
  &--active {
    transform: rotate(180deg);
  }
}
</style>
