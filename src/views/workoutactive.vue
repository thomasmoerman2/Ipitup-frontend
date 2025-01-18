<template>
  <div id="app">
    <!-- Add Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-[rgba(0, 0, 0, 0.4)] flex items-center justify-center z-[9999]"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <div class="mb-4">
          <p class="text-xl font-semibold">Performing pushups</p>
          <p class="text-sm text-gray-600">
            Prepare to perform pushups effectively.
          </p>
        </div>

        <div class="border-t border-blue-60 my-4"></div>
        <p class="text-xl font-semibold">Position</p>
        <p class="text-sm text-gray-600">
          Place your mobile device half a meter in front of you pointing your
          way.
        </p>

        <div class="border-t border-blue-60 my-4"></div>
        <div class="mb-4">
          <p class="text-xl font-semibold">Tips</p>
          <p class="text-sm text-gray-600">
            Keep hands aligned with shoulder, elbows against waist and slowly
            push down
          </p>
        </div>

        <button
          @click="closeModalAndStartCamera"
          class="mt-4 px-4 py-2 bg-blue-60 text-white rounded hover:bg-blue-42"
        >
          I understand
        </button>
      </div>
    </div>

    <!-- Add debug overlay -->
    <div v-if="showDebug" class="debug-overlay">
      <div class="debug-info">
        <p>Left Distance: {{ leftArmDistance.toFixed(3) }}</p>
        <p>Right Distance: {{ rightArmDistance.toFixed(3) }}</p>
        <p>Avg Distance: {{ avgArmDistance }}</p>
        <p>Form Status: {{ formStatus }}</p>
        <p>Position: {{ currentPosition }}</p>
      </div>
    </div>

    <!-- Add loading indicator -->
    <div v-if="!modelLoaded" class="loading-overlay">
      <div class="loading-content">
        <p>Loading model...</p>
        <p class="text-sm">{{ formStatus }}</p>
      </div>
    </div>

    <!-- Existing template content -->
    <video
      ref="video"
      autoplay
      playsinline
      muted
      :class="{ 'camera-flipped': isFrontCamera }"
    ></video>
    <canvas ref="canvas" :class="{ 'camera-flipped': isFrontCamera }"></canvas>
    <button class="camera-toggle" @click="toggleCamera">Switch Camera</button>
    <div class="pushup-counter">Pushups: {{ pushUpCount }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

// State
const isFrontCamera = ref(false);
const currentStream = ref(null);
const pushUpCount = ref(0);
const avgArmDistance = ref(0);
const showModal = ref(true);
const video = ref(null);
const canvas = ref(null);

// Add new refs for debugging
const showDebug = ref(true); // Set to false in production
const leftArmDistance = ref(0);
const rightArmDistance = ref(0);
const predictions = ref([
  { className: "", probability: 0 },
  { className: "", probability: 0 },
  { className: "", probability: 0 },
]);
const formStatus = ref("Waiting for pose...");
const currentPosition = ref("Standing");

// Add state tracking refs
const isInDownPosition = ref(false);

// Add timing constants at the top with other state
const MIN_TIME_BETWEEN_REPS = 500; // Minimum 500ms between reps
const lastRepTime = ref(Date.now());

// Add new refs for tracking arm lengths
const baseArmLength = ref(0);

// Add debug logging function
const debugLog = (message, data = null) => {
  const timestamp = new Date().toISOString().split("T")[1];
  // console.log(`[${timestamp}] ${message}`, data || "");
};

// Teachable Machine model configuration
const URL = "/my_model/";
let model = null;
let maxPredictions = 0;
const isInPosition = ref(false);
const modelLoaded = ref(false);

// Modified initModel function
const initModel = async () => {
  debugLog("Starting model initialization...");

  try {
    // Wait for window.tmImage to be available
    let attempts = 0;
    while (!window.tmImage && attempts < 10) {
      debugLog("Waiting for tmImage to load...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (!window.tmImage) {
      throw new Error("Teachable Machine library not loaded");
    }

    debugLog("tmImage found, loading model...");
    const modelURL = `${URL}model.json`;
    const metadataURL = `${URL}metadata.json`;

    // Verify files exist before loading
    try {
      const modelResponse = await fetch(modelURL);
      const metadataResponse = await fetch(metadataURL);

      if (!modelResponse.ok) {
        throw new Error(`Model file not found: ${modelURL}`);
      }
      if (!metadataResponse.ok) {
        throw new Error(`Metadata file not found: ${metadataURL}`);
      }

      debugLog("Model files verified, loading model...");
    } catch (error) {
      throw new Error(`Failed to fetch model files: ${error.message}`);
    }

    model = await window.tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    modelLoaded.value = true;

    debugLog("Model loaded successfully", {
      classes: maxPredictions,
      modelURL,
      metadataURL,
    });
  } catch (error) {
    debugLog("Error loading model:", error);
    console.error("Model initialization error:", error);
    // You might want to show this error to the user
    formStatus.value = "⚠️ Error loading model";
  }
};

// Modified predict function
const predict = async () => {
  if (!modelLoaded.value || !model || !video.value) {
    debugLog("Predict called but model or video not ready");
    return;
  }

  try {
    const prediction = await model.predict(video.value);
    // Store predictions in a more readable format
    for (let i = 0; i < maxPredictions; i++) {
      predictions.value[i] = {
        className: prediction[i].className,
        probability: prediction[i].probability.toFixed(2),
      };
    }
    debugLog("Prediction result:", predictions.value);
  } catch (error) {
    debugLog("Prediction error:", error);
    console.error("Prediction error:", error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  debugLog("Component mounted");
  try {
    const tfScript = document.createElement("script");
    tfScript.src =
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";

    const tmScript = document.createElement("script");
    tmScript.src =
      "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

    const loadScripts = new Promise((resolve, reject) => {
      tfScript.onload = () => {
        // Just append tmScript after tfScript loads
        document.head.appendChild(tmScript);
      };

      tmScript.onload = () => {
        resolve();
      };

      // Keep error handlers for debugging issues
      tfScript.onerror = (error) => reject(error);
      tmScript.onerror = (error) => reject(error);
    });

    document.head.appendChild(tfScript);
    await loadScripts;
    debugLog("All scripts loaded successfully");
    await initModel();
  } catch (error) {
    debugLog("Initialization error:", error);
    console.error("Initialization error:", error);
  }
});
// Modal handler
const closeModalAndStartCamera = async () => {
  showModal.value = false;
  await startCamera();
};

// Camera functions
const startCamera = async () => {
  debugLog("Starting camera...");

  if (currentStream.value) {
    debugLog("Stopping existing stream");
    currentStream.value.getTracks().forEach((track) => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera.value ? "user" : "environment",
      },
    });

    debugLog("Camera stream obtained", {
      width: stream.getVideoTracks()[0].getSettings().width,
      height: stream.getVideoTracks()[0].getSettings().height,
    });

    video.value.srcObject = stream;
    currentStream.value = stream;

    video.value.onloadedmetadata = () => {
      video.value.play();
      debugLog("Video playback started");
      initPoseDetection();
    };
  } catch (error) {
    debugLog("Camera error:", error);
    console.error("Camera error:", error);
  }
};

const toggleCamera = async () => {
  isFrontCamera.value = !isFrontCamera.value;
  await startCamera();
  initPoseDetection();
};

// Pose detection
const initPoseDetection = () => {
  const ctx = canvas.value.getContext("2d");
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;

  const pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  pose.onResults(async (results) => {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, Pose.CONNECTIONS, {
        color: "lime",
        lineWidth: 4,
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: "#1cb2b7",
        lineWidth: 2,
      });

      // First check position with Teachable Machine
      await predict();

      // Only detect pushups if in correct position
      // if (isInPosition.value) {

      // if (workoutType === "pushups") {
      // console.log("pushups page");
      detectPushUp(results.poseLandmarks);
      // } else if (workoutType === "pullups") {
      //   console.log("pullups page");
      //   detectPullUps(results.poseLandmarks);
      // }
    }
  });

  const detectPose = async () => {
    await pose.send({ image: video.value });
    requestAnimationFrame(detectPose);
  };

  detectPose();
};

