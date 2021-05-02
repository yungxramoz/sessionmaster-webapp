<template>
  <v-container px-6 py-3>
    <v-row no-gutters align="center">
      <template v-if="!loadingCollection">
        <v-col cols="4" class="text-center">
          <add-board-game-btn />
        </v-col>

        <v-col
          cols="4"
          class="d-flex child-flex"
          v-for="boardgame in collection"
          :key="boardgame.id"
        >
          <v-img
            class="ma-1"
            contain
            :aspect-ratio="1"
            :src="boardgame.thumbUrl"
            :lazy-src="boardgame.thumbUrl"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'
import BoardGameModule from '@/store/modules/boardgame-module'

import { BoardGameModel } from '@/models/data/boardgame'

import AddBoardGameBtn from './AddBoardGameBtn.vue'

@Component({
  components: {
    AddBoardGameBtn,
  },
})
export default class Collection extends Vue {
  private loadingCollection: boolean = false

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private boardGame: BoardGameModule = getModule(BoardGameModule, this.$store)

  created() {
    this.loadingCollection = true
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
