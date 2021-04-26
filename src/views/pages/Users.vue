<template>
  <v-container px-6 py-3>
    <div class="text-center mb-5">
      <h1>Users</h1>
    </div>
    <v-data-table
      :headers="headers"
      :items="userList"
      :search="search"
      :loading="loading"
    ></v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import UserModule from '@/store/modules/user-module'

import { UserModel } from '@/models/data/user'
import { DataTableHeader } from 'vuetify'

@Component
export default class Login extends Vue {
  private users: UserModule = getModule(UserModule, this.$store)
  private userList: UserModel[] = []
  private search = ''
  private headers: DataTableHeader[] = [
    {
      text: 'Firstname',
      align: 'start',
      filterable: true,
      sortable: true,
      value: 'firstname',
    },
    {
      text: 'Lastname',
      align: 'start',
      filterable: true,
      sortable: true,
      value: 'lastname',
    },
  ]
  private loading = false

  mounted() {
    this.loading = true
    this.users
      .fetchUsers()
      .then(
        (users: UserModel[]) => {
          this.userList = users
        },
        _error => {
          //TODO do proper error handling
        }
      )
      .finally(() => {
        this.loading = false
      })
  }

  @Watch('storeUsers')
  onStoreUsersChanged(newUserList: UserModel[]) {
    this.userList = newUserList
  }

  get storeUsers(): UserModel[] {
    return this.users.all
  }
}
</script>
