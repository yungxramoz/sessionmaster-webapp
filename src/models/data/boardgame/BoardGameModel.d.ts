export default interface BoardGameModel {
  id: string
  name: string
  publishYear?: number
  minPlayer?: number
  maxPlayer?: number
  minPlaytime?: number
  maxPlaytime?: number
  description: string
  thumbUrl: string
  imageUrl: string
}
