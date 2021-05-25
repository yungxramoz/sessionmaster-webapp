<template>
  <v-container px-6 py-3>
    <template v-if="loadingCollection">
      <yr-centered-progress-linear text="Opening your treasure..." />
    </template>
    <template v-else>
      <v-row no-gutters align="center">
        <v-col cols="4" md="3" lg="2" xl="1" class="text-center">
          <add-board-game-btn />
        </v-col>

        <v-col
          cols="4"
          md="3"
          lg="2"
          xl="1"
          class="d-flex child-flex boardgame"
          v-for="boardgame in collection"
          :key="boardgame.id"
        >
          <v-img
            class="ma-1"
            contain
            :aspect-ratio="1"
            :src="boardgame.imageUrl"
            :lazy-src="boardgame.thumbUrl"
            @click="openDetails(boardgame.id)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </template>
    <template v-if="details != null">
      <v-dialog v-model="detailsDialog" max-width="600" :persistent="loadingRemove" scrollable>
        <yr-dialog-card data-cy="remove-details-content">
          <template #content>
            <v-img contain :aspect-ratio="1" :src="details.imageUrl" :lazy-src="details.thumbUrl">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <h2 class="pt-4">
              {{ details.name }}
            </h2>

            <v-list two-line>
              <v-divider />

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    mdi-account-group
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Player Count</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ details.minPlayers }}-{{ details.maxPlayers }} Player
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>
                    mdi-clock
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Play Time</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ details.minPlaytime }}-{{ details.maxPlaytime }} Minutes
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="mb-1">Description:</v-list-item-title>
                  <p v-html="details.description"></p>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>

          <template #actions>
            <v-spacer></v-spacer>
            <yr-btn
              text
              @click="detailsDialog = false"
              :disabled="loadingRemove"
              data-cy="close-remove-btn"
            >
              Close
            </yr-btn>
            <yr-btn
              color="error"
              @click="removeAct"
              :loading="loadingRemove"
              :disabled="loadingRemove"
              data-cy="confirm-remove-btn"
            >
              <v-icon>mdi-delete</v-icon>
              Remove
            </yr-btn>
          </template>
        </yr-dialog-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'
import AlertModule from '@/store/modules/alert-module'
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
  private loadingRemove: boolean = false
  private details: BoardGameModel | null = null
  private detailsDialog: boolean = false

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private alert: AlertModule = getModule(AlertModule, this.$store)
  private boardGame: BoardGameModule = getModule(BoardGameModule, this.$store)

  created() {
    this.loadingCollection = true
    this.alert.resetAlert()
    this.boardGame
      .fetchCollection(this.auth.userId)
      .then(
        (response: BoardGameModel[]) => {
          if (response.length === 0) {
            this.alert.setMessage('Start collecting your board games!')
            this.alert.setType('info')
          }
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loadingCollection = false
      })
  }

  openDetails(id: string): void {
    this.details = this.boardGame.collection.filter(boardgame => boardgame.id === id)[0]

    this.detailsDialog = true
  }

  removeAct(): void {
    const userId = this.auth.userId
    const boardGameId = this.details?.id

    if (userId && boardGameId) {
      this.loadingRemove = true
      this.alert.reset()
      this.boardGame
        .removeFromCollection({ userId, boardGameId })
        .then(
          (response: BoardGameModel[]) => {
            this.detailsDialog = false
            this.alert.setMessage('Removed "' + this.details?.name + '" from your treasure!')
            this.alert.setType('success')
          },
          error => {
            this.alert.setMessage(error)
            this.alert.setType('error')
          }
        )
        .finally(() => {
          this.loadingRemove = false
        })
    }
  }

  get collection(): BoardGameModel[] {
    return this.boardGame.collection
  }
}
</script>
