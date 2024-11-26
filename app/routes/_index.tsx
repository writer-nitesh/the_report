
const catgories = [
    {
        path: "/trending",
        name: "Trending"
    },
    {
        path: "/business",
        name: "Business"
    },
    {
        path: "/entertainment",
        name: "Entertainment"
    },
    {
        path: "/general",
        name: "General"
    },
    {
        path: "/health",
        name: "Health"
    },
    {
        path: "/science",
        name: "Science"
    },
    {
        path: "/sports",
        name: "Sports"
    },
    {
        path: "/technology",
        name: "Technology"
    },
]

export default function _index() {
    return (
        <div className='flex flex-col gap-4 py-2 h-screen w-screen items-center'>
            <div className='text-3xl font-bold'>The Report</div>
            <div>

                {
                    catgories.map((category, index) => {
                        return (
                            <div key={index}>
                                <a href="/trending">{category.name}</a>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
