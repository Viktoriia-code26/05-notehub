
import ReactPaginate from "react-paginate";
import css from "../Pagination/Pagination.module.css"

interface PaginationProps{
       currentPage: number;
       totalPages: number;
       onPageChange: (page: number) => void;
}

export default function Pagination({
       currentPage,
       totalPages,
       onPageChange,
}: PaginationProps) {
       if (totalPages <= 1) return null;
     
       return (
              <div className={css.paginationContainer}>
 <ReactPaginate
        breakLabel="..."
        nextLabel="→"
        previousLabel="←"
        onPageChange={({ selected }) => onPageChange(selected + 1)} 
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={currentPage - 1} 
        containerClassName={css.pagination}
        activeClassName={css.active}
        pageLinkClassName={css.pageLink}
        previousLinkClassName={css.pageLink}
        nextLinkClassName={css.pageLink}
        disabledClassName={css.disabled}
                     />
                     </div>
                     );
              }