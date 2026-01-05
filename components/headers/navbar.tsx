"use client";

import { Header} from "@/components/headers/header"
import { Navigation } from "@/components/headers/navigation"
import { MobileHeader } from "./mobile-header"

export const Navbar = () => {

    return (
        <>

            <MobileHeader/>
           <Header/>
              <Navigation/>
        </>
    )
}