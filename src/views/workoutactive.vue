<template>
  <video
    ref="video"
    autoplay
    playsinline
    muted
    :class="({ 'camera-flipped': isFrontCamera }, 'cammie')"
  ></video>
  <canvas ref="canvas" :class="{ 'camera-flipped': isFrontCamera }"></canvas>
  <button class="camera-toggle" @click="toggleCamera">Switch Camera</button>

  <p
    :key="score"
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-60 text-8xl font-bold score-pop"
  >
    {{ score }}
  </p>

  <!-- Show countdown only for pushups -->
  <p
    v-if="
      $route.path.includes('1') ||
      $route.path.includes('3') ||
      $route.path.includes('4') ||
      $route.path.includes('5')
    "
    class="absolute top-8 left-1/2 transform -translate-x-1/2 z-[9998] text-blue-60 text-4xl font-bold"
  >
    {{ countdown }}
  </p>

  <!-- Display hold time -->

  <!-- Add popup -->
  <div
    v-if="showPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4">Time's Up!</h2>
      <p>Completed Workout</p>
      <p>{{ score }}</p>
      <div class="flex gap-4 justify-center">
        <button
          @click="restartWorkout"
          class="bg-blue-60 text-white px-4 py-2 rounded hover:bg-blue-30"
        >
          Restart
        </button>
        <button
          @click="fetchPostData"
          class="bg-blue-60 text-white px-4 py-2 rounded hover:bg-blue-30"
        >
          Terug naar menu
        </button>
      </div>
    </div>
  </div>

  <!-- Add get ready popup -->
  <div
    v-if="showGetReadyPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg text-center z-[9999]">
      <h2 class="text-2xl font-bold mb-4">Get Ready!</h2>
      <p class="text-6xl font-bold mb-4">{{ getReadyCountdown }}</p>
      <p class="mb-4">
        Prepare for your {{ exerciseData.exerciseName }} challenge
      </p>
    </div>
  </div>

  <!-- Add explanation modal -->
  <div
    v-if="showExplanationModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
      <h2 class="text-2xl font-bold mb-4">
        Fitness Oefening:
        {{ exerciseData.exerciseName }}
      </h2>
      <p class="text-6xl font-bold mb-4">
        {{ explanationCountdown }}
      </p>
      <div class="mb-4">
        <video autoplay playsinline loop muted>
          <source
            v-if="exerciseData.exerciseType == 'Push'"
            src="/Push.mp4"
            type="video/mp4"
          />
          <source
            v-else-if="exerciseData.exerciseType == 'Pull'"
            src="/Pull.mp4"
            type="video/mp4"
          />
          <source
            v-else-if="exerciseData.exerciseType == 'Squats'"
            src="/Squat.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <button
        @click="skipExplanation"
        class="bg-blue-60 text-white px-4 py-2 rounded hover:bg-blue-30"
      >
        Skip
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from "vue";
import { Pose } from "@mediapipe/pose";
import { useRoute, useRouter } from "vue-router";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Cookies from "js-cookie";
const isFrontCamera = ref(false);
const currentStream = ref(null);
const score = ref(0);
const video = ref(null);
const canvas = ref(null);
const dateStart = ref(Date.now());

const router = useRouter();

const predictions = ref([
  { className: "", probability: 0 },
  { className: "", probability: 0 },
  { className: "", probability: 0 },
]);

const isInDownPosition = ref(false);
const MIN_TIME_BETWEEN_REPS = 500;
const lastRepTime = ref(Date.now());

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

const hasScored = ref(false);

let holdInterval = null;

// Add this ref to track the last push-up score time
const lastPushUpScoreTime = ref(Date.now());
const PUSH_UP_COOLDOWN = 1000; // 1 second cooldown

// Add new refs at the top with other refs
const showExplanationModal = ref(true);
const explanationCountdown = ref(10);
const userLocation = ref(null);
let explanationTimer;

// Add this with other refs at the top of the file
const lastKneePosition = ref("none"); // Track which knee was last raised

const exerciseData = ref({});
const exerciseId = ref(useRoute().params.exercise);

