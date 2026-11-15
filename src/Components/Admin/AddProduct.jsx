import React, { useState } from "react";
import api from "../../api";
import { formatPrice } from "../../utils";
import ProductForm from "./ProductForm";
import { EMPTY_PRODUCT, toPayload } from "./productHelpers";
import { PageHeader } from "./ui";
import { useToast } from "./toast";

const AddProduct = () => {
    const toast = useToast();
    const [product, setProduct] = useState(EMPTY_PRODUCT);
    const [imageFailed, setImageFailed] = useState(false);

    const changeProduct = (e) => {
        const { name, value } = e.target;
        if (name === "image") setImageFailed(false);
        setProduct((current) => ({ ...current, [name]: value }));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        api.post("/products", toPayload(product))
            .then(() => {
                toast("New product added");
                setProduct(EMPTY_PRODUCT);
            })
            .catch((err) => {
                console.error(err);
                toast("Could not add the product", "danger");
            });
    };

    const hasImage = product.image && !imageFailed;

    return (
        <>
            <PageHeader title="Add product" subtitle="Fill in the details and check the preview before saving." />
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="adm-card">
                        <ProductForm product={product} onChange={changeProduct} onSubmit={submitHandler} />
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="adm-card adm-preview">
                        <div className="adm-sub mb-2">Store preview</div>
                        {hasImage ? (
                            <img src={product.image} alt="Product preview" onError={() => setImageFailed(true)} />
                        ) : (
                            <div className="adm-empty"><i className="bi bi-image"></i>Paste an image URL to see it here</div>
                        )}
                        <div className="mt-3 d-flex justify-content-between align-items-start gap-2">
                            <div>
                                <div className="fw-semibold">{product.name || "Product name"}</div>
                                <span className="badge bg-success-subtle text-success-emphasis">{product.category}</span>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold">{product.price !== "" ? formatPrice(Number(product.price)) : "Price"}</div>
                                {Number(product.originalPrice) > Number(product.price) && (
                                    <div className="adm-sub text-decoration-line-through">{formatPrice(Number(product.originalPrice))}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
