<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-[rgba(0, 0, 0, 0.4)] flex items-center justify-center z-[9999]"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <div class="mb-4">
        <p class="text-xl font-semibold">Performing {{ exerciseType }}</p>
        <p class="text-sm text-gray-600">
          Prepare to perform {{ exerciseType }} effectively.
          <video
            src="../../public/pushups.mp4"
            autoplay
            muted
            loop
            class="w-full h-40"
          >
            Your browser does not support the video tag.
          </video>
        </p>
      </div>

      <div class="border-t border-blue-60 my-4"></div>
      <p class="text-xl font-semibold">Position</p>

      <p v-if="exerciseType === 'pushups'" class="text-sm text-gray-600">
        Place your mobile device half a meter in front of you pointing your way.
      </p>
      <div class="border-t border-blue-60 my-4"></div>

      <div class="mb-4">
        <p class="text-xl font-semibold">Tips</p>
        <p v-if="exerciseType === 'pushups'" class="text-sm text-gray-600">
          Keep hands aligned with shoulder, elbows against waist and slowly push
          down
        </p>
      </div>

      <button
        @click="closeModalAndStartCountdown"
        class="mt-4 px-4 py-2 bg-blue-60 text-white rounded hover:bg-blue-42"
      >
        I understand.
      </button>
    </div>
  </div>
  <p>{{ isPushupDetectorRunning }}</p>
  <p
    class="absolute right-0 bottom-0 bg-blue-60 bg-opacity-20 px-10 p-5 rounded-md text-3xl"
  >
    {{ pushUpCount }}
  </p>

  <p
    class="absolute bg-blue-24 rounded-lg px-10 p-5 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
    v-if="isCameraOn"
    v-show="!removeLabel"
  >
    Get into position
  </p>
  <video
    id="video"
    ref="video"
    autoplay
    playsinline
    class="hidden"
    :style="{ height: videoHeight + 'px', width: 'auto' }"
  ></video>
  <canvas ref="canvas" id="output_canvas" class="mt-4"></canvas>

  <button
    v-if="isCameraOn"
    @click="stopCamera"
    class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  >
    Stop Camera
  </button>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const exerciseType = route.query.exercise;
console.log(exerciseType);

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const isCameraOn = ref(false);
const showModal = ref(true);
const countdown = ref(0);
const isPushupDetectorRunning = ref(null);
const removeLabel = ref(false);
let isInPosition = false;
const URL = "./my_model/";

const videoHeight = ref(window.innerHeight);

let pose, model, maxPredictions;
const pushUpCount = ref(0);
let isDownPosition = false;

const loadExternalScripts = () => {
  const script1 = document.createElement("script");
  script1.src =
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
  script1.onerror = (error) =>
    console.error("Error loading TensorFlow.js", error);

  const script2 = document.createElement("script");
  script2.src =
    "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
  script2.onerror = (error) =>
    console.error("Error loading Teachable Machine", error);

  document.head.appendChild(script1);
  document.head.appendChild(script2);
};

onMounted(() => {
  loadExternalScripts();
});

const closeModalAndStartCountdown = () => {
  showModal.value = false;
  countdown.value = 3;
  startCamera();
};

const startCamera = async () => {
  if (isCameraOn.value) return;
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    video.value.srcObject = stream.value;
    isCameraOn.value = true;
    initPoseDetection();
    initPositionDetection();
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Camera access was denied or not available: " + err.message);
  }
};

const initPositionDetection = async () => {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Start the loop
  window.requestAnimationFrame(loop);
};

async function loop() {
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  if (!video.value) return;

  // Get the video element as input for the Teachable Machine model
  const prediction = await model.predict(video.value);
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[0].probability.toFixed(2) > 0.4) {
      console.log(
        prediction[0].probability.toFixed(2),
        "Person is in position"
      );
      isInPosition = true;
    } else {
      isInPosition = false;

      console.log("Get in position");
    }
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    isCameraOn.value = false;
  }
  if (pose) pose.close();
};

const calculateDistance = (pointA, pointB) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const initPoseDetection = async () => {
  const { Pose } = await import("@mediapipe/pose");
  const { Camera } = await import("@mediapipe/camera_utils");
  const { drawLandmarks } = await import("@mediapipe/drawing_utils");

  pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  pose.onResults((results) => {
    const canvasCtx = canvas.value.getContext("2d");
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvas.value.width,
      canvas.value.height
    );

    if (results.poseLandmarks) {
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      if (isInPosition) {
        // console.log("pushup detection is running.");
        isPushupDetectorRunning.value = "pushup detection is running";
        removeLabel.value = true;
        if (exerciseType === "pushups") {
          detectPushUp(results.poseLandmarks);
        }
      } else {
        removeLabel.value = false;

        isPushupDetectorRunning.value = "pushup detection is NOT running";

        console.log("pushup detection is NOT running.");
      }
    }
    canvasCtx.restore();
  });

  const camera = new Camera(video.value, {
    onFrame: async () => {
      await pose.send({ image: video.value });
    },
    width: window.innerWidth,
    height: videoHeight.value,
  });

  camera.start();
};

const detectPushUp = (landmarks) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  const leftDistance = calculateDistance(leftShoulder, leftWrist);
  const rightDistance = calculateDistance(rightShoulder, rightWrist);

  const threshold = 0.3;

  if (leftDistance < threshold && rightDistance < threshold) {
    if (!isDownPosition) {
      console.log("pushed down");
      isDownPosition = true;
    }
  } else {
    if (isDownPosition) {
      console.log("pushed up");
      pushUpCount.value++;
      isDownPosition = false;
    }
  }
};