//fetch exercise data
async function fetch_exercise_data() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId.value}`
  );
  const data = await response.json();
  exerciseData.value = data;
}

fetch_exercise_data();


const countdown = ref(exerciseData.value.exerciseTime);

// Add this ref to store the animation frame ID
let poseAnimationFrameId = null;

// Add this function to stop the camera
const stopCamera = () => {
  if (currentStream.value) {
    currentStream.value.getTracks().forEach((track) => track.stop());
    currentStream.value = null;
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await startCamera();

    // Start with explanation modal
    isWorkoutActive.value = false;
    explanationTimer = setInterval(() => {
      if (explanationCountdown.value > 1) {
        explanationCountdown.value--;
      } else {
        clearInterval(explanationTimer);
        showExplanationModal.value = false;
        showGetReadyPopup.value = true;

        // Start get ready countdown
        exerciseTimer = setInterval(() => {
          if (getReadyCountdown.value > 1) {
            getReadyCountdown.value--;
          } else {
            clearInterval(exerciseTimer);
            showGetReadyPopup.value = false;
            isWorkoutActive.value = true;

            // Start main countdown for specific exercises
            const path = window.location.pathname;
            const lastSegment = path
              .split("/")
              .filter((segment) => segment)
              .pop();
            if (lastSegment != "2") {
              countdown.value = 30;
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
      }
    }, 1000);
  } catch (error) {
    //
  }
});

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
    //
  }
};

let ctx = null;

const toggleCamera = async () => {
  isFrontCamera.value = !isFrontCamera.value;
  await startCamera();
  initPoseDetection();
};

// Pose detection
const initPoseDetection = () => {
  ctx = canvas.value.getContext("2d");
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

      const path = window.location.pathname;
      const lastSegment = path
        .split("/")
        .filter((segment) => segment)
        .pop();

      if (lastSegment === "1") {
        detectPushUp(results.poseLandmarks);
      } else if (lastSegment === "2") {
        detectPullUp(results.poseLandmarks);
      } else if (lastSegment === "3") {
        detectCore(results.poseLandmarks);
      } else if (lastSegment === "4") {
        detectBalance(results.poseLandmarks);
      } else if (lastSegment === "5") {
        detectSquats(results.poseLandmarks);
      }
    }
  });

  const detectPose = async () => {
    await pose.send({ image: video.value });
    poseAnimationFrameId = requestAnimationFrame(detectPose);
  };

  detectPose();
};

// Add this function to stop pose detection
const stopPoseDetection = () => {
  if (poseAnimationFrameId) {
    cancelAnimationFrame(poseAnimationFrameId);
    poseAnimationFrameId = null;
  }
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
    //
    IsLeftKneeUp.value = true;
  }
  if (rightKneeAngle > 60) {
    //
    IsRightKneeUp.value = true;
  }

  // Check if standing straight
  if (avgKneeAngle < 20) {
    //
    if (isStandingStraight.value === 0) {
      isStandingStraight.value = 1;
      //
    }
    if (isStandingStraight.value === 1) {
      isStandingStraight.value = 2;
      //
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

const detectSquats = (landmarks) => {
  if (!isWorkoutActive.value) return;
  //
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
  //

  // Check if person is in squat position (knees bent around 90 degrees)
  if (
    avgKneeAngle <= 100 && // Allow some flexibility around 90 degrees
    avgKneeAngle >= 80 &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    isInDownPosition.value = true;
    score.value++; // Increment score once when entering squat position
  }
  // Check if person has returned to standing position
  else if (avgKneeAngle > 100 && isInDownPosition.value) {
    isInDownPosition.value = false; // Reset the down position
    lastRepTime.value = currentTime; // Update the last rep time
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

// Modified detectCore function
const detectCore = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];

  const currentTime = Date.now();

  // Check left knee above left hip
  if (
    leftKnee.y <= leftHip.y &&
    lastKneePosition.value !== "left" &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS
  ) {
    //
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
    //
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
let isStuck = false;
let CurrentLeftFeet;
let CurrentRightFeet;
const StuckPosition = (leftFeet, rightFeet) => {
  //
  if (!isStuck) {
    isStuck = true;

    CurrentLeftFeet = leftFeet;
    CurrentRightFeet = rightFeet;
    //
    //
  } else {
    //
    //
  }
};
const detectPullUp = (landmarks) => {
  if (!isWorkoutActive.value) return;

  const nose = landmarks[0];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftFeet = landmarks[23];
  const rightFeet = landmarks[24];
  const avgWristHeight = (leftWrist.y + rightWrist.y) / 2;
  const currentTime = Date.now();
  const dateStart = ref(Date.now());
  // Store initial feet position
  StuckPosition(leftFeet.y, rightFeet.y);

  // Calculate how much the feet have moved from initial position
  const leftFeetDifference = Math.abs(leftFeet.y - CurrentLeftFeet);
  const rightFeetDifference = Math.abs(rightFeet.y - CurrentRightFeet);
  const MOVEMENT_THRESHOLD = 0.03; // Adjust this value based on testing

  if (
    nose.y < avgWristHeight &&
    !isInDownPosition.value &&
    currentTime - lastRepTime.value > MIN_TIME_BETWEEN_REPS &&
    !showPopup.value &&
    (leftFeetDifference > MOVEMENT_THRESHOLD ||
      rightFeetDifference > MOVEMENT_THRESHOLD)
  ) {
    //
    isInDownPosition.value = true;
    lastRepTime.value = currentTime;

    // Start the interval for continuous scoring
    pullUpInterval.value = setInterval(() => {
      score.value++;
    }, 1000);
  } else if (nose.y > avgWristHeight && isInDownPosition.value) {
    //
    isInDownPosition.value = false;

    // Clear the interval when user lowers down
    if (pullUpInterval.value) {
      clearInterval(pullUpInterval.value);
      pullUpInterval.value = null;
    }

    // Trigger popup when pull-up is completed
    showPopup.value = true;
  }
};
let currentThreshhold;
let onePassingTime = false;

// Modified detectPushUp function with cooldown
const detectPushUp = (landmarks) => {
  if (!isWorkoutActive.value) return;
  const leftShoulder = landmarks[11];
  const leftWrist = landmarks[15];

  if (!onePassingTime) {
    currentThreshhold = (leftWrist.y - leftShoulder.y) / 2;
    onePassingTime = true;
  }

  const CLOSE_THRESHOLD = leftWrist.y - currentThreshhold; // Threshold for "really close"
  //
  //
  const currentTime = Date.now();

  // Check if arms are stretched out
  if (leftShoulder.y < CLOSE_THRESHOLD) {
    isInDownPosition.value = false; // Reset the down position
  }

  // Increment score if the distance is below the close threshold, arms were stretched out, and cooldown has passed
  if (
    leftShoulder.y > CLOSE_THRESHOLD &&
    !isInDownPosition.value &&
    currentTime - lastPushUpScoreTime.value > PUSH_UP_COOLDOWN
  ) {
    score.value++;
    isInDownPosition.value = true; // Set the down position
    lastPushUpScoreTime.value = currentTime; // Update the last score time
    //
  }
};

// Modified restart function to include get ready countdown
const restartWorkout = async () => {
  if (pullUpInterval.value) {
    clearTimeout(pullUpInterval.value);
    pullUpInterval.value = null;
  }
  showPopup.value = false;
  showGetReadyPopup.value = true;
  getReadyCountdown.value = 5;

  const path = window.location.pathname;
  const lastSegment = path
    .split("/")
    .filter((segment) => segment)
    .pop();

  // Only set countdown for specific exercises (not pull-ups)
  if (
    lastSegment === "1" || // pushups
    lastSegment === "3" || // core
    lastSegment === "4" || // squats
    lastSegment === "5" // balance
  ) {
    countdown.value = 30;
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

      // Start main workout countdown only for specific exercises (not pull-ups)
      if (
        lastSegment === "1" || // pushups
        lastSegment === "3" || // core
        lastSegment === "4" || // squats
        lastSegment === "5" // balance
      ) {
        countdownInterval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            clearInterval(countdownInterval);
            isWorkoutActive.value = false;
            showPopup.value = true;
            stopPoseDetection(); // Stop pose detection when workout is finished
          }
        }, 1000);
      }
    }
  }, 1000);
};

// Add cleanup when component unmounts
onUnmounted(() => {
  if (pullUpInterval.value) {
    clearTimeout(pullUpInterval.value);
  }
  if (holdInterval) {
    clearInterval(holdInterval);
  }
  stopCamera();
  ctx = null;
});

const skipExplanation = () => {
  clearInterval(explanationTimer);
  showExplanationModal.value = false;
  showGetReadyPopup.value = true;

  // Start get ready countdown
  exerciseTimer = setInterval(() => {
    if (getReadyCountdown.value > 1) {
      getReadyCountdown.value--;
    } else {
      clearInterval(exerciseTimer);
      showGetReadyPopup.value = false;
      isWorkoutActive.value = true;

      // Start main countdown for specific exercises
      const path = window.location.pathname;
      const lastSegment = path
        .split("/")
        .filter((segment) => segment)
        .pop();
      if (
        lastSegment === "1" ||
        lastSegment === "3" ||
        lastSegment === "4" ||
        lastSegment === "5"
      ) {
        countdown.value = 30;
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

// Add lifecycle hooks
onDeactivated(() => {
  stopCamera();
  ctx.destroy();
  pose = null;
});

onActivated(async () => {
  if (!currentStream.value) {
    await startCamera();
  }
});
const fetchPostData = async () => {
  try {
    if (score.value > 0 && Cookies.get("userId")) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/activities/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Cookies.get("userId"),
            activityScore: score.value,
            activityDuration: Date.now() - dateStart.value,
            activityDate: new Date().toISOString(),
            locationId: 3,
            exerciseId: exerciseData.value.exerciseId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      //fetch updateUserDailyStreak
      const updateUserDailyStreakResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/dailystreak/${Cookies.get(
          "userId"
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );

      const updateUserDailyStreakData =
        await updateUserDailyStreakResponse.json();
    }
    router.push("/workout");
  } catch (error) {
    console.error("Error saving activity:", error);
  }
};
</script>

<style scoped>
.cammie,
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  /* Remove the default flip */
  /* transform: rotateY(180deg); */
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
