import {defineStore} from 'pinia';
import {apiClient} from "../services/ApiRequest";
import router from "@/router";


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        setUser (user) {
            this.user = user
        },
    }
});
