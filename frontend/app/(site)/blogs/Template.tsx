"use client"

import React, { useEffect } from "react"
import { BlogCard } from "@/components/index.js"
import { Blog } from "@/modules/blogs/types"
import { useBlogStore } from "@/modules/blogs/store"

export default function Template() {
  return (
    <main className="blog-page">
      <HeroSection />
    </main>
  )
}

const HeroSection = () => {
  const getBlogsAsync = useBlogStore((s) => s.getBlogsAsync)
  const blogs = useBlogStore((s) => s.blogs)
  const isBlogsLoading = useBlogStore((s) => s.isBlogsLoading)

  useEffect(() => {
    getBlogsAsync()
  }, [])

  return (
    <section className="hero p-0!" id="blog-page">
      <h2 className="text-1xl mx-auto mb-8 w-fit font-medium! uppercase">
        <div className="pb-2">From the blog</div>
        <div className="line mx-auto h-[3px] w-[70%] bg-black"></div>
      </h2>
      <div className="blog-list grid gap-5 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {isBlogsLoading ? (
          <span className="text-blue-500">
            Client loading...
          </span>
        ) : blogs.length ? (
          blogs.map((blogItem: any, index: any) => {
            return (
              <BlogCard
                key={index}
                {...{
                  ...blogItem,
                  description: blogItem.shortDescription,
                  image: blogItem.images[0].url,
                }}
              />
            )
          })
        ) : (
          <h2 className="text-3xl text-gray-300">Empty</h2>
        )}
      </div>
    </section>
  )
}
