<template>
    <div class="app">
        <Navbar />

        <div class="row justify-content-center">
            <div class="col-md-5">

                <div v-if="!isUpdate">
                    <h3 class="text-center">Add Subscription</h3>
                </div>

                <div v-if="isUpdate">
                    <h3 class="text-center">Edit Subscription</h3>
                </div>

                <form @submit.prevent="onFormSubmit">

                    <div class="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="subscription.name"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="subscription.description"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Amount</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="subscription.amount"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            class="form-control"
                            v-model="subscription.startDate"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Payment Frequency</label>

                        <select
                            id="frequency"
                            class="form-control"
                            v-model="subscription.frequency"
                            required
                        >
                            <option value="weekly">Weekly</option>
                            <option value="bimonthly">Bi-monthly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="biannually">Bi-annually</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>

                    <div class="form-group mt-3">

                        <div
                            v-if="!isUpdate"
                            class="btn btn-primary col-4"
                            @click="addSubscription"
                        >
                            Save
                        </div>

                        <div
                            v-if="isUpdate"
                            class="btn btn-primary btn-block"
                            @click="updateSubscription"
                        >
                            Update
                        </div>

                        <button
                            type="button"
                            class="btn btn-secondary col-4 ms-2"
                            @click="cancelOperation"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>
        </div>
    </div>
</template>

<script>
import db from '../firebaseDb'
import Navbar from '../components/Navbar.vue'

import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc
} from 'firebase/firestore'

import { useUserStore } from '@/stores/user'

const subsCollectionRef = collection(db, 'subscriptions')

export default {
    name: 'CreateUpdate',

    components: {
        Navbar
    },

    data() {
        return {
            subscription: {
                name: '',
                description: '',
                amount: '',
                frequency: '',
                startDate: '',
                username: ''
            },
            isUpdate: false,
            user: ''
        }
    },

    created() {
        const userStore = useUserStore()

        this.user = userStore.getUser()

        if (this.$route.params.id) {
            this.isUpdate = true
            this.getRecord(this.$route.params.id)
        } else {
            this.isUpdate = false
        }
    },

    methods: {
        async getRecord(id) {
            const docRef = doc(subsCollectionRef, id)

            try {
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    this.subscription.name = docSnap.data().name
                    this.subscription.description =
                        docSnap.data().description
                    this.subscription.frequency =
                        docSnap.data().frequency
                    this.subscription.username =
                        docSnap.data().username
                    this.subscription.amount =
                        docSnap.data().amount
                    this.subscription.startDate =
                        docSnap.data().startDate || ''
                }
            } catch (error) {
                console.log(error)
            }
        },

        addSubscription() {
            if (
                this.subscription.name.length > 0 &&
                this.subscription.description.length > 0
            ) {
                this.subscription.username = this.user

                addDoc(subsCollectionRef, this.subscription)
                    .then(() => {
                        this.subscription.name = ''
                        this.subscription.description = ''
                        this.subscription.amount = ''
                        this.subscription.frequency = ''
                        this.subscription.startDate = ''
                        this.subscription.username = ''

                        this.$router.push('/subscriptionsList')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },

        updateSubscription() {
            updateDoc(
                doc(subsCollectionRef, this.$route.params.id),
                this.subscription
            )
                .then(() => {
                    this.$router.push('/subscriptionsList')
                })
                .catch((error) => {
                    console.log(error)
                    alert('Error updating subscription')
                    this.$router.push('/subscriptionsList')
                })
        },

        cancelOperation() {
            this.$router.push('/subscriptionsList')
        },

        onFormSubmit(event) {
            event.preventDefault()
        }
    }
}
</script>