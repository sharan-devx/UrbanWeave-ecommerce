import React from "react";
import Products from "./Products";
import { PageHero } from "./Store/ui";

export default function Kids() {
    return (
        <>
            <PageHero
                title="Kids' Collection"
                text="Playful, colorful styles made for every adventure."
                gradient="linear-gradient(135deg, #ff9a3c, #ff5e8a)"
            />
            <Products category="Kids" />
        </>
    );
}
