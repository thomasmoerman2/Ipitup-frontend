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
    };
  },
  mounted() {
    // Remove automatic camera start
    // this.startCamera();
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

      const threshold = 0.3;

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

.z-[9999] {
  z-index: 9999;
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
</style>
