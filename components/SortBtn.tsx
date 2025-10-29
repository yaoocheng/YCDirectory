// components/SortButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const sortBtnList = [
  { label: '综合排序', value: 'latest' },
  { label: '最多浏览', value: 'views' },
  { label: '最多点赞', value: 'like' },
];

export default function SortButtons({ query }: { query?: string }) {
  const [active, setActive] = useState('latest');
  const router = useRouter();

  useEffect(() => {
    if (query) {
      setActive('latest');
    }
  }, [query]);

  const handleSortChange = (sortBy: string) => {
    setActive(sortBy);
    router.push(`?query=${query || ''}&sort=${sortBy}`, { scroll: false });
  };

  return (
    <div>
      {sortBtnList.map(item => (
        <Button
          key={item.value}
          variant={active === item.value ? 'default' : 'secondary'}
          className={`mr-2 ${active === item.value ? 'bg-[#FFE8F0] text-[#ee2b69] hover:bg-[#FFE8F0]' : 'text-black-300 bg-white shadow-none hover:text-[#ee2b69] hover:bg-white'}`}
          onClick={() => {
            handleSortChange(item.value);
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
