import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {User, UserGroup, UserManagerStore, UserStore, UserToUpdate} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'

// Used to update user infos
const userToUpdate = ref<UserToUpdate>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    newEmail: '',
    newEmailVerification: '',
    phone: ''
})


export default function () {

    const userManagerStore = useUserManagerStore()
    const {updateUserGroups} = useUserGroups()
    const {hasPerm} = useSecurity()


    /**
     * If the route is ValidateUsers, get the unvalidated users, otherwise get all the users
     * It is used on the same view to get various data sets based on the route
     */
    async function getUsers(routeName: string) {
        if (hasPerm('change_associationusers')) {
            if (routeName === 'ValidateUsers') await userManagerStore.getUnvalidatedUsers()
            if (routeName === 'ManageUsers') await userManagerStore.getUsers()
        }
    }

    /**
     * The function `validateUser` calls the function `updateUserGroups` and then calls the function `validateUser` on
     * the `userManagerStore`
     * When validating a user, we can update its groups and need to patch it to set isValidatedByAdmin to true.
     */
    async function validateUser() {
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    /**
     * If the user is in a group that is not public, then managers can't edit the user
     * @param {UserGroup[]} userGroups - UserGroup[] - this is the array of UserGroup objects that are associated with the
     * user.
     * @returns A boolean value.
     */
    function canEditUser(userGroups: UserGroup[]): boolean {
        const {groups} = useUserGroups()
        let perm = false
        if (userGroups.length && groups.value.length) {
            perm = true
            for (let i = 0; i < userGroups.length; i++) {
                const g = groups.value.find(obj => obj.id === userGroups[i].groupId)
                if (g && !g.isPublic) {
                    perm = false
                    break
                }
            }
        }
        return perm
    }

    /**
     * It takes a user object, compares it to the user object in the form, and if there are differences, it sends a patch
     * request to the server with the differences
     * @param {User} user - User: the user to update
     * @param editedByStaff
     */
    async function updateUserInfos(user: User | undefined, editedByStaff: boolean) {
        interface InfosToPatch {
            firstName?: string,
            lastName?: string,
            email?: string,
            phone?: string,
            username?: string
        }

        const infosToPatch: InfosToPatch = {}
        if (userToUpdate.value.firstName !== user?.firstName) infosToPatch.firstName = userToUpdate.value.firstName
        if (userToUpdate.value.lastName !== user?.lastName) infosToPatch.lastName = userToUpdate.value.lastName
        if (userToUpdate.value.newEmail && userToUpdate.value.newEmail !== userToUpdate.value.email &&
            userToUpdate.value.newEmail === userToUpdate.value.newEmailVerification) infosToPatch.email = userToUpdate.value.newEmail
        if (userToUpdate.value.phone !== user?.phone) infosToPatch.phone = userToUpdate.value.phone
        if (Object.keys(infosToPatch).length > 0) {
            let store: UserStore | UserManagerStore = useUserStore()
            let url = '/users/auth/user/'
            if (editedByStaff) {
                store = userManagerStore
                url = `/users/${user?.id}`
            }
            const {axiosAuthenticated} = useAxios()
            store.user = (await axiosAuthenticated.patch(url, infosToPatch)).data
        }
    }

    return {
        getUsers,
        validateUser,
        canEditUser,
        userToUpdate,
        updateUserInfos
    }
}
