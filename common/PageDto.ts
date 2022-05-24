export class PageDto<T>{
    isFirst: boolean;
    isLast: boolean;
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
    list: T[];
    constructor(
        totalCount: number,
        pageSize: number,
        currentPage: number,
        list: T[],
    ) {
        if (currentPage === 1) this.isFirst = true;
        else this.isFirst = false;
        this.pageSize = pageSize;
        this.currentPage = currentPage;
        this.totalElements = totalCount;
        this.totalPage = Math.ceil(totalCount / pageSize);
        this.list = list;

        if (currentPage === Math.ceil(totalCount / pageSize)) this.isLast = true;
        else this.isLast = false;
    }
}