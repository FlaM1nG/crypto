<template>
  <div v-if="showNotification">
    <p class="notification" :class="notificationTypeFinal">{{ notificationMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from 'vue';

const props = defineProps({
  showNotification: {
    type: Boolean,
    default: false,
  },
  notificationMessage: {
    type: String,
    default: '',
  },
  notificationType: {
    type: String,
    default: '',
  },
});

const showNotification = ref(props.showNotification);
const notificationMessage = ref(props.notificationMessage);
const notificationType = ref(props.notificationType);

const notificationTypeFinal = computed(() => {
  return notificationType.value.includes("error") ? "text-red-600" : "text-green-600";
});

const show = (message: string, type: string) => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const hide = () => {
  showNotification.value = false;
};

watch(showNotification, (newValue) => {
  if (newValue) {
    show(notificationMessage.value, notificationType.value);
    setTimeout(hide, 3000);
  }
});
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  transition: all 1s ease;
}

.notification .message {
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  text-align: center;
}

.notification .success {
  color: green;
}

.notification .error {
  color: red;
}
</style>