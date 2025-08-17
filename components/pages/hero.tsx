import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ImageFrame } from "@/components/image-frame"

export default function HeroHeader() {
  return (
    <>
      <section className="space-y-8 pb-12 pt-4 md:space-y-16 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.github}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            "He who has a why to live can bear anyhow"
          </Link>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            Belive, Become.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Quotes Dont work until you do!
          </p>
          {/* <div className="flex gap-4">
            <Link
              href="/signin"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div> */}
        </div>
        {/* <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ImageFrame>
            <Image
              className="rounded-lg"
              src="/images/hero-img.jpg"
              width={1364}
              height={866}
              quality={100}
              alt="Header image"
            />
          </ImageFrame>
        </div> */}
      </section>
    </>
  )
}
