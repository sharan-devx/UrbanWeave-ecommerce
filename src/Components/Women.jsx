import React from "react";
import Products from "./Products";
import { PageHero } from "./Store/ui";
import bg from "./Assets/Women-Background.webp";

export default function Women() {
    return (
        <>
            <PageHero title="Women's Collection" text="Elegant, easy styles for every day." image={bg} />
            <Products category="Women" />
        </>
    );
}
