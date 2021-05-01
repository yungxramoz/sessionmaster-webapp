<template>
  <div>
    <h1>Collection Page</h1>
    <span v-show="loadingCollection">loading...</span>
    <ul v-show="!loadingCollection">
      <li v-for="boardgame in collection" :key="boardgame.id">
        {{ boardgame.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'
import BoardGameModule from '@/store/modules/boardgame-module'

import { BoardGameModel } from '@/models/data/boardgame'

@Component
export default class Collection extends Vue {
  private loadingCollection: boolean = false

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private boardGame: BoardGameModule = getModule(BoardGameModule, this.$store)
  created() {
    this.boardGame
      .fetchCollection(this.auth.userId)
      .then(
        (response: BoardGameModel[]) => {
          //   this.form.fields = cloneSource(response)
        },
        error => {
          //   this.message = error
          //   this.messageType = 'error'
        }
      )
      .finally(() => {
        this.loadingCollection = false
      })
  }

  get collection(): BoardGameModel[] {
    return this.boardGame.collection
  }
}
</script>
