import { Typography } from "@mui/material";

function HomeJobsListed() {
    return (
        <div id="jobListed" className="min-h-[500px] bg-gradient-to-b from-white to-[#F2F9FF] py-5 lg:pt-9 lg:pb-12">
            <div className="container px-4 lg:px-0">
                <Typography variant="h3" className="text-primary">ตำแหน่งงานทั้งหมด</Typography>
            </div>
        </div>
    );
}

export default HomeJobsListed;