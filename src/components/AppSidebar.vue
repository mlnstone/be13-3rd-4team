<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="isOpen = false"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
    ></div>
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="34.000000pt"
            height="26.000000pt"
            viewBox="0 0 348.000000 263.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,263.000000) scale(0.100000,-0.100000)"
              fill="#3b82f5"
              stroke="none"
            >
              <path
                d="M1567 2473 c-4 -3 -7 -21 -7 -39 0 -26 -7 -39 -33 -58 -18 -14 -44
        -29 -57 -34 -24 -9 -23 -10 21 -29 34 -15 51 -30 66 -62 l20 -41 26 39 c15 22
        40 47 57 57 31 19 39 34 17 34 -21 0 -87 71 -87 94 0 26 -14 49 -23 39z"
              />
              <path
                d="M1473 2085 c-32 -51 -43 -129 -43 -305 0 -232 -31 -309 -196 -490
        -46 -50 -56 -71 -44 -90 13 -21 76 8 186 87 114 82 138 93 198 93 81 0 214
        -112 356 -298 63 -83 92 -108 110 -97 23 14 14 40 -116 300 -41 82 -45 96 -44
        163 0 92 22 138 86 181 52 34 106 40 176 19 27 -8 42 -8 49 -1 16 16 -62 88
        -117 107 -45 15 -51 15 -140 -9 -63 -17 -120 -25 -174 -25 -79 0 -80 0 -132
        43 -29 24 -65 65 -80 92 -25 46 -28 59 -28 158 0 118 -9 132 -47 72z"
              />
              <path
                d="M2246 2013 c-24 -26 -52 -47 -69 -50 -28 -6 -29 -7 -12 -20 11 -7 27
        -13 37 -13 21 0 78 -74 78 -102 0 -11 5 -16 10 -13 6 3 10 16 10 29 0 26 43
        70 83 85 31 12 36 31 8 31 -23 0 -68 41 -81 75 -5 14 -13 25 -17 24 -5 0 -26
        -21 -47 -46z"
              />
              <path
                d="M1705 2030 c-11 -4 -33 -22 -50 -40 -60 -63 -27 -181 60 -210 61 -20
        130 12 160 76 19 41 19 67 -2 111 -28 60 -105 89 -168 63z"
              />
              <path
                d="M987 1929 c-13 -27 -32 -46 -60 -61 l-42 -21 35 -12 c31 -10 67 -49
        84 -88 3 -8 9 -5 17 8 18 28 71 75 86 75 24 0 13 18 -22 39 -22 13 -41 35 -51
        61 -9 22 -19 40 -23 40 -3 0 -14 -19 -24 -41z"
              />
              <path
                d="M2806 1734 c-3 -9 -6 -28 -6 -43 0 -63 -29 -125 -82 -178 -107 -105
        -188 -104 -387 7 -79 44 -167 36 -223 -21 -36 -36 -29 -49 25 -49 49 -1 131
        -42 158 -80 10 -14 24 -46 31 -73 23 -89 -5 -144 -161 -317 -42 -47 -85 -98
        -95 -113 -20 -33 -15 -57 12 -57 21 0 194 110 267 170 58 47 158 100 190 100
        55 0 114 -41 211 -146 96 -104 137 -136 162 -127 21 8 13 42 -23 99 -48 74
        -87 193 -93 282 -5 76 2 112 56 272 40 121 29 290 -18 290 -10 0 -21 -7 -24
        -16z"
              />
              <path
                d="M2501 1723 c-82 -41 -95 -143 -26 -215 22 -24 34 -28 78 -28 32 0 62
        6 75 16 29 20 62 85 62 121 0 41 -35 92 -75 109 -44 18 -72 17 -114 -3z"
              />
              <path
                d="M684 1566 c-30 -30 -34 -40 -34 -88 0 -48 4 -58 33 -85 53 -52 127
        -53 177 -3 15 15 20 33 20 78 0 51 -4 62 -27 84 -65 60 -118 65 -169 14z"
              />
              <path
                d="M456 1524 c-21 -55 6 -141 82 -263 19 -30 51 -89 71 -130 l36 -76 -2
        -140 c-2 -77 -8 -171 -14 -208 -6 -38 -8 -71 -4 -75 14 -14 78 75 124 174 35
        72 59 109 87 132 36 30 44 32 114 32 52 0 92 -6 130 -21 30 -11 64 -23 75 -26
        11 -3 43 -15 70 -27 87 -39 182 -69 199 -63 28 11 6 35 -102 108 -168 114
        -213 154 -249 221 -42 76 -42 110 0 176 38 61 93 102 137 102 37 0 50 25 24
        46 -25 20 -155 10 -193 -14 -14 -9 -55 -46 -91 -81 -105 -103 -192 -126 -290
        -76 -53 27 -144 128 -155 174 -12 47 -37 65 -49 35z"
              />
              <path
                d="M1455 759 c-253 -9 -383 -27 -570 -76 -121 -32 -305 -104 -360 -141
        -46 -31 -106 -52 -150 -52 -41 0 -158 -34 -162 -47 -5 -13 30 -23 79 -23 27 0
        47 -8 70 -29 18 -15 43 -34 56 -40 124 -66 474 -92 952 -72 146 6 405 15 575
        21 757 24 1033 41 1072 66 12 8 43 14 69 14 48 0 179 34 188 49 13 20 -44 41
        -129 47 -81 6 -147 31 -244 90 -50 31 -119 66 -153 78 -35 12 -72 27 -83 33
        -54 29 -286 57 -600 72 -330 17 -407 18 -610 10z"
              />
            </g>
          </svg>

          <span class="mx-2 text-2xl font-semibold text-white">모여봄</span>
        </div>
      </div>

      <nav class="mt-10">
        <p class="pl-4 text-xs font-semibold mb-4 text-gray-400">GENERAL</p>
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>

          <span class="mx-4">Dashboard</span>
        </router-link>
        <p class="pl-4 my-2 text-xs font-semibold mb-4 text-gray-400">
          Examples
        </p>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'UIElements' ? activeClass : inactiveClass]"
          to="/ui-elements"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
              fill="currentColor"
            />
            <path
              d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
              fill="currentColor"
            />
            <path
              d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
              fill="currentColor"
            />
            <path
              d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">UI Elements</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Tables' ? activeClass : inactiveClass]"
          to="/tables"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
              fill="currentColor"
            />
            <path
              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
              fill="currentColor"
            />
            <path
              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">Tables</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Forms' ? activeClass : inactiveClass]"
          to="/forms"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="mx-4">Forms</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Cards' ? activeClass : inactiveClass]"
          to="/cards"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fill-rule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="mx-4">Cards</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"
          to="/modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"
            />
            <path
              d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"
            />
            <path
              d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"
            />
          </svg>

          <span class="mx-4">Modal</span>
        </router-link>
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Chart' ? activeClass : inactiveClass]"
          to="/charts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>

          <span class="mx-4">Charts</span>
        </router-link>
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"
          to="/blank"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>

          <span class="mx-4">Blank</span>
        </router-link>
        <p class="pl-4 text-xs my-2 font-semibold mb-4 text-gray-400">About</p>
        <a
          target="_blank"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"
          href="https://github.com/tal7aouy"
        >
          <svg
            class="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"
            ></path>
          </svg>

          <span class="mx-4">Github</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";

const { isOpen } = useSidebar();
const activeClass = ref(
  "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100"
);
const inactiveClass = ref(
  "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
);
</script>
