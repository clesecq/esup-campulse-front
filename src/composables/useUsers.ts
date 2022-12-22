import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import useUtility from '@/composables/useUtility'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {ManagedUser, UserAssociationStatus, UserToUpdate} from '#/user'
import {ref, watch} from 'vue'


const userManagerStore = useUserManagerStore()

const userToUpdate = ref<UserToUpdate>(userManagerStore.userInfosUpdate)
watch(() => userManagerStore.user, () => {
    userToUpdate.value = userManagerStore.userInfosUpdate
})

const newUserAssociations = ref<UserAssociationStatus[]>(userManagerStore.userAssociationStatus)
watch(() => userManagerStore.userAssociations, () => {
    newUserAssociations.value = userManagerStore.userAssociationStatus
})


export default function () {

    const route = useRoute()
    const {groupsToDelete} = useUserGroups()
    const {arraysAreEqual} = useUtility()
    const {updateUserGroups} = useUserGroups()

    async function getUsers() {
        if (route.name === 'ValidateUsers') {
            await userManagerStore.getUnvalidatedUsers()
        }
        if (route.name === 'ManageUsers') {
            await userManagerStore.getUsers()
        }
    }

    async function getUser(routeParams: string) {
        if (routeParams) {
            const id = parseInt(routeParams as string)
            await userManagerStore.getUserDetail(id)
        }
    }

    // to re test
    async function validateUser() {

        const oldGroups = userManagerStore.userGroups
        const {newGroups} = useUserGroups()
        if (!arraysAreEqual(newGroups.value, oldGroups)) {
            await userManagerStore.updateUserGroups(newGroups.value)
            await userManagerStore.deleteUserGroups(groupsToDelete(newGroups.value, oldGroups))
        }
        await userManagerStore.validateUser()
    }

    // to test
    async function updateUserInfos() {
        // update user
        await userManagerStore.updateUserInfos(userToUpdate.value as ManagedUser)
        // update user groups
        await updateUserGroups()
        // update user associations
        await userManagerStore.updateUserAssociations(newUserAssociations.value as UserAssociationStatus[])
    }

    return {getUsers, getUser, validateUser, updateUserInfos, userToUpdate, newUserAssociations}
}

