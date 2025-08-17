import { Navigation } from "@/types"

export const navLinks: Navigation = {
  data: [
    {
      title: "Home",
      href: "/",
    },
    // {
    //   title: "Features",
    //   href: "/#features",
    // },
    // {
    //   title: "Overview",
    //   href: "/#overview",
    // },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Finance",
      href: "/finance",
    },
    {
      title: "Routine",
      href: "/routine",
    },
  ],
}

export const dashboardLinks: Navigation = {
  data: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Activities",
      href: "/dashboard/activities",
      icon: "activity",
    },
    {
      title: "Finance",
      href: "/finance",
      icon: "dollarSign",
    },
    {
      title: "Routine",
      href: "/routine",
      icon: "calendar",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
