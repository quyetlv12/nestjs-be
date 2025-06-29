export class PageResponseDto<T> {
  data: T[];
  meta : {
    total: number;
    page: number;
    limit: number;
  }


  constructor(data: T[], meta: { total: number; page: number; limit: number }) {
    this.data = data;
    this.meta = meta;
  }
}
