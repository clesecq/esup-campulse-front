import {defineStore} from 'pinia'
import type {CasLogin, GroupList, LocalLogin, User, UserGroup, UserStore} from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'
import {removeTokens, setTokens} from '@/services/userService'

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        groups: []
    }),

    getters: {
        isAuth: (state: UserStore): boolean => !!state.user,
        isCas: (state: UserStore): boolean | undefined => state.user?.isCas || state.newUser?.isCas,
        userNameFirstLetter: (state: UserStore): string | undefined => {
            return state.user?.firstName.charAt(0).toUpperCase()
        },
        groupList: (state: UserStore): GroupList => {
            return state.groups
                .map(group => ({
                    value: group.id,
                    label: group.name
                }))
        },
        studentGroup: (state: UserStore): UserGroup | undefined => {
            return state.groups.find(({name}) => name === 'Étudiante ou Étudiant')
        }
    },
    actions: {
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const response = await _axios.post(url, data)
            const {accessToken, refreshToken, user} = response.data
            if (user.isValidatedByAdmin) {
                setTokens(accessToken, refreshToken)
                this.user = user
                await router.push({name: 'Dashboard'})
            } else {
                this.user = undefined
                throw new Error
            }
        },
        async logOut() {
            removeTokens()
            this.unLoadUser()
            await router.push({name: 'Login'})
        },
        async getUser() {
            const user = (await _axios.get<User>('/users/auth/user/')).data
            // Check user validity
            // If user is valid
            if (user.isValidatedByAdmin) {
                // Populate user data and user is auth
                this.user = user
            }
            // If user is not valid
            else {
                // But user is from CAS
                // Specific case for CAS user data which can persist until complete registration
                if (user.isCas) {
                    // Populate newUser data and user is not auth
                    this.newUser = user
                } else {
                    // Clear tokens and user data
                    await this.logOut()
                }
            }
        },
        unLoadUser() {
            this.user = undefined
        },
        unLoadNewUser() {
            removeTokens()
            this.newUser = undefined
        },
        async loadCASUser(ticket: string) {
            const service = import.meta.env.VITE_APP_FRONT_URL + '/cas-register'
            const data = (await _axios.post('/users/auth/cas/login/', {ticket, service})).data
            const {accessToken, refreshToken, user} = data
            setTokens(accessToken, refreshToken)
            this.newUser = user
        },
        async getGroups() {
            this.groups = (await _axios.get<UserGroup[]>('/groups/')).data
        }
    }
})

