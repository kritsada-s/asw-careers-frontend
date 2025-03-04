"use client";

import SearchBox from "../ui/HomeSearchBox";

function HomeSearchHeader() {
    const handleSearch = (searchTerm: string) => {
        const url = new URL('/jobs', window.location.origin);
        url.searchParams.set('search', searchTerm);
        window.location.href = url.toString();
    };
    return (
        <section id="homeSearchHeader" className="min-h-[370px] relative flex justify-center items-center before:absolute before:bg-primary-700 before:w-full before:h-full before:opacity-70">
            <div className="searchBox relative flex flex-col items-center w-full px-3 lg:px-0">
                <h2 className="text-white text-4xl lg:text-[52px] font-light text-center">ร่วมงานกับ<span className="font-medium">แอสเซทไวส์</span></h2>
                <SearchBox onSearch={handleSearch}/>
            </div>
        </section>
    );
}

export default HomeSearchHeader;