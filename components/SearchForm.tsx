import React from 'react';
import Form from 'next/form';
import {Search} from "lucide-react";
import SearchFormReset from './SearchFormReset';

function SearchForm({query}: {query: string}) {
  return (
    <>
        <Form action="/" scroll={false} className="search-form">
            <input name="query" defaultValue={query}  placeholder="搜索创业项目" className="search-input" />

            <div className="flex gap-2">
                {query && <SearchFormReset />}

                <button type="submit" className="search-btn text-white">
                    <Search className="size-5" />
                </button>
            </div>
        </Form>
    </>
  )
}

export default SearchForm