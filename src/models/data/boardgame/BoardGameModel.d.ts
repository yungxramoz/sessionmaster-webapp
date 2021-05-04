export default interface BoardGameModel {
  id: string
  name: string
  publishYear?: number
  minPlayers?: number
  maxPlayers?: number
  minPlaytime?: number
  maxPlaytime?: number
  description: string
  thumbUrl: string
  imageUrl: string
}
