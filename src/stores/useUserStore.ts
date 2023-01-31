import {defineStore} from 'pinia'

import type {CasLogin, LocalLogin, User, UserGroup, UserStore} from '#/user'
import {removeTokens, setTokens} from '@/services/userService'
import {useAxios} from '@/composables/useAxios'

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        userAssociationsRoles: []
    }),

    getters: {
        isAuth: (state: UserStore): boolean => !!state.user,
        isCas: (state: UserStore): boolean | undefined => state.user?.isCas || state.newUser?.isCas,
        userNameFirstLetter: (state: UserStore): string | undefined => {
            return state.user?.firstName.charAt(0).toUpperCase()
        },
        managerGroup: (state: UserStore): UserGroup | undefined => {
            return state.user?.groups.find(({name}) => (name === 'Gestionnaire SVU') || (name === 'Gestionnaire Crous'))
        },
        isUniManager: (state: UserStore): boolean | undefined => {
            return !!state.user?.groups.find(({name}) => (name === 'Gestionnaire SVU'))
        },
        userName: (state: UserStore): string | undefined => {
            return state.user?.firstName + ' ' + state.user?.lastName
        }
    },
    actions: {
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.post(url, data)
            const {accessToken, refreshToken, user} = response.data
            if (user.isValidatedByAdmin) {
                setTokens(accessToken, refreshToken)
                this.user = user
            } else {
                throw new Error
            }
        },
        async logOut() {
            removeTokens()
            this.unLoadUser()
        },
        // to re-test
        async getUser() {
            const {axiosAuthenticated} = useAxios()
            const user = (await axiosAuthenticated.get<User>('/users/auth/user/')).data
            if (user.isValidatedByAdmin) {
                this.user = user
                this.user.groups = (await axiosAuthenticated.get<UserGroup[]>('/users/groups/')).data
            } else {
                // Specific case for CAS user data which can persist until complete registration
                if (user.isCas) {
                    this.newUser = user
                } else {
                    await this.logOut()
                }
            }
        },
        async getUserAssociationsRoles() {
            if (this.user && this.user.associations.length > 0) {
                const {axiosAuthenticated} = useAxios()
                this.userAssociationsRoles = (await axiosAuthenticated.get('/users/associations/')).data
            }
        },
        hasOfficeStatus(associationId: number | undefined): boolean | undefined {
            if (this.userAssociationsRoles.length > 0) {
                const association = this.userAssociationsRoles.find(({association}) => (association === associationId))
                return association?.hasOfficeStatus
            } else {
                return false
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
            const {axiosAuthenticated} = useAxios()
            const data = (await axiosAuthenticated.post('/users/auth/cas/login/', {ticket, service})).data
            const {accessToken, refreshToken, user} = data
            setTokens(accessToken, refreshToken)
            this.newUser = user
        }
    }
})

