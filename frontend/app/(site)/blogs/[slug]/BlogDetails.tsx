"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  BlogCard,
  LoadingScreen,
  BreadcrumbDemo,
  ButtonDemo,
} from "@/components/index.js"
import Link from "next/link"
import { CornerUpLeftIcon } from "lucide-react"
import { LOCAL_DATA } from "@/constants/index"
import Image from "next/image"
import { useBlogStore } from "@/modules/blogs/store"
import { useParams } from "next/navigation"

const { preloaderImage, placeholderImage } = LOCAL_DATA.images

export default function BlogDetails() {
  const blog = useBlogStore((s) => s.blog)
  const getBlogAsync = useBlogStore((s) => s.getBlogAsync)
  const isBlogLoading = useBlogStore((s) => s.isBlogLoading)

  const { slug } = useParams()

  useEffect(() => {
    getBlogAsync({ blogId: slug })
  }, [])

  const breadcrumbItems = [
    {
      href: "/blogs",
      label: "Blogs",
    },
    {
      label: `${blog?.title}`,
    },
  ]

  return (
    <main id="blog-details-page">
      <div className="mb-3 flex items-center gap-2">
        <Link href="/blogs">
          <ButtonDemo variant="ghost" icon={<CornerUpLeftIcon />} size="icon" />
        </Link>

        <BreadcrumbDemo items={breadcrumbItems} />
      </div>

      {isBlogLoading ? (
        <span className="text-blue-500">Client loading...</span>
      ) : !blog ? (
        <h2 className="text-3xl text-gray-300">Empty</h2>
      ) : (
        <DetailsSection
          {...{ ...blog, image: blog.images && blog?.images[0].url }}
        />
      )}
    </main>
  )
}

const DetailsSection = ({
  image = "",
  title = "",
  description = "",
  content = "",
}) => {
  const [src, setSrc] = useState<any>(null)
  useEffect(() => {
    if (!image) return
    const img = new window.Image() as HTMLImageElement
    img.src = image
    img.onload = () => setSrc(image)
    img.onerror = () => setSrc(placeholderImage)
  }, [image])

  return (
    <section className="details p-0!">
      <article className="details-content">
        <div className="relative pt-[56.25%]">
          {src ? (
            <Image src={src} alt={title} fill />
          ) : (
            <img
              className="absolute top-[50%] left-[50%] h-20 w-20 transform-[translate(-50%,-50%)] object-contain"
              src={preloaderImage}
            />
          )}
        </div>
        <br />
        {title && <h1 className="mb-4 text-3xl">{title}</h1>}
        {description && <p className="text-gray-500">{description}</p>}
        <br />
        <br />

        <div className="" dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
    </section>
  )
}
