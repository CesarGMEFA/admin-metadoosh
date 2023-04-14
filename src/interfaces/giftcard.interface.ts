export interface giftcard {
  id: number,
  created_at?:string | number
  title: string,
  description: string,
  imageSrc: string,
  price: string[],
  views: string
}