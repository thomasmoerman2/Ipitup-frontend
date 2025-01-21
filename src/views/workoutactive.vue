<template>
  <video
    ref="video"
    autoplay
    playsinline
    muted
    :class="{ 'camera-flipped': isFrontCamera }"
  ></video>
  <canvas ref="canvas" :class="{ 'camera-flipped': isFrontCamera }"></canvas>
  <button class="camera-toggle" @click="toggleCamera">Switch Camera</button>

  <p
    :key="pushUpCount"
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9998] text-blue-60 text-8xl font-bold score-pop"
  >
    {{ pushUpCount }}
  </p>

  <!-- Show countdown only for pushups -->
  <p
    v-if="$route.path.includes('pushups') || $route.path.includes('core')"
    class="absolute top-8 left-1/2 transform -translate-x-1/2 z-[9998] text-blue-60 text-4xl font-bold"
  >
    {{ countdown }}
  </p>

  <!-- Add popup -->
  <div
    v-if="showPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Time's Up!</h2>
      <p>Completed Workout</p>
      <p>{{ pushUpCount }}</p>
      <div class="flex gap-4 justify-center">
        <button
          @click="restartWorkout"
          class="bg-blue-60 text-white px-4 py-2 rounded hover:bg-blue-30"
        >
          Restart
        </button>
        <RouterLink
          to="/workout"
          class="bg-blue-60 text-white px-4 py-2 rounded hover:bg-blue-30"
        >
          Terug naar menu
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Add get ready popup -->
  <div
    v-if="showGetReadyPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Get Ready!</h2>
      <p class="text-6xl font-bold mb-4">{{ getReadyCountdown }}</p>
      <p class="mb-4">Prepare for your push-up challenge</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const isFrontCamera = ref(false);
const currentStream = ref(null);
const pushUpCount = ref(0);
const video = ref(null);
const canvas = ref(null);
const countdown = ref(30);

const leftArmDistance = ref(0);
const rightArmDistance = ref(0);
const predictions = ref([
  { className: "", probability: 0 },
  { className: "", probability: 0 },
  { className: "", probability: 0 },
]);

const isInDownPosition = ref(false);
const MIN_TIME_BETWEEN_REPS = 500;
const lastRepTime = ref(Date.now());

// Teachable Machine model configuration
const URL = "/my_model/";
let model = null;
let maxPredictions = 0;
const modelLoaded = ref(false);

// Add countdown logic
let countdownInterval;

const showPopup = ref(false);
let isWorkoutActive = ref(true);

const showGetReadyPopup = ref(true);
const getReadyCountdown = ref(5);
let getReadyInterval;
let exerciseTimer;

// Add this ref at the top with other refs
const pullUpInterval = ref(null);

// Lifecycle hooks
onMounted(async () => {
  // Add this line at the start of onMounted

  try {
    const tfScript = document.createElement("script");
    tfScript.src =
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";

    const tmScript = document.createElement("script");
    tmScript.src =
      "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

    const loadScripts = new Promise((resolve, reject) => {
      tfScript.onload = () => {
        document.head.appendChild(tmScript);
      };

      tmScript.onload = () => {
        resolve();
      };

      tfScript.onerror = (error) => reject(error);
      tmScript.onerror = (error) => reject(error);
    });

    document.head.appendChild(tfScript);
    await loadScripts;

    await initModel();
    await startCamera();

    // Start with get ready countdown
    isWorkoutActive.value = false;
    exerciseTimer = setInterval(() => {
      if (getReadyCountdown.value > 1) {
        getReadyCountdown.value--;
      } else {
        clearInterval(exerciseTimer);
        showGetReadyPopup.value = false;
        isWorkoutActive.value = true;

        // Start main countdown only for pushups URL
        const path = window.location.pathname;
        const lastSegment = path
          .split("/")
          .filter((segment) => segment)
          .pop();
        if (lastSegment === "pushups" || lastSegment === "core") {
          countdown.value = 30; // Reset to 30 seconds for pushups and core
          countdownInterval = setInterval(() => {
            if (countdown.value > 0) {
              countdown.value--;
            } else {
              clearInterval(countdownInterval);
              isWorkoutActive.value = false;
              showPopup.value = true;
            }
          }, 1000);
        }
      }
    }, 1000);
  } catch (error) {
    console.error("Initialization error:", error);
  }
});

// Modified initModel function
const initModel = async () => {
  try {
    // Wait for window.tmImage to be available

    let attempts = 0;
    while (!window.tmImage && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (!window.tmImage) {
      throw new Error("Teachable Machine library not loaded");
    }

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
    } catch (error) {
      throw new Error(`Failed to fetch model files: ${error.message}`);
    }

    model = await window.tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    modelLoaded.value = true;
  } catch (error) {
    console.error("Model initialization error:", error);
    // You might want to show this error to the user
  }
};

const predict = async () => {
  if (!modelLoaded.value || !model || !video.value) {
    return;
  }

  try {
    const prediction = await model.predict(video.value);
    for (let i = 0; i < maxPredictions; i++) {
      predictions.value[i] = {
        className: prediction[i].className,
        probability: prediction[i].probability.toFixed(2),
      };
    }
  } catch (error) {
    console.error("Prediction error:", error);
  }
};

