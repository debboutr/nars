<template>
  <button class="back-to-top hidden" @click="goToTop">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="back-to-top-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 11l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
  </button>
</template>

<script>
import { onMounted } from "vue"

export default {
	setup() {
		onMounted(() => {
      const showOnPx = 100;
      const backToTopButton = document.querySelector(".back-to-top")

      const scrollContainer = () => {
        return document.documentElement || document.body;
      };

      document.addEventListener("scroll", () => {
        if (scrollContainer().scrollTop > showOnPx) {
          backToTopButton.classList.remove("hidden")
        } else {
          backToTopButton.classList.add("hidden")
        }
      })
		})
			const goToTop = () => {
				document.body.scrollIntoView({
					behavior: "smooth"
				});
			};

			return { goToTop };
	}
}
</script>

<style>
  .back-to-top {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    border-radius: 100%;
    background: #141c38;
    padding: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 30%;
    transition: opacity 0.5s;
  }
  .back-to-top:hover .back-to-top-icon {
    opacity: 60%;
  }
  .hidden {
    opacity: 0%;
  }
  .back-to-top-icon {
    width: 5rem;
    height: 5rem;
    color: #7ac9f9;
  }
  .back-to-top-icon:hover {
  }
</style>
