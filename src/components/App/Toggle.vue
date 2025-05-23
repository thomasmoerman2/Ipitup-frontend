<template>
  <div class="flex gap-2">
    <label v-for="(item, key) in items" :key="key" :for="`toggle_${toggleId}_${key}`" class="flex items-center gap-2 w-max cursor-pointer">
      <input :type="type" :name="name" :id="`toggle_${toggleId}_${key}`" class="hidden" :value="item" :checked="type === 'radio' ? modelValue === item : modelValue.includes(item)" @change="toggleItem(item)" />
      <span class="py-2 px-2.5 rounded-xl transition" :class="type === 'radio'
        ? modelValue === item ? 'bg-blue-54 text-black-5' : 'bg-blue-18 text-blue-84'
        : modelValue.includes(item) ? 'bg-blue-54 text-black-5' : 'bg-blue-18 text-blue-84'">
        {{ item }}
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => ['items', 'items', 'items']
  },
  modelValue: {
    type: [Array, String, Number],
    default: () => []
  },
  type: {
    type: String,
    default: 'checkbox',
    validator: (value) => ['radio', 'checkbox'].includes(value)
  },
  name: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// Generate unique ID for this toggle instance
const toggleId = ref('');

onMounted(() => {
  toggleId.value = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
});

const toggleItem = (item) => {
  if (props.type === 'radio') {
    emit('update:modelValue', item);
    emit('change', {
      item,
      selected: true,
      selectedItems: item
    });
    return;
  }

  const newValue = [...props.modelValue];
  const index = newValue.indexOf(item);

  if (index === -1) {
    newValue.push(item);
  } else {
    newValue.splice(index, 1);
  }

  emit('update:modelValue', newValue);
  emit('change', {
    item,
    selected: index === -1,
    selectedItems: newValue
  });
};
</script>
