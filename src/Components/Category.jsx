import Products from "./Products";
import { PageHero } from "./Store/ui";
import bg from "./Assets/Category-Background.avif";

export default function Category() {
    return (
        <>
            <PageHero title="Shop Categories" text="Explore styles that match your vibe" image={bg} />
            <Products />
        </>
    );
}
