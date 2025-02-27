<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import useUtility from '@/composables/useUtility'

const projectStore = useProjectStore()
const {
    fundsLabels,
    getCommissionFunds,
    getFunds,
    commissionLabels,
    funds,
    commissionFunds,
    getAllCommissions,
    initCommissionLabels,
    initFundsLabels
} = useCommissions()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {CURRENCY} = useUtility()

const props = defineProps<{
    view: 'projectRecap' | 'submitProjectReview' | 'projectReviewRecap'
}>()

const projectCommissionLabel = ref<string | undefined>(undefined)

const initProjectCommissionLabel = () => {
    projectCommissionLabel.value = commissionLabels.value
        .find(x => x.value === projectStore.projectCommission)?.label
}

onMounted(async () => {
    await onGetProjectCommissions()
})

watch(() => projectStore.project, async () => {
    await onGetProjectCommissions()
})

async function onGetProjectCommissions() {
    if (projectStore.project) {
        loading.show()
        try {
            await projectStore.getProjectCommissionFunds(false, undefined)
            await getAllCommissions()
            await getCommissionFunds()
            await getFunds()
            initFundsLabels()
            initCommissionLabels()
            initProjectCommissionLabel()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
        loading.hide()
    }
}
</script>

<template>
    <div
        v-if="props.view === 'projectRecap' || props.view === 'projectReviewRecap'"
        class="flex-column"
    >
        <div class="display-row">
            <h4 :data-test="t('project.commission-choice')">{{ t('project.commission-choice') }}</h4>
            <p>{{ projectCommissionLabel }}</p>
        </div>

        <div class="display-row">
            <h4 :data-test="t('commission.funds')">{{ t('commission.funds') }}</h4>
            <p>
                <QChip
                    v-for="projectCommissionFund in projectStore.projectCommissionFunds"
                    :key="projectCommissionFund.id"
                    color="commission"
                    outline
                >
                    {{
                        funds.find(obj => obj.id === (commissionFunds
                            .find(obj => obj.id === projectCommissionFund.commissionFund))?.fund)?.acronym
                    }}
                </QChip>
            </p>
        </div>

        <div v-if="props.view === 'projectReviewRecap'">
            <div
                v-for="projectCommissionFund in projectStore.projectCommissionFunds"
                :key="projectCommissionFund.id"
                class="flex-column"
            >
                <div class="display-row">
                    <h4 :data-test="t('project.amount-asked') + ' (' + fundsLabels.find(x => x.value === commissionFunds.find(commissionFund => commissionFund.id === projectCommissionFund.commissionFund)?.fund)?.label + ')'">
                        {{
                            t('project.amount-asked') + ' (' + fundsLabels.find(x => x.value === commissionFunds
                                .find(commissionFund => commissionFund.id ===
                                    projectCommissionFund.commissionFund)?.fund)?.label +
                                ')'
                        }}
                    </h4>
                    <p>{{ projectCommissionFund.amountAsked + CURRENCY }}</p>
                </div>

                <div class="display-row">
                    <h4 :data-test="t('project.amount-earned') + ' (' + fundsLabels.find(x => x.value === commissionFunds.find(commissionFund => commissionFund.id === projectCommissionFund.commissionFund)?.fund)?.label + ')'">
                        {{
                            t('project.amount-earned') + ' (' + fundsLabels.find(x => x.value === commissionFunds
                                .find(commissionFund => commissionFund.id ===
                                    projectCommissionFund.commissionFund)?.fund)?.label +
                                ')'
                        }}
                    </h4>
                    <p>{{ projectCommissionFund.amountEarned + CURRENCY }}</p>
                </div>
            </div>
        </div>
    </div>

    <div
        v-if="props.view === 'submitProjectReview'"
        class="flex-column"
    >
        <QInput
            v-model="projectCommissionLabel"
            :label="t('project.commission-choice')"
            filled
            readonly
        />
        <div
            v-for="projectCommissionFund in projectStore.projectCommissionFunds"
            :key="projectCommissionFund.id"
            class="flex-column"
        >
            <h4 :data-test="fundsLabels.find(x => x.value === commissionFunds.find(y => y.id === projectCommissionFund.commissionFund)?.fund)?.label">
                {{
                    fundsLabels.find(x => x.value === commissionFunds.find(y => y.id ===
                        projectCommissionFund.commissionFund)?.fund)?.label
                }}
            </h4>
            <QInput
                v-model="projectCommissionFund.amountAsked"
                :label="t('project.amount-asked') + ' (' + fundsLabels.find(x => x.value === commissionFunds
                    .find(y => y.id === projectCommissionFund.commissionFund)?.fund)?.label + ')'"
                :shadow-text="` ${CURRENCY}`"
                filled
                readonly
            />
            <QInput
                v-model="projectCommissionFund.amountEarned"
                :label="t('project.amount-earned') + ' (' + fundsLabels
                    .find(x => x.value === commissionFunds.find(y => y.id === projectCommissionFund.commissionFund)?.fund)?.label + ')'"
                :shadow-text="` ${CURRENCY}`"
                filled
                readonly
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
