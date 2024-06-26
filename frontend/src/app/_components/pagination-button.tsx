"use client"
import { useRouter } from 'next/navigation';
import React, {useState, useEffect} from "react"
import { SearchParamsType } from '../_type/search-param';

export default function PaginationButton ({searchParams} : {searchParams: SearchParamsType}){
    const router = useRouter();
    const [page, setPage] = useState<number>(0)

    const next = () => {
        const newPage = page + 2;
        setPage(newPage);

        const params = new URLSearchParams();
        params.append('page', newPage.toString());

        router.push(`?${params.toString()}`, { scroll: false });
    }

    const prev = () => {
        if (page === 0) {
            return
        }
        const newPage = page - 2;
        setPage(newPage);

        const params = new URLSearchParams();
        params.append('page', newPage.toString());

        router.push(`?${params.toString()}`, { scroll: false });
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && searchParams) {
            if (searchParams.page){
                setPage(+searchParams.page)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])    

    return (
        <div>
            <button onClick={prev}>prev -2</button>
            <button onClick={next}>next +2</button>
        </div>
    )
}