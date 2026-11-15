import React from "react";

const Field = ({ label, className = "", children }) => (
    <div className={className}>
        <label className="d-block">
            <span className="form-label small fw-semibold">{label}</span>
            {children}
        </label>
    </div>
);

const ProductForm = ({ product, onChange, onSubmit, submitProps = {} }) => (
    <form onSubmit={onSubmit} className="row g-3">
        <Field label="Product name" className="col-12">
            <input type="text" value={product.name} onChange={onChange} name="name" placeholder="e.g. Oversized T-Shirt" className="form-control" required />
        </Field>

        <Field label="Price (₹)" className="col-6">
            <input type="number" min="0" value={product.price} onChange={onChange} name="price" placeholder="999" className="form-control" required />
        </Field>
        <Field label="Original price (₹)" className="col-6">
            <input type="number" min="0" value={product.originalPrice} onChange={onChange} name="originalPrice" placeholder="1299" className="form-control" />
        </Field>

        <Field label="Rating (1 to 5)" className="col-6">
            <input type="number" min="1" max="5" value={product.rating} onChange={onChange} name="rating" placeholder="4" className="form-control" required />
        </Field>
        <Field label="Category" className="col-6">
            <select value={product.category} onChange={onChange} name="category" className="form-select" required>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
            </select>
        </Field>

        <Field label="Image URL" className="col-12">
            <input type="url" value={product.image} onChange={onChange} name="image" placeholder="https://..." className="form-control" required />
        </Field>
        <Field label="Description" className="col-12">
            <textarea name="description" value={product.description} onChange={onChange} placeholder="Describe the fabric, fit and style" rows="5" className="form-control" required></textarea>
        </Field>

        <div className="col-12">
            <input type="submit" value="Save product" className="btn btn-success w-100" {...submitProps} />
        </div>
    </form>
);

export default ProductForm;