const startCamera = async () => {
  if (currentStream.value) {
    currentStream.value.getTracks().forEach((track) => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera.value ? "user" : "environment",
      },
    });

    video.value.srcObject = stream;
    currentStream.value = stream;

    video.value.onloadedmetadata = () => {
      video.value.play();
      initPoseDetection();
    };
  } catch (error) {
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

    if (results.poseLandmarks && modelLoaded.value) {
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

      const path = window.location.pathname;
      const lastSegment = path
        .split("/")
        .filter((segment) => segment)
        .pop();
      if (lastSegment === "pushups") {
        detectPushUp(results.poseLandmarks);
      } else if (lastSegment === "pull") {
        detectPullUp(results.poseLandmarks);
      } else if (lastSegment === "core") {
        detectCore(results.poseLandmarks);
      } else if (lastSegment === "squads") {
        detectSquads(results.poseLandmarks);
      } else if (lastSegment === "balance") {
        detectBalance(results.poseLandmarks);
      }
    }
  });

  const detectPose = async () => {
    await pose.send({ image: video.value });
    requestAnimationFrame(detectPose);
  };

  detectPose();
};
const detectCore = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];

  const currentTime = Date.now();
  const lastKneePosition = ref("none"); // Track which knee was last raised

  // Check left knee above left hip
  if (
    leftKnee.y <= leftHip.y &&
    lastKneePosition.value !== "left" &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    console.log("Left knee raise detected!");
    pushUpCount.value++;
    lastRepTime.value = currentTime;
    lastKneePosition.value = "left";
  }
  // Check right knee above right hip
  else if (
    rightKnee.y <= rightHip.y &&
    lastKneePosition.value !== "right" &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    console.log("Right knee raise detected!");
    pushUpCount.value++;
    lastRepTime.value = currentTime;
    lastKneePosition.value = "right";
  }
  // Reset when both knees are below hips
  else if (leftKnee.y > leftHip.y && rightKnee.y > rightHip.y) {
    lastKneePosition.value = "none";
  }
};

// Helper functions
const calculateDistance = (pointA, pointB) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const calculateArmLength = (leftElbow, leftWrist, leftShoulder) => {
  const dx = leftElbow.x - leftWrist.x;
  const dy = leftElbow.y - leftWrist.y;
  const dz = leftElbow.z - leftWrist.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const detectPullUp = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const nose = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  const avgWristHeight = (leftWrist.y + rightWrist.y) / 2;
  const avgShoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;

  const currentTime = Date.now();

  // Check for pull-up without timer
  if (
    nose.y < avgWristHeight &&
    avgShoulderHeight < avgWristHeight + 0.1 &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    console.log(" PULL-UP DETECTED!");
    isInDownPosition.value = true;
    pushUpCount.value++;
    lastRepTime.value = currentTime;

    // Start the interval
    pullUpInterval.value = setInterval(() => {
      pushUpCount.value++;
    }, 1000);
  } else if (nose.y > avgWristHeight && isInDownPosition.value) {
    console.log("↓ Reset position - user lowered down");
    isInDownPosition.value = false;
    // Clear the interval
    if (pullUpInterval.value) {
      clearInterval(pullUpInterval.value);
      pullUpInterval.value = null;
    }
    // Stop the workout and show completion popup
    isWorkoutActive.value = false;
    showPopup.value = true;
  }
};

// Modified detectPushUp function with timing
const detectPushUp = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  // Calculate distances
  leftArmDistance.value = calculateDistance(leftShoulder, leftWrist);
  rightArmDistance.value = calculateDistance(rightShoulder, rightWrist);
  const avgArmDistance = (leftArmDistance.value + rightArmDistance.value) / 2;
  const avgArmLength = calculateArmLength(leftElbow, leftWrist, leftShoulder);

  const armToShoulderDistance = avgArmDistance - avgArmLength + 0.06;
  const currentTime = Date.now();

  if (
    armToShoulderDistance < avgArmLength &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    isInDownPosition.value = true;
    pushUpCount.value++;
    lastRepTime.value = currentTime;
  } else if (armToShoulderDistance >= avgArmLength && isInDownPosition.value) {
    isInDownPosition.value = false;
  }
};

// Modified restart function to include get ready countdown
const restartWorkout = async () => {
  if (pullUpInterval.value) {
    clearInterval(pullUpInterval.value);
    pullUpInterval.value = null;
  }
  showPopup.value = false;
  showGetReadyPopup.value = true;
  getReadyCountdown.value = 5;
  pushUpCount.value = 0;

  const path = window.location.pathname;
  const lastSegment = path
    .split("/")
    .filter((segment) => segment)
    .pop();
  if (lastSegment === "pushups" || lastSegment === "core") {
    countdown.value = 30; // Only reset to 30 for pushups and core
  }

  // Start with get ready countdown again
  isWorkoutActive.value = false;
  getReadyInterval = setInterval(() => {
    if (getReadyCountdown.value > 1) {
      getReadyCountdown.value--;
    } else {
      clearInterval(getReadyInterval);
      showGetReadyPopup.value = false;
      isWorkoutActive.value = true;

      // Start main workout countdown only for pushups URL
      const path = window.location.pathname;
      const lastSegment = path
        .split("/")
        .filter((segment) => segment)
        .pop();
      if (lastSegment === "pushups" || lastSegment === "core") {
        countdownInterval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            clearInterval(countdownInterval);
            isWorkoutActive.value = false;
            showPopup.value = true;
          }
        }, 1000);
      }
    }
  }, 1000);
};

// Add cleanup when component unmounts
onUnmounted(() => {
  if (pullUpInterval.value) {
    clearInterval(pullUpInterval.value);
  }
});
</script>

<style scoped>
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

@keyframes scorePop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.7);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.score-pop {
  animation: scorePop 0.2s ease-out;
}
</style>
