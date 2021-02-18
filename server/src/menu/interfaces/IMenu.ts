export interface IMenu {
  categories: string[]
  items: {
    [categoryName: string]: Array<{
      name: string
      description: string
      price: string
    }>
  }
}
