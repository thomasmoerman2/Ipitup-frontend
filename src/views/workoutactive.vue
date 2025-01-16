<template>
  <div class="camera-container">
    <video ref="videoElement" autoplay playsinline class="camera-feed"></video>
    <button @click="switchCamera" class="switch-camera-btn">
      <i class="fas fa-sync-alt"></i>
      Switch Camera
    </button>

    <!-- Prediction results -->
    <div class="prediction-container">
      <div
        v-for="(prediction, index) in predictions"
        :key="index"
        class="prediction-item"
      >
        {{ prediction.className }}: {{ prediction.probability.toFixed(2) }}
      </div>

      <!-- Push-up counter -->
      <div class="counter-item">Push-ups: {{ pushUpCount }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const videoElement = ref(null);
const stream = ref(null);
const usingFrontCamera = ref(true);
const predictions = ref([]);

// Teachable Machine model configuration
const URL = "./my_model/";
let model = null;

const initModel = async () => {
  try {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await window.tmImage.load(modelURL, metadataURL);
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

const pushUpCount = ref(0);
let lastPredictionWasHigh = false;

const predict = async () => {
  if (!model || !videoElement.value) return;

  try {
    // Create a canvas element to capture the current video frame
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.value.videoWidth;
    canvas.height = videoElement.value.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement.value, 0, 0);

    // Run prediction on the canvas
    const prediction = await model.predict(canvas);
    predictions.value = prediction;

    // Check second prediction (assuming it's the push-up position)
    // Only increment counter when probability goes from low to high
    if (prediction[1]?.probability >= 0.5) {
      if (!lastPredictionWasHigh) {
        pushUpCount.value++;
        lastPredictionWasHigh = true;
      }
    } else {
      lastPredictionWasHigh = false;
    }
  } catch (error) {
    console.error("Prediction error:", error);
  }
};

// Set up prediction loop
let predictionLoop = null;
const startPredictionLoop = () => {
  predictionLoop = setInterval(async () => {
    await predict();
  }, 100); // Predict every 100ms
};

const startCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: usingFrontCamera.value ? "user" : "environment",
      },
    };

    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.value.srcObject = stream.value;

    // Wait for video to be ready before starting predictions
    videoElement.value.onloadeddata = () => {
      startPredictionLoop();
    };
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
  }
  if (predictionLoop) {
    clearInterval(predictionLoop);
  }
};

const switchCamera = async () => {
  usingFrontCamera.value = !usingFrontCamera.value;
  await stopCamera();
  await startCamera();
};

// Load external scripts
const loadExternalScripts = () => {
  const tensorflowScript = document.createElement("script");
  tensorflowScript.src =
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";

  const teachableMachineScript = document.createElement("script");
  teachableMachineScript.src =
    "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

  // Wait for both scripts to load before initializing
  return Promise.all([
    new Promise((resolve) => {
      tensorflowScript.onload = resolve;
      document.head.appendChild(tensorflowScript);
    }),
    new Promise((resolve) => {
      teachableMachineScript.onload = resolve;
      document.head.appendChild(teachableMachineScript);
    }),
  ]);
};

// Modified onMounted to load scripts first
onMounted(async () => {
  await loadExternalScripts();
  await initModel();
  await startCamera();
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<style scoped>
.camera-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.switch-camera-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-camera-btn:active {
  background-color: rgba(255, 255, 255, 0.4);
}

.prediction-container {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
}

.prediction-item {
  color: white;
  font-size: 16px;
  margin: 5px 0;
}

.counter-item {
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
