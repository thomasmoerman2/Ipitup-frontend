<template>
  <Filters v-if="props.title" :text="props.title" @click="func_openDialog" :icon="props.icon" :version="props.version" :filterClass="props.buttonClass" />

  <Transition name="dialog">
    <dialog v-if="isOpen" @click="handleClickOutside" class="z-[66]">
      <div class="dialog-content" @click.stop ref="dialogContent">
        <div class="drag-handle" ref="dragHandle" @mousedown="startDrag" @touchstart="startDrag">
          <span class="opacity-0 text-[5px] block">read-only</span>
        </div>
        <DialogSearch @closeDialog="func_closeDialog" v-if="props.type === 'search'" />
        <DialogSlider @closeDialog="func_closeDialog" v-if="props.type === 'slider'" />
        <DialogFilter @closeDialog="func_closeDialog" @updateFilters="handleFilterUpdate" v-if="props.type === 'filter'" :currentFilters="currentFilters" />
        <DialogWelcomer @closeDialog="func_closeDialog" v-if="props.type === 'welcomer'" />
        <DialogSort :currentSort="currentSort" @updateSort="handleSortUpdate" @closeDialog="func_closeDialog" v-if="props.type === 'sort'" />
        <DialogPodiumFilter :currentFilters="currentFilters" @updateFilters="handleFilterUpdate" @closeDialog="func_closeDialog" v-if="props.type === 'podium-filter'" />
      </div>
    </dialog>
  </Transition>
</template>

<script setup>
import DialogSearch from "@/components/Dialog/Search.vue";
import DialogSlider from "@/components/Dialog/Slider.vue";
import DialogFilter from "@/components/Dialog/Filter.vue";
import DialogPodiumFilter from "@/components/Dialog/PodiumFilter.vue";
import DialogWelcomer from "@/components/Dialog/Welcomer.vue";
import Filters from "@/components/App/Filters.vue";
import DialogSort from "@/components/Dialog/Sort.vue";
import { ref, onUnmounted } from "vue";

const isOpen = ref(false);
const dialogContent = ref(null);
const dragHandle = ref(null);
let startY = 0;
let currentY = 0;
let isDragging = false;

const props = defineProps({
  type: {
    type: String,
    default: "search",
  },
  title: {
    type: String,
  },
  icon: {
    type: String,
    default: "Filter",
  },
  currentFilters: {
    type: Array,
    default: () => [],
  },
  dataset: {
    type: Array,
    default: () => [],
  },
  version: {
    // Voeg deze prop toe
    type: String,
    default: "light",
  },
  buttonClass: {
    type: String,
    default: "",
  },
  currentSort: {
    type: String,
    default: "",
  },
  currentFilters: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["updateFilters", "updateSort"]);

const func_openDialog = () => {
  isOpen.value = true;
};

const func_closeDialog = () => {
  isOpen.value = false;
  resetPosition();
};

const handleClickOutside = (event) => {
  if (event.target.tagName === "DIALOG") {
    func_closeDialog();
  }
};

const handleFilterUpdate = (filters) => {
  emit("updateFilters", filters);
  func_closeDialog();
};

const handleSortUpdate = (sort) => {
  emit("updateSort", sort);
  func_closeDialog();
};

const startDrag = (event) => {
  isDragging = true;
  startY =
    event.type === "mousedown" ? event.clientY : event.touches[0].clientY;
  currentY = 0;

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
};

const drag = (event) => {
  if (!isDragging) return;

  const y =
    event.type === "mousemove" ? event.clientY : event.touches[0].clientY;
  const deltaY = y - startY;

  if (deltaY < 0) return;

  currentY = deltaY;
  dialogContent.value.style.transform = `translateY(${currentY}px)`;
  dialogContent.value.style.transition = "none";
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);

  if (currentY > 150) {
    func_closeDialog();
  } else {
    resetPosition();
  }
};

const resetPosition = () => {
  if (dialogContent.value) {
    dialogContent.value.style.transform = "translateY(0)";
    dialogContent.value.style.transition = "transform 0.3s ease";
  }
};

onUnmounted(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
});
</script>

<style scoped lang="postcss">
dialog {
  @apply border-none bg-transparent w-full h-full fixed top-0 left-0 flex items-end p-0;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

dialog::backdrop {
  background-color: rgba(13, 13, 13, 0.55);
}

.dialog-content {
  @apply w-full h-max bg-black-15 flex flex-col gap-5 items-center px-2 pt-4 pb-6 fixed bottom-0 left-0 z-[55] rounded-3xl;
}

.drag-handle {
  @apply h-3 w-52 rounded-full bg-black-25 cursor-grab;
}

.drag-handle:active {
  @apply cursor-grabbing;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
