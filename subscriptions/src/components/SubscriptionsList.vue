<template>
    <div class="app">
        <Navbar />

        <div class="List">
            <div class="row justify-content-center">
                <div class="col-md-10">

                    <h3 class="text-center">
                        Subscriptions List
                    </h3>

                    <div class="card shadow-sm border-0">
                        <div class="card-body">

                            <table class="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Subscription</th>
                                        <th class="d-none d-sm-table-cell">
                                            Description
                                        </th>
                                        <th>Amount</th>
                                        <th>Frequency</th>
                                        <th>Start Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr
                                        v-for="subscription in Subscriptions"
                                        :key="subscription.key"
                                    >
                                        <td>{{ subscription.name }}</td>

                                        <td class="d-none d-sm-table-cell">
                                            {{ subscription.description }}
                                        </td>

                                        <td>
                                            ${{ subscription.amount }}
                                        </td>

                                        <td>
                                            {{ subscription.frequency }}
                                        </td>

                                        <td>
                                            {{ subscription.startDate }}
                                        </td>

                                        <td>
                                            <router-link
                                                :to="{
                                                    name: 'edit',
                                                    params: {
                                                        id: subscription.key
                                                    }
                                                }"
                                                class="btn btn-primary btn-sm px-3"
                                            >
                                                Edit
                                            </router-link>

                                            <button
                                                @click.prevent="
                                                    deleteSubscription(
                                                        subscription.key
                                                    )
                                                "
                                                class="btn btn-danger btn-sm px-3"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    <tr v-if="Subscriptions.length === 0">
                                        <td
                                            colspan="6"
                                            class="text-muted py-4"
                                        >
                                            No subscriptions found.
                                            Click "+ Add New Subscription"
                                            to get started.
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div class="text-center">
                        <button
                            @click="createSubscription"
                            class="add-btn"
                        >
                            + Add New Subscription
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar.vue'
import db from '../firebaseDb'

import {
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore'

import { useUserStore } from '@/stores/user'

const subsCollectionRef = collection(db, 'subscriptions')

export default {
    name: 'List-vue',

    components: {
        Navbar
    },

    data() {
        return {
            Subscriptions: [],
            user: '',
            unsubscribe: null
        }
    },

    created() {
        const userStore = useUserStore()

        this.user = userStore.getUser()

        const q = query(
            subsCollectionRef,
            where('username', '==', this.user)
        )

        this.unsubscribe = onSnapshot(q, (snapshot) => {
            this.Subscriptions = []

            snapshot.forEach((document) => {
                const data = document.data()

                if (data.name) {
                    this.Subscriptions.push({
                        key: document.id,
                        name: data.name,
                        description: data.description,
                        amount: data.amount,
                        frequency: data.frequency,
                        startDate: data.startDate || '',
                        username: data.username
                    })
                }
            })
        })
    },

    beforeUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    },

    methods: {
        deleteSubscription(id) {
            if (
                window.confirm(
                    'Do you really want to delete this subscription?'
                )
            ) {
                deleteDoc(doc(subsCollectionRef, id))
                    .catch((error) => {
                        console.error(error)
                    })
            }
        },

        createSubscription() {
            this.$router.push('/create')
        }
    }
}
</script>

<style lang="scss">
.app {
    min-height: 100vh;
    background: #f5f7fa;
}

.List {
    padding: 30px 15px;
}

h3 {
    margin-bottom: 25px;
    color: #2c3d4e;
    font-weight: 700;
}

.card {
    border-radius: 16px;
}

.table {
    margin-bottom: 0;
    background: white;
    border-radius: 12px;
    overflow: hidden;
}

.table thead {
    background: linear-gradient(
        135deg,
        #42b883,
        #34a372
    );
    color: white;
}

.table td,
.table th {
    padding: 15px;
    border-bottom: 1px solid #e9ecef;
    text-align: center;
    vertical-align: middle;
}

.table tbody tr {
    transition: all 0.2s ease;
}

.table tbody tr:hover {
    background-color: #f8f9fa;
}

.table tbody tr:last-child td {
    border-bottom: none;
}

td:last-child {
    white-space: nowrap;
}

.btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: #42b883;
    border-color: #42b883;
}

.btn-primary:hover {
    background-color: #34986c;
    border-color: #34986c;
    transform: translateY(-1px);
}

.btn-danger:hover {
    transform: translateY(-1px);
}

.add-btn {
    margin-top: 20px;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    background: #42b883;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 3px 8px rgba(66, 184, 131, 0.3);
}

.add-btn:hover {
    background: #34986c;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(66, 184, 131, 0.4);
}

.text-center {
    margin-top: 20px;
}

@media (max-width: 768px) {
    .table {
        font-size: 0.9rem;
    }

    .btn-sm {
        display: block;
        width: 100%;
        margin-bottom: 5px;
    }

    .table td,
    .table th {
        padding: 10px;
    }

    .add-btn {
        width: 100%;
    }
}
</style>