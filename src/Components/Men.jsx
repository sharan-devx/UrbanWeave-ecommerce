import React from "react";
import Products from "./Products";
import { PageHero } from "./Store/ui";
import bg from "./Assets/Men-Backgroung.jpg";

export default function Men() {
    return (
        <>
            <PageHero title="Men's Collection" text="Explore modern styles crafted for confidence." image={bg} />
            <Products category="Men" />
        </>
    );
}
