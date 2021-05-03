<template>
  <div>
    <v-dialog
      v-model="addBoardGameDialog"
      scrollable
      fullscreen
      hide-overlay
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <yr-icon-btn
          fab
          tile
          text
          :large-icon="true"
          v-bind="attrs"
          v-on="on"
          data-cy="add-boardgame-btn"
        >
          mdi-plus
        </yr-icon-btn>
      </template>
      <yr-dialog-card header-color="primary">
        <template #title>
          <yr-icon-btn color="white" @click="addBoardGameDialog = false">
            mdi-chevron-left
          </yr-icon-btn>
          <span class="white--text ml-4"></span>
        </template>

        <template #content>
          <v-container>
            <v-row>
              <yr-text-field
                label="Search Board Games"
                v-model="boardGameSearchValue"
                hide-details
                :disabled="loadingBoardGames"
                :loading="loadingBoardGames"
                @keyup.enter="filterBoardGames"
              ></yr-text-field>
              <yr-icon-btn
                class="ml-1"
                fab
                :disabled="loadingBoardGames"
                :loading="loadingBoardGames"
                @click="filterBoardGames"
                >mdi-magnify</yr-icon-btn
              >
            </v-row>
            <v-list class="pt-7">
              <v-list-item
                v-for="boardgame in searchedBoardGames"
                :key="'searched-' + boardgame.id"
                @click="openDetails(boardgame.id)"
              >
                <v-list-item-avatar tile>
                  <v-img
                    contain
                    :aspect-ratio="1"
                    :src="boardgame.thumbUrl"
                    :lazy-src="boardgame.thumbUrl"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    {{ boardgame.name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </template>
      </yr-dialog-card>
    </v-dialog>
    <template v-if="details != null">
      <v-dialog v-model="detailsDialog" max-width="600" scrollable>
        <yr-dialog-card>
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
                  <v-list-item-subtitle
                    >{{ details.minPlayers }}-{{ details.maxPlayers }} Player</v-list-item-subtitle
                  >
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
            <yr-btn text @click="detailsDialog = false" data-cy="cancel-add-btn">
              Cancel
            </yr-btn>
            <yr-btn
              color="success"
              @click="addAct"
              :loading="loadingAdd"
              :disabled="loadingAdd"
              data-cy="confirm-add-btn"
            >
              <v-icon>mdi-plus</v-icon>
              Add
            </yr-btn>
          </template>
        </yr-dialog-card>
      </v-dialog>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'
import AlertModule from '@/store/modules/alert-module'
import BoardGameModule from '@/store/modules/boardgame-module'

import { BoardGameModel } from '@/models/data/boardgame'

@Component
export default class AddBoardGameBtn extends Vue {
  private loadingBoardGames: boolean = false
  private loadingAdd: boolean = false
  private addBoardGameDialog: boolean = false
  private detailsDialog: boolean = false
  private details: BoardGameModel | null = null
  private boardGameSearchValue: string = ''

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private alert: AlertModule = getModule(AlertModule, this.$store)
  private boardGame: BoardGameModule = getModule(BoardGameModule, this.$store)

  filterBoardGames(): void {
    this.loadingBoardGames = true
    this.alert.reset()
    this.boardGame
      .fetchBoardGames(this.boardGameSearchValue)
      .then(
        (response: BoardGameModel[]) => {
          if (response.length === 0) {
            this.alert.setMessage('No board game found')
          }
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loadingBoardGames = false
      })
  }

  openDetails(id: string): void {
    this.details = this.boardGame.allSearched.filter(boardgame => boardgame.id === id)[0]

    this.detailsDialog = true
  }

  addAct(): void {
    const userId = this.auth.userId
    const boardGameId = this.details?.id

    if (userId && boardGameId) {
      this.loadingAdd = true
      this.alert.reset()
      this.boardGame
        .addToCollection({ userId, boardGameId })
        .then(
          (response: BoardGameModel[]) => {
            this.alert.setMessage('Added "' + this.details?.name + '" to your treasure!')
            this.alert.setType('success')
            this.detailsDialog = false
          },
          error => {
            this.alert.setMessage(error)
            this.alert.setType('error')
          }
        )
        .finally(() => {
          this.loadingAdd = false
        })
    }
  }

  get searchedBoardGames(): BoardGameModel[] {
    return this.boardGame.allSearched.filter(
      bg => !this.boardGame.collection.find(f => f.id === bg.id)
    )
  }
}
</script>
