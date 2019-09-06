export interface PaginationData<T> {
  pageCount: number
  pageIndex: number
  dataCount: number
  data: Array<T>
}