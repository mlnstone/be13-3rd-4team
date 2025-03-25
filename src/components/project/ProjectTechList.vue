<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="기술 검색" @keyup.enter="selectFirstTech"
            @input="filterTechs" />
        <ul v-if="filteredTechs.length > 0">
            <li v-for="tech in filteredTechs" :key="tech.no" @click="selectTech(tech)">
                {{ tech.techName }}
            </li>
        </ul>
        <div>
            <span v-for="tech in selectedTechs" :key="tech.no">
                {{ tech.techName }}
                <button @click="removeTech(tech)">X</button>
            </span>
        </div>
    </div>
</template>

<script setup>
import apiClient from '@/api';
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    initialTechs: {
        type: Array,
        default: () => [],
    }
});

const emit = defineEmits(["selectedTechs"]);

const techs = ref([]);
const filteredTechs = ref([]);
const searchQuery = ref("");
const selectedTechs = ref([]);

const fetchTechs = async () => {
    try {
        const response = await apiClient.get("/techs/get");
        techs.value = response.data;
        selectedTechs.value = techs.value.filter((tech) => props.initialTechs.includes(tech.techName));
    } catch (error) {
        console.error('기술 목록 불러오기 오류:', error.response?.data?.message || error.message);
    }
};

const filterTechs = () => {
    const filtered = techs.value.filter((tech) => tech.techName.toLowerCase().includes(searchQuery.value.toLowerCase()));
    filteredTechs.value = filtered.slice(0, 10);
};

const selectTech = (tech) => {
    if (!selectedTechs.value.some(t => t.no === tech.no)) {
        selectedTechs.value.push(tech);
        emit("selectedTechs", selectedTechs.value);
    }
    searchQuery.value = "";
    filteredTechs.value = [];
};

const removeTech = (tech) => {
    selectedTechs.value = selectedTechs.value.filter(t => t.no !== tech.no);
    emit("selectedTechs", selectedTechs.value);
};

const selectFirstTech = () => {
    if (filteredTechs.value.length > 0) {
        selectTech(filteredTechs.value[0]);
    }
};

watch(selectedTechs, (newVal) => {
    if (newVal.length > 0) {
        emit("selectedTechs", newVal);
    }
});

onMounted(fetchTechs);
</script>
