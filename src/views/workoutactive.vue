<template>
  <AppLoading v-if="loading" />
  <div class="flex flex-col" v-else>
    <video ref="video" autoplay playsinline muted :class="{ 'camera-flipped': isFrontCamera }"></video>
    <canvas ref="canvas" :class="{ 'camera-flipped': isFrontCamera }"></canvas>
    <button class="camera-toggle" @click="toggleCamera">Switch Camera</button>

    <p :key="score" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9998] text-blue-60 text-8xl font-bold score-pop">
      {{ score }}
    </p>

    <!-- Show countdown -->
    <div class="absolute top-8 left-1/2 transform -translate-x-1/2 z-[9998] bg-black bg-opacity-50 px-6 py-3 rounded-lg">
      <p :key="countdown" class="text-white text-6xl font-bold countdown-animation">{{ countdown }}</p>
    </div>

    <!-- Display hold time -->

    <!-- Modified Time's Up popup -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div class="bg-white p-8 rounded-xl shadow-lg text-center w-[90%] max-w-md">
        <div class="bg-blue-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <span class="text-blue-60 text-3xl">🎉</span>
        </div>
        <h2 class="text-2xl font-bold text-blue-60 mb-2">Great Job!</h2>
        <p class="text-gray-600 mb-4">You've completed your workout</p>
        <div class="bg-blue-6 rounded-lg p-4 mb-6">
          <div class="flex justify-center items-center gap-3">
            <span class="text-blue-60">Score:</span>
            <span class="text-3xl font-bold text-blue-60 score-animate">{{ displayScore }}</span>
          </div>
        </div>
        <div class="flex gap-4 justify-center">
          <button @click="restartWorkout" class="bg-blue-60 text-white px-6 py-3 rounded-lg hover:bg-blue-30 transition-colors">
            Try Again
          </button>
          <RouterLink to="/workout" class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors" @click="saveActivity">
            Back
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Modified Get Ready popup with collapsible instructions -->
    <div v-if="showGetReadyPopup" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[9998] w-[90%] max-w-md get-ready-slide-up">
      <div class="bg-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center gap-4 mb-4">
          <div :class="[
            'rounded-lg p-3 transition-colors duration-300',
            instructionsOpen ? 'bg-gray-200' : 'bg-blue-60'
          ]">
            <h2 class="text-xl font-bold" :class="instructionsOpen ? 'text-blue-60' : 'text-white'">
              {{ getReadyCountdown }}
              <span v-if="instructionsOpen" class="text-sm block">paused</span>
            </h2>
          </div>
          <div>
            <h1 class="text-xl font-bold text-blue-60">{{ exerciseData.exerciseName }}</h1>
            <p class="text-sm text-gray-600">Get ready for your workout!</p>
          </div>
        </div>

        <div class="bg-blue-6 rounded-lg p-4 mb-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-blue-60">Time:</span>
              <span class="font-bold">{{ exerciseData.exerciseTime }}s</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-blue-60">Type:</span>
              <span class="font-bold">{{ exerciseData.exerciseType }}</span>
            </div>
          </div>
        </div>

        <!-- Collapsible Instructions -->
        <details class="mb-4 cursor-pointer" @toggle="instructionsOpen = $event.target.open">
          <summary class="text-blue-60 font-medium mb-2 hover:text-blue-30 transition-colors">
            View Instructions
          </summary>
          <div class="bg-gray-50 rounded-lg p-4 mt-2">
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ exerciseData.exerciseInstructions.replace(/<br>/g, '\n') }}</p>
          </div>
        </details>

        <RouterLink to="/workout" class="block w-full bg-blue-60 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-30 transition-colors">
          Cancel
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import { Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import AppLoading from "@/components/App/Loading.vue";
import { useRoute } from 'vue-router';

const route = useRoute();

const loading = ref(true);
const isFrontCamera = ref(false);
const currentStream = ref(null);
const score = ref(0);
const video = ref(null);
const canvas = ref(null);
const countdown = ref(30);
const savedScore = ref(0);

const URL = "/my_model/";
let model = null;
let maxPredictions = 0;
const modelLoaded = ref(false);

// Add countdown logic
let countdownInterval;

const showPopup = ref(false);
let isWorkoutActive = ref(true);

const showGetReadyPopup = ref(true);
const getReadyCountdown = ref(10);
let getReadyInterval;
let exerciseTimer;

// Add this ref at the top with other refs
const pullUpInterval = ref(null);

const hasScored = ref(false);

let holdInterval = null;
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

const exercise = ref(route.params.exercise);

console.log("exercise ->", exercise.value);
const exerciseData = ref(null);

// Add these refs after other refs
const isPageActive = ref(true);
const cameraEnabled = ref(true);

// Add this ref at the top with other refs
const countdownStarted = ref(false);

// Add this ref at the top with other refs
const instructionsOpen = ref(false);

// Add these refs at the top
const animatingScore = ref(false);
const displayScore = ref(0);
const finalScore = ref(0);

const func_preload = async () => {
  try {
    loading.value = true;
    countdownStarted.value = false;

    // Fetch exercise data
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercise/${exercise.value}`)
    const data = await response.json();
    exerciseData.value = data;
    console.log("exerciseData loaded ->", exerciseData.value);

    // Initialize camera smoothly
    await new Promise(resolve => setTimeout(resolve, 300));
    startCamera();
    enableCamera();

    // Set countdown value
    countdown.value = exerciseData.value.exerciseTime || 30;

    // Smooth transition to workout
    await new Promise(resolve => setTimeout(resolve, 800));
    loading.value = false;

    // Start get ready sequence
    showGetReadyPopup.value = true;
    isWorkoutActive.value = false;
    getReadyCountdown.value = 10;

    // Clear any existing intervals
    if (exerciseTimer) clearInterval(exerciseTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    // Start get ready countdown with smoother transition
    exerciseTimer = setInterval(() => {
      // Only countdown if instructions are not open
      if (!instructionsOpen.value) {
        if (getReadyCountdown.value > 1) {
          setTimeout(() => {
            getReadyCountdown.value--;
          }, 100);
        } else {
          clearInterval(exerciseTimer);
          showGetReadyPopup.value = false;
          isWorkoutActive.value = true;

          // Add small delay before starting main countdown
          setTimeout(() => {
            if (!countdownStarted.value) {
              countdownStarted.value = true;
              countdownInterval = setInterval(() => {
                if (countdown.value > 0) {
                  setTimeout(() => {
                    countdown.value--;
                  }, 100);
                } else {
                  clearInterval(countdownInterval);
                  countdownStarted.value = false;
                  isWorkoutActive.value = false;
                  savedScore.value += score.value;
                  showPopup.value = true;
                  animateScore(); // Start score animation when workout completes
                }
              }, 1000);
            }
          }, 500);
        }
      }
    }, 1000);
  } catch (error) {
    console.error("Error in func_preload:", error);
    loading.value = false;
  }
}

func_preload();

// Teachable Machine model configuration

// Lifecycle hooks


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

// Add this function after other function declarations
const disableCamera = async () => {
  if (currentStream.value && cameraEnabled.value) {
    // Pause video instead of stopping tracks
    if (video.value) {
      video.value.pause();
    }
    // Disable but don't stop tracks
    currentStream.value.getTracks().forEach((track) => {
      track.enabled = false;
    });
    cameraEnabled.value = false;
  }
};

const enableCamera = async () => {
  if (currentStream.value && !cameraEnabled.value) {
    // Resume video
    if (video.value) {
      video.value.play();
    }
    // Re-enable tracks
    currentStream.value.getTracks().forEach((track) => {
      track.enabled = true;
    });
    cameraEnabled.value = true;
  }
};

// Modify startCamera function to check page active state
const startCamera = async () => {
  try {
    // Only start if page is active
    if (!isPageActive.value) return;

    // Gracefully stop any existing stream first
    if (currentStream.value) {
      currentStream.value.getTracks().forEach((track) => {
        track.stop();
        return new Promise(resolve => setTimeout(resolve, 200));
      });
    }

    // Rest of existing startCamera code...
    await new Promise(resolve => setTimeout(resolve, 300));

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera.value ? "user" : "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    if (video.value) {
      video.value.srcObject = stream;
      currentStream.value = stream;
      cameraEnabled.value = true;

      await new Promise((resolve) => {
        video.value.onloadedmetadata = () => {
          video.value.play().then(() => {
            setTimeout(resolve, 300);
          });
        };
      });

      initPoseDetection();
    }
  } catch (error) {
    console.error("Camera error:", error);
  }
};

const toggleCamera = async () => {
  // Add loading state during camera switch
  loading.value = true;
  isFrontCamera.value = !isFrontCamera.value;

  try {
    await startCamera();
    // Small delay before removing loading state
    await new Promise(resolve => setTimeout(resolve, 300));
  } finally {
    loading.value = false;
  }
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
    } else {
      console.log("no pose detected");
    }
  });

  const detectPose = async () => {
    await pose.send({ image: video.value });
    requestAnimationFrame(detectPose);
  };

  detectPose();
};
const IsLeftKneeUp = ref(false);
const IsRightKneeUp = ref(false);
const isStandingStraight = ref(0);
const BalanceCompleted = ref("false");

const detectBalance = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  // Calculate angles for both legs
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Average knee angle between both legs
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  // Check if knees are up
  if (leftKneeAngle > 60) {
    console.log("LEFT KNEES UP");
    IsLeftKneeUp.value = true;
  }
  if (rightKneeAngle > 60) {
    console.log("RIGHT KNEES UP");
    IsRightKneeUp.value = true;
  }

  // Check if standing straight
  if (avgKneeAngle < 20) {
    console.log("STANDING STRAIGHT");
    if (isStandingStraight.value === 0) {
      isStandingStraight.value = 1;
      console.log(isStandingStraight.value);
    }
    if (isStandingStraight.value === 1) {
      isStandingStraight.value = 2;
      console.log(isStandingStraight.value);
    }
  }

  // Increment score only when both knees have been up and user is standing straight again
  if (
    isStandingStraight.value === 2 &&
    IsLeftKneeUp.value &&
    IsRightKneeUp.value &&
    !hasScored.value
  ) {
    score.value++;
    hasScored.value = true;
  }

  // Reset the state when user is standing straight again
  if (avgKneeAngle >= 20 && hasScored.value) {
    isStandingStraight.value = 0;
    IsLeftKneeUp.value = false;
    IsRightKneeUp.value = false;
    hasScored.value = false;
  }
};

const detectSquads = (landmarks) => {
  if (!isWorkoutActive.value) return;
  console.log("SQUADS DETECTED");
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];

  // Calculate angles for both legs
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Average knee angle between both legs
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  const currentTime = Date.now();
  console.log(avgKneeAngle);
  // Check if person is in squat position (knees bent around 90 degrees)
  if (
    avgKneeAngle <= 100 && // Allow some flexibility around 90 degrees
    avgKneeAngle >= 80 &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    isInDownPosition.value = true;
  }
  // Check if person has returned to standing position
  else if (avgKneeAngle > 10 && isInDownPosition.value) {
    score.value++;
    isInDownPosition.value = false;
    lastRepTime.value = currentTime;
  }
};

// Add this helper function to calculate angles
const calculateAngle = (pointA, pointB, pointC) => {
  const vectorAB = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };
  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y,
  };

  // Calculate dot product
  const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;

  // Calculate magnitudes
  const magnitudeAB = Math.sqrt(
    vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y
  );
  const magnitudeBC = Math.sqrt(
    vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y
  );

  // Calculate angle in radians and convert to degrees
  const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
  return angle * (180 / Math.PI);
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
    score.value++;
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
    score.value++;
    lastRepTime.value = currentTime;
    lastKneePosition.value = "right";
  }
  // Reset when both knees are below hips
  else if (leftKnee.y > leftHip.y && rightKnee.y > rightHip.y) {
    lastKneePosition.value = "none";
  }
};

// // Helper functions
// const calculateDistance = (pointA, pointB) => {
//   const dx = pointA.x - pointB.x;
//   const dy = pointA.y - pointB.y;
//   const dz = pointA.z - pointB.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// };

// const calculateArmLength = (leftElbow, leftWrist, leftShoulder) => {
//   const dx = leftElbow.x - leftWrist.x;
//   const dy = leftElbow.y - leftWrist.y;
//   const dz = leftElbow.z - leftWrist.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// };

const detectPullUp = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const nose = landmarks[0];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftFeet = landmarks[27];
  const rightFeet = landmarks[28];

  const avgWristHeight = (leftWrist.y + rightWrist.y) / 2;

  const currentTime = Date.now();
  console.log(predictions.value[0].className, predictions.value[0].probability);

  console.log(predictions.value[1].className, predictions.value[1].probability);

  if (predictions.value[0].probability > 0.8) {
    console.log("Pull-up detected");
    // Check for pull-up without timer
    if (
      nose.y < avgWristHeight &&
      !isInDownPosition.value &&
      currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS &&
      !showPopup.value
    ) {
      console.log("PULL-UP DETECTED!");
      isInDownPosition.value = true;
      lastRepTime.value = currentTime;

      // Start the interval for continuous scoring
      pullUpInterval.value = setInterval(() => {
        score.value++;
      }, 1000);
    } else if (nose.y > avgWristHeight && isInDownPosition.value) {
      console.log("↓ Reset position - user lowered down");
      isInDownPosition.value = false;

      // Clear the interval when user lowers down
      if (pullUpInterval.value) {
        clearInterval(pullUpInterval.value);
        pullUpInterval.value = null;
      }

      // Trigger popup when pull-up is completed
      showPopup.value = true;
    }
  } else {
    console.log("get into position");
  }
};

// Modified detectPushUp function with timing
const detectPushUp = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const leftShoulder = landmarks[11];
  const leftWrist = landmarks[15];

  // Calculate the distance between left shoulder and left wrist
  const distance = calculateDistance(leftShoulder, leftWrist);

  // Define thresholds
  const CLOSE_THRESHOLD = 0.1; // Threshold for "really close"
  const STRETCH_THRESHOLD = 0.15; // Threshold for "arms stretched out"
  console.log(distance);
  // Check if arms are stretched out
  if (distance > STRETCH_THRESHOLD) {
    isInDownPosition.value = false; // Reset the down position
  }

  // Increment score if the distance is below the close threshold and arms were stretched out
  if (distance < CLOSE_THRESHOLD && !isInDownPosition.value) {
    score.value++;
    isInDownPosition.value = true; // Set the down position
    console.log("Push-up detected: left shoulder and wrist are close!");
  }
};

// Add this helper function to calculate distance
const calculateDistance = (pointA, pointB) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Modify the restart function to use the same countdown logic
const restartWorkout = async () => {
  // Clear all intervals
  if (pullUpInterval.value) {
    clearTimeout(pullUpInterval.value);
    pullUpInterval.value = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (exerciseTimer) {
    clearInterval(exerciseTimer);
  }

  // Reset all states
  countdownStarted.value = false;
  showPopup.value = false;
  showGetReadyPopup.value = true;
  getReadyCountdown.value = 5;
  score.value = 0;
  isWorkoutActive.value = false;
  countdown.value = exerciseData.value.exerciseTime;

  // Start get ready countdown
  exerciseTimer = setInterval(() => {
    if (getReadyCountdown.value > 1) {
      getReadyCountdown.value--;
    } else {
      clearInterval(exerciseTimer);
      showGetReadyPopup.value = false;
      isWorkoutActive.value = true;

      // Start main countdown
      if (!countdownStarted.value) {
        countdownStarted.value = true;
        countdownInterval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            clearInterval(countdownInterval);
            countdownStarted.value = false;
            isWorkoutActive.value = false;
            showPopup.value = true;
          }
        }, 1000);
      }
    }
  }, 1000);
};

// Add page visibility handling
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPageActive.value = false;
    disableCamera();
  } else {
    isPageActive.value = true;
  }
});

onMounted(async () => {
  try {
    // Load TensorFlow scripts with smooth timing
    const tfScript = document.createElement("script");
    tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";

    const tmScript = document.createElement("script");
    tmScript.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";

    const loadScripts = new Promise((resolve, reject) => {
      tfScript.onload = () => {
        setTimeout(() => {
          document.head.appendChild(tmScript);
        }, 300);
      };

      tmScript.onload = () => {
        setTimeout(resolve, 300);
      };

      tfScript.onerror = (error) => reject(error);
      tmScript.onerror = (error) => reject(error);
    });

    document.head.appendChild(tfScript);
    await loadScripts;

    // Initialize model with smooth transitions
    await initModel();
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error("Initialization error:", error);
    loading.value = false;
  }
});

// Add to onBeforeUnmount
onBeforeUnmount(() => {
  isPageActive.value = false;
  disableCamera();
});

// Modify existing onUnmounted to include new cleanup
onUnmounted(() => {
  console.log("Component unmounting, cleaning up intervals and camera");
  document.removeEventListener('visibilitychange', () => { });

  // Only fully stop tracks if we're completely unmounting
  if (currentStream.value) {
    currentStream.value.getTracks().forEach((track) => {
      track.stop();
    });
  }

  if (pullUpInterval.value) {
    clearTimeout(pullUpInterval.value);
  }
  if (holdInterval) {
    clearInterval(holdInterval);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (exerciseTimer) {
    clearInterval(exerciseTimer);
  }
});

// Add this function for the score animation
const animateScore = () => {
  animatingScore.value = true;
  displayScore.value = 0;
  finalScore.value = score.value;

  const duration = 1500; // 1.5 seconds
  const start = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    displayScore.value = Math.floor(progress * finalScore.value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      animatingScore.value = false;
    }
  };

  requestAnimationFrame(animate);
};

// Add function to save activity
const saveActivity = async () => {
  try {
    const activityData = {
      exerciseId: exerciseData.value.exerciseId,
      score: score.value,
      duration: exerciseData.value.exerciseTime - countdown.value
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activityData)
    });

    if (!response.ok) {
      throw new Error('Failed to save activity');
    }

    console.log('Activity saved successfully');
  } catch (error) {
    console.error('Error saving activity:', error);
  }
};

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

@keyframes countdownPop {
  0% {
    opacity: 0;
    transform: scale(1.5);
  }

  20% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.countdown-animation {
  animation: countdownPop 0.9s ease-out;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translate(-50%, 100%);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.get-ready-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

/* Add styles for the details element */
details>summary {
  list-style: none;
}

details>summary::-webkit-details-marker {
  display: none;
}

details>summary::after {
  content: '▼';
  display: inline-block;
  margin-left: 0.5rem;
  transition: transform 0.2s;
}

details[open]>summary::after {
  transform: rotate(180deg);
}

/* Add transition for countdown background */
.transition-colors {
  transition-property: background-color, color;
  transition-timing-function: ease-in-out;
  transition-duration: 300ms;
}

@keyframes scoreAnimate {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.score-animate {
  animation: scoreAnimate 0.3s ease-out;
}
</style>