onBeforeUnmount(() => {
  stopCamera();
});
</script>
<!-- 
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
            <video
              src="../../public/pushups.mp4"
              autoplay
              muted
              loop
              class="hidden w-full h-40"
            >
              Your browser does not support the video tag.
            </video>
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

    <!-- Existing template content -->
    <video ref="video" autoplay playsinline muted></video>
    <canvas ref="canvas"></canvas>
    <button class="camera-toggle" @click="toggleCamera">Switch Camera</button>
    <div class="pushup-counter">Pushups: {{ pushUpCount }}</div>
  </div>
</template>

<script>
// ✅ Import MediaPipe Pose and Drawing Utils
import { Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
export default {
  name: "MediaPipePoseDetection",
  data() {
    return {
      isFrontCamera: false,
      currentStream: null,
      pushUpCount: 0,
      isDownPosition: false,
      showModal: true,
      isPerformingPushup: false,
    };
  },
  mounted() {
    this.loadExternalScripts();
    // Wait for scripts to load before initializing
    setTimeout(() => {
      this.initPositionDetection();
    }, 2000);
  },
  methods: {
    // Add modal close handler

    closeModalAndStartCamera() {
      this.showModal = false;
      this.startCamera();
    },
    // ✅ Start the camera
    async startCamera() {
      // Stop any existing stream
      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop());
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: this.isFrontCamera ? "user" : "environment",
          },
        });
        const video = this.$refs.video;
        video.srcObject = stream;
        this.currentStream = stream;
        video.onloadedmetadata = () => {
          video.play();
          this.initPoseDetection();
        };
      } catch (error) {
        console.error("Camera error:", error);
      }
    },
    async toggleCamera() {
      this.isFrontCamera = !this.isFrontCamera;
      await this.startCamera();
      this.initPoseDetection();
    },
    // ✅ Initialize MediaPipe Pose
    initPoseDetection() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      // ✅ Configure Pose model
      pose.setOptions({
        modelComplexity: 1, // 0 = fast, 1 = balanced, 2 = accurate
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      // ✅ Handle results
      pose.onResults((results) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the video feed
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Draw landmarks and connections
        if (results.poseLandmarks) {
          drawConnectors(ctx, results.poseLandmarks, Pose.CONNECTIONS, {
            color: "lime",
            lineWidth: 4,
          });
          drawLandmarks(ctx, results.poseLandmarks, {
            color: "red",
            lineWidth: 2,
          });
          // Add pushup detection here
          this.detectPushUp(results.poseLandmarks);
        }
      });
      // ✅ Process video frames
      const detectPose = async () => {
        await pose.send({ image: video });
        requestAnimationFrame(detectPose);
      };
      detectPose();
    },
    calculateDistance(pointA, pointB) {
      const dx = pointA.x - pointB.x;
      const dy = pointA.y - pointB.y;
      const dz = pointA.z - pointB.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    detectPushUp(landmarks) {
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftWrist = landmarks[15];
      const rightWrist = landmarks[16];
      const leftDistance = this.calculateDistance(leftShoulder, leftWrist);
      const rightDistance = this.calculateDistance(rightShoulder, rightWrist);
      const threshold = 0.5;
      if (leftDistance < threshold && rightDistance < threshold) {
        if (!this.isDownPosition) {
          console.log("pushed down");
          this.isDownPosition = true;
        }
      } else {
        if (this.isDownPosition) {
          console.log("pushed up");
          this.pushUpCount++;
          this.isDownPosition = false;
        }
      }
    },
    loadExternalScripts() {
      const script1 = document.createElement("script");
      script1.src =
        "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
      script1.onerror = (error) =>
        console.error("Error loading TensorFlow.js", error);

      const script2 = document.createElement("script");
      script2.src =
        "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
      script2.onerror = (error) =>
        console.error("Error loading Teachable Machine", error);

      document.head.appendChild(script1);
      document.head.appendChild(script2);
    },
    async initPositionDetection() {
      const URL = "./my_model/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      // Wait for tmImage to be defined
      if (typeof tmImage !== "undefined") {
        this.model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictions = this.model.getTotalClasses();

        // Start the prediction loop
        this.loop();
      } else {
        console.error("tmImage is not defined yet");
      }
    },
    async loop() {
      await this.predict();
      requestAnimationFrame(this.loop);
    },
    async predict() {
      if (!this.$refs.video || !this.model) return;

      const prediction = await this.model.predict(this.$refs.video);
      this.predictionProbability = prediction[0].probability.toFixed(2);
      const secondPrediction = prediction[1];

      this.predictions = prediction.map((pred) => ({
        className: pred.className,
        percentage: (pred.probability * 100).toFixed(1),
      }));

      // Pushup detection logic
      if (secondPrediction.probability > 0.8) {
        if (!this.isPerformingPushup) {
          this.pushupCount++;
          this.isPerformingPushup = true;
          console.log(
            "Person is performing pushups - Count:",
            this.pushupCount
          );
        }
      } else {
        this.isPerformingPushup = false;
        console.log("not pushups");
      }
    },
  },
};
</script>

<style scoped>
#app,
video,
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
canvas {
  z-index: 1;
}
video {
  z-index: 0;
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
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
</style> -->
