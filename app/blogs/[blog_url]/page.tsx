const BlogPage = async({params}: {params:Promise<{ blog_url: string }>}) => {
    const {blog_url} = await params
    return (
        <div>
            Blog Page url: {blog_url}
        </div>
    )
}

export default BlogPage