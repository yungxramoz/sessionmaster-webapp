<template>
  <v-dialog
    v-model="addBoardGameDialog"
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
          mdi-arrow-left
        </yr-icon-btn>
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
          <v-row align="center">
            <v-col
              cols="4"
              class="d-flex child-flex"
              v-for="boardgame in searchedBoardGames"
              :key="'searched-' + boardgame.id"
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
          </v-row>
        </v-container>
      </template>
    </yr-dialog-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'
import BoardGameModule from '@/store/modules/boardgame-module'

import { BoardGameModel } from '@/models/data/boardgame'

@Component
export default class AddBoardGameBtn extends Vue {
  private loadingBoardGames: boolean = false
  private addBoardGameDialog: boolean = false
  private boardGames: BoardGameModel[] | null = null
  private boardGameSearchValue: string = ''

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private boardGame: BoardGameModule = getModule(BoardGameModule, this.$store)

  filterBoardGames() {
    this.loadingBoardGames = true
    this.boardGame
      .fetchBoardGames(this.boardGameSearchValue)
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
        this.loadingBoardGames = false
      })
  }

  get searchedBoardGames(): BoardGameModel[] {
    return this.boardGame.allSearched
  }
}
</script>