// Helper functions
const calculateDistance = (pointA, pointB) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
const detectPullUps = (landmarks) => {};
// Modified detectPushUp function with timing
const detectPushUp = (landmarks) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  // Calculate distances
  leftArmDistance.value = calculateDistance(leftShoulder, leftWrist);
  rightArmDistance.value = calculateDistance(rightShoulder, rightWrist);
  avgArmDistance.value = (leftArmDistance.value + rightArmDistance.value) / 2;

  // Calibrate base arm length if not done yet

  const currentTime = Date.now();
  const DOWN_THRESHOLD = 0.2;
  // DOWN position
  if (
    avgArmDistance.value < DOWN_THRESHOLD &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    isInDownPosition.value = true;
    formStatus.value = "Down position";
    pushUpCount.value++;
    lastRepTime.value = currentTime;
  }
  // UP position (arms straight)
  else if (avgArmDistance.value >= DOWN_THRESHOLD && isInDownPosition.value) {
    isInDownPosition.value = false;
    formStatus.value = "Up position";
  }
};
</script>

<style scoped>
#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

video,
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transform: rotateY(180deg);
}

.camera-flipped {
  transform: scaleX(-1);
}

.camera-toggle {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pushup-counter {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
  z-index: 2;
}

/* Add modal styles if not using Tailwind */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-xl {
  font-size: 1.25rem;
}

.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-600 {
  color: #4b5563;
}

.border-t {
  border-top-width: 1px;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.p-8 {
  padding: 2rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.w-96 {
  width: 24rem;
}

.z-\[55\] {
  z-index: 55;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

/* Add styles for debug overlay */
.debug-overlay {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 100;
  font-family: monospace;
}

.debug-info p {
  margin: 5px 0;
  font-size: 14px;
}

/* Add loading indicator */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
