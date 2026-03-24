import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import CursorSparkles from "./Cursorsmoke";

export default function ProductDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  if (!product) {
    return <div className="pd-empty">No product found</div>;
  }

  return (
    <div className="pd-page">
      <CursorSparkles />
      <div className="pd-bg" />

      <div className="pd-container">
        <button onClick={() => navigate(-1)} className="pd-back">
          ← Back to Collection
        </button>

        <div className="pd-grid">
          {/* IMAGE */}
          <div className="pd-image-wrap">
            <img
              src={product.img}
              alt={product.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1617038220319-276d3cfab638";
              }}
            />
          </div>

          {/* DETAILS */}
          <div className="pd-details">
            <h1 className="pd-title">{product.name}</h1>

            {product.tag && <span className="pd-tag">{product.tag}</span>}

            <p className="pd-price">{product.price}</p>

            <div className="pd-divider" />

            <div className="pd-info">
              <p>
                <span>Karat:</span> {product.karat}
              </p>
              <p>
                <span>Weight:</span> {product.weight}
              </p>
            </div>

            <p className="pd-desc">
              Crafted with precision and timeless elegance, this piece blends
              traditional artistry with modern sophistication. Designed to
              complement every occasion.
            </p>

            <div className="pd-actions">
              <button className="pd-btn primary" onClick={""}>
                <Link to="/contact">Enquiry</Link>
              </button>
            </div>
          </div>
        </div>

        {/* EXTRA */}
        <div className="pd-extra">
          <div>
            <h3>Authentic Gold</h3>
            <p>Certified purity and hallmark guarantee.</p>
          </div>

          <div>
            <h3>Craftsmanship</h3>
            <p>Handcrafted by expert artisans.</p>
          </div>

          <div>
            <h3>Lifetime Value</h3>
            <p>A timeless investment in gold.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
