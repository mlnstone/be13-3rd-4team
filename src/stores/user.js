import apiClient from "@/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./auth";

export const useUserStore = defineStore('user', () => {
    const router = useRouter();

    const authStore = useAuthStore();
    const userInfo = authStore.userInfo;
    const username = userInfo.username;

    const getUser = async () => {
        const username = userInfo.username;

        try {
            const response = await apiClient.get(`/user/${username}`);            

            user.userNo = response.data.userNo;
            user.username = response.data.username;
        } catch (error) {
        }

    };

    const goToUserComments = async () => {
        try {
            const response = await apiClient.get(`/user/${username}`);            

            const userNo = response.data.userNo;

            router.push(`/admin/user/${userNo}/comments`);
        } catch (error) {

        }
    };

    const goToUserPosts = async () => {
        try {
            const response = await apiClient.get(`/user/${username}`);            

            const userNo = response.data.userNo;

            router.push(`/admin/user/${userNo}/posts`);
        } catch (error) {

        }
    };

    const goToUserProjects = async () => {
        try {
            const response = await apiClient.get(`/user/${username}`);   

            const userNo = response.data.userNo;

            router.push(`/admin/user/${userNo}/projects`);
        } catch (error) {

        }
    };

    return { getUser, goToUserComments, goToUserPosts, goToUserProjects };
});