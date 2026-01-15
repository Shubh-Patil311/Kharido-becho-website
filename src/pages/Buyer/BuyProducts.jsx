import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
// import FilterSidebar from '../../components/FilterSidebar';

export default function BuyProducts() {
  const [category, setCategory] = useState("electronics");
  const [subCategory, setSubCategory] = useState("mobiles");
  const [filters, setFilters] = useState({
    priceMax: 1000000,
    brand: "",
    model: "",
    year: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // TODO: fetch products based on category/subCategory/filters
    // Example: productsApi.get(category, subCategory, filters).then(...)
    setProducts([]); // placeholder
  }, [category, subCategory, filters]);

  return (
    <div className="flex flex-col md:flex-row container mx-auto py-8 px-4">
      <div className="hidden md:block md:w-1/4 pr-4">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          subCategory={subCategory}
        />
      </div>
      <div className="flex-1">
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => {
              setCategory("electronics");
              setSubCategory("mobiles");
            }}
            className={`px-4 py-2 ${
              category === "electronics"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Electronics
          </button>
          <button
            onClick={() => {
              setCategory("vehicles");
              setSubCategory("cars");
            }}
            className={`px-4 py-2 ${
              category === "vehicles"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Vehicles
          </button>
        </div>
        <div className="mb-6">
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border rounded p-2 w-full md:w-64"
          >
            {category === "electronics" ? (
              <>
                <option value="mobiles">Mobiles</option>
                <option value="laptops">Laptops</option>
              </>
            ) : (
              <>
                <option value="cars">Cars</option>
                <option value="bikes">Bikes</option>
              </>
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
