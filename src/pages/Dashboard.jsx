// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// // Shared Component
// import DashboardStats from "../components/Dashboard/DashboardStats";
// import BikeTable from "../components/Bike/Seller/BikeTable";

// // SERVICES
// import {
//   getLaptopsByStatus,
//   deleteLaptop,
// } from "../store/services/laptopServices";

// import {
//   getMobilesByStatus,
//   getMobilesBySeller,
//   deleteMobile,
// } from "../store/services/mobileServices";

// import {
//   getBikesByStatus,
//   getBikesBySeller,
//   deleteBike,
//   getSellerBikesRaw
// } from "../store/services/bikeServices";
// import {
//   getCarsByStatus,
//   getCarsBySeller,
//   deleteCar
// } from "../store/services/carServices";

// const STATUS_FILTERS = ["ACTIVE", "PENDING", "SOLD"];

// // ----------------------------------------------------------------------

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const sellerId = Number(localStorage.getItem("sellerId"));

//   const [activeCategory, setActiveCategory] = useState(
//     location.state?.tab || "LAPTOPS"
//   );

//   const [laptops, setLaptops] = useState([]);
//   const [bikes, setBikes] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [mobiles, setMobiles] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // ----------------------------------------------------------------------
//   // LAPTOP FETCH
//   const fetchLaptops = useCallback(async () => {
//     setLoading(true);
//     try {
//       const results = await Promise.allSettled(
//         STATUS_FILTERS.map((status) =>
//           getLaptopsByStatus(sellerId, status).then((data) => ({
//             status,
//             data: Array.isArray(data) ? data : [],
//           }))
//         )
//       );

//       const merged = results.flatMap((res, idx) => {
//         if (res.status !== "fulfilled") return [];
//         return res.value.data.map((item) => ({
//           ...item,
//           status: item.status || STATUS_FILTERS[idx],
//         }));
//       });

//       setLaptops(merged);
//     } catch {
//       toast.error("Failed to load laptops");
//     } finally {
//       setLoading(false);
//     }
//   }, [sellerId]);

//   // BIKE FETCH
//   const fetchBikes = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Robust fetch: Get all and let frontend categorize
//       // This avoids 400 errors from backend status endpoints
//       const data = await getSellerBikesRaw(sellerId);
//       setBikes(data);
//     } catch {
//       toast.error("Failed to load bikes");
//     } finally {
//       setLoading(false);
//     }
//   }, [sellerId]);

//   // CARS
//   const fetchCars = useCallback(async () => {
//     setLoading(true);
//     try {
//       const results = await Promise.allSettled(
//         STATUS_FILTERS.map((status) =>
//           getCarsByStatus(sellerId, status).then((data) => ({
//             status,
//             data: Array.isArray(data) ? data : [],
//           }))
//         )
//       );

//       const merged = results.flatMap((res, idx) => {
//         if (res.status !== "fulfilled") return [];
//         return res.value.data.map((item) => ({
//           ...item,
//           status: item.status || STATUS_FILTERS[idx],
//         }));
//       });
//       setCars(merged);
//     } catch {
//       toast.error("Failed to load cars");
//     } finally {
//       setLoading(false);
//     }
//   }, [sellerId]);

//   // MOBILES
//   const fetchMobiles = useCallback(async () => {
//     setLoading(true);
//     try {
//       const results = await Promise.allSettled(
//         STATUS_FILTERS.map((status) =>
//           getMobilesByStatus(sellerId, status).then((data) => ({
//             status,
//             data: Array.isArray(data) ? data : [],
//           }))
//         )
//       );

//       const merged = results.flatMap((res, idx) => {
//         if (res.status !== "fulfilled") return [];
//         return res.value.data.map((item) => ({
//           ...item,
//           status: item.status || STATUS_FILTERS[idx],
//         }));
//       });
//       setMobiles(merged);
//     } catch {
//       toast.error("Failed to load mobiles");
//     } finally {
//       setLoading(false);
//     }
//   }, [sellerId]);

//   // ----------------------------------------------------------------------
//   // FETCH ON CATEGORY CHANGE
//   useEffect(() => {
//     if (!sellerId) return;

//     if (activeCategory === "LAPTOPS") fetchLaptops();
//     if (activeCategory === "BIKES") fetchBikes();
//     if (activeCategory === "CARS") fetchCars();
//     if (activeCategory === "MOBILES") fetchMobiles();
//   }, [
//     activeCategory,
//     sellerId,
//     fetchLaptops,
//     fetchBikes,
//     fetchCars,
//     fetchMobiles,
//   ]);

//   // ----------------------------------------------------------------------
//   // DELETE HANDLERS

//   const handleDeleteLaptop = async (item) => {
//     const id = item.laptopId ?? item.id ?? item.laptop_id;

//     if (!id) return toast.error("Laptop ID missing");
//     if (!window.confirm("Delete this laptop?")) return;

//     try {
//       await deleteLaptop(id);
//       fetchLaptops();
//       toast.success("Laptop deleted");
//     } catch (error) {
//       toast.error("Delete failed");
//     }
//   };

//   const handleDeleteBike = async (item) => {
//     const id = item.bike_id ?? item.id ?? item.bikeId;

//     if (!id) return toast.error("Bike ID missing");
//     if (!window.confirm("Delete this bike?")) return;

//     try {
//       await deleteBike(id);
//       fetchBikes();
//       toast.success("Bike deleted");
//     } catch (err) {
//       toast.error("Bike delete failed");
//     }
//   };

//   const handleDeleteCar = async (item) => {
//     const id = item.carId ?? item.id ?? item.car_id;

//     if (!id) return toast.error("Car ID missing");
//     if (!window.confirm("Delete this car?")) return;

//     try {
//       await deleteCar(id);
//       fetchCars();
//       toast.success("Car deleted");
//     } catch {
//       toast.error("Car delete failed");
//     }
//   };

//   const handleDeleteMobile = async (item) => {
//     const id = item.mobileId ?? item.id ?? item.mobile_id;

//     if (!id) return toast.error("Mobile ID missing");
//     if (!window.confirm("Delete this mobile?")) return;

//     try {
//       await deleteMobile(id);
//       fetchMobiles();
//       toast.success("Mobile deleted");
//     } catch {
//       toast.error("Mobile delete failed");
//     }
//   };

//   // ----------------------------------------------------------------------
//   // EDIT ROUTES

//   const goToEditLaptop = (item) => {
//     const id = item.laptopId ?? item.id ?? item.laptop_id;
//     navigate(`/sell-laptop/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditBike = (item) => {
//     const id = item.bike_id ?? item.id ?? item.bikeId;
//     navigate(`/sell-bike/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditCar = (item) => {
//     const id = item.carId ?? item.id ?? item.car_id;
//     navigate(`/sell-car/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditMobile = (item) => {
//     const id = item.mobileId ?? item.id ?? item.mobile_id;
//     navigate(`/sell-mobile/${id}`, { state: { mode: "edit", item } });
//   };

//   // ----------------------------------------------------------------------
//   // UI --------------------------------------------------------------------

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Dashboard</h1>

//         <button
//           onClick={() => navigate("/sellfrom")}
//           className="px-5 py-2 bg-green-600 text-white rounded-md"
//         >
//           + Sell Product
//         </button>
//       </div>

//       {/* STATUS SUMMARY */}
//       <DashboardStats
//         listings={
//           activeCategory === "LAPTOPS"
//             ? laptops
//             : activeCategory === "BIKES"
//               ? bikes
//               : activeCategory === "CARS"
//                 ? cars
//                 : mobiles
//         }
//       />

//       {/* CATEGORY TABS */}
//       <div className="flex gap-3 my-6">
//         {["LAPTOPS", "BIKES", "CARS", "MOBILES"].map((cat) => (
//           <button
//             key={cat}
//             onClick={() => {
//               setActiveCategory(cat);
//               navigate(".", { replace: true, state: { tab: cat } });
//             }}
//             className={`px-5 py-2 rounded-md font-semibold ${activeCategory === cat
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800"
//               }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* TABLES */}
//       {activeCategory === "LAPTOPS" && (
//         <LaptopTable
//           items={laptops}
//           onEdit={goToEditLaptop}
//           onDelete={handleDeleteLaptop}
//         />
//       )}

//       {activeCategory === "BIKES" && (
//         <BikeTable
//           items={bikes}
//           onEdit={goToEditBike}
//           onDelete={handleDeleteBike}
//         />
//       )}

//       {activeCategory === "CARS" && (
//         <CarTable
//           items={cars}
//           onEdit={goToEditCar}
//           onDelete={handleDeleteCar}
//         />
//       )}

//       {activeCategory === "MOBILES" && (
//         <MobileTable
//           items={mobiles}
//           onEdit={goToEditMobile}
//           onDelete={handleDeleteMobile}
//         />
//       )}
//     </div>
//   );
// }

// // ----------------------------------------------------------------------
// // REUSABLE TABLE COMPONENTS
// // ----------------------------------------------------------------------

// function CategoryWrapper({ title, children }) {
//   return (
//     <div className="p-4 border rounded-md bg-white shadow-sm mb-6">
//       <h2 className="text-xl font-semibold mb-3">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Table({ children }) {
//   return (
//     <table className="w-full border bg-white rounded-sm">{children}</table>
//   );
// }

// function Th({ children }) {
//   return <th className="p-3 border bg-gray-100">{children}</th>;
// }

// function Td({ children }) {
//   return <td className="p-3 border text-sm">{children}</td>;
// }

// function ActionBtn({ children, onClick, color }) {
//   const cls =
//     color === "blue"
//       ? "bg-blue-600 hover:bg-blue-700"
//       : "bg-red-600 hover:bg-red-700";

//   return (
//     <button
//       onClick={onClick}
//       className={`px-3 py-1 rounded-md text-white text-sm ${cls} mr-2`}
//     >
//       {children}
//     </button>
//   );
// }

// // ----------------------------------------------------------------------
// // LAPTOP TABLE
// // ----------------------------------------------------------------------

// function LaptopTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Laptop Listings">
//       {items.length === 0 ? (
//         <p>No laptops found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Status</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((l) => (
//               <tr key={l.laptopId ?? l.id}>
//                 <Td>{l.brand}</Td>
//                 <Td>{l.model}</Td>
//                 <Td>{l.price}</Td>
//                 <Td>{l.status}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(l)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(l)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

// // ----------------------------------------------------------------------
// // CAR TABLE
// // ----------------------------------------------------------------------

// function CarTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Car Listings">
//       {items.length === 0 ? (
//         <p>No cars found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Status</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((c) => (
//               <tr key={c.carId}>
//                 <Td>{c.brand}</Td>
//                 <Td>{c.model}</Td>
//                 <Td>{c.price}</Td>
//                 <Td>{c.status}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(c)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(c)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

// // ----------------------------------------------------------------------
// // MOBILE TABLE
// // ----------------------------------------------------------------------

// function MobileTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Mobile Listings">
//       {items.length === 0 ? (
//         <p>No mobiles found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Status</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((m) => (
//               <tr key={m.mobileId}>
//                 <Td>{m.brand}</Td>
//                 <Td>{m.model}</Td>
//                 <Td>{m.price}</Td>
//                 <Td>{m.status}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(m)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(m)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Shared Component
import DashboardStats from "../components/Dashboard/DashboardStats";
import LiveProductsSection from "../components/LiveProducts/LiveProductsSection";

// SERVICES
import {
  getLaptopsByStatus,
  deleteLaptop,
} from "../store/services/laptopServices";

import { getBikesBySeller, deleteBike } from "../store/services/bikeServices";

import { getCarsBySeller, deleteCar } from "../store/services/carServices";

import {
  getMobilesBySeller,
  deleteMobile,
} from "../store/services/mobileServices";

const STATUS_FILTERS = ["ACTIVE", "PENDING", "SOLD"];

// ----------------------------------------------------------------------

export default function Dashboard() {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [activeCategory, setActiveCategory] = useState("LAPTOPS");

  const [laptops, setLaptops] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [mobiles, setMobiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------------------
  // LAPTOP FETCH
  const fetchLaptops = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        STATUS_FILTERS.map((status) =>
          getLaptopsByStatus(sellerId, status).then((data) => ({
            status,
            data: Array.isArray(data) ? data : [],
          }))
        )
      );

      const merged = results.flatMap((res, idx) => {
        if (res.status !== "fulfilled") return [];
        return res.value.data.map((item) => ({
          ...item,
          status: item.status || STATUS_FILTERS[idx],
        }));
      });

      setLaptops(merged);
    } catch {
      toast.error("Failed to load laptops");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  // BIKE FETCH
  const fetchBikes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBikesBySeller(sellerId);
      setBikes(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load bikes");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  // CARS
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCarsBySeller(sellerId);
      setCars(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  // MOBILES
  const fetchMobiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMobilesBySeller(sellerId);
      setMobiles(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load mobiles");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  // ------------------------
  // FETCH ON CATEGORY CHANGE
  useEffect(() => {
    if (!sellerId) return;

    if (activeCategory === "LAPTOPS") fetchLaptops();
    if (activeCategory === "BIKES") fetchBikes();
    if (activeCategory === "CARS") fetchCars();
    if (activeCategory === "MOBILES") fetchMobiles();
  }, [
    activeCategory,
    sellerId,
    fetchLaptops,
    fetchBikes,
    fetchCars,
    fetchMobiles,
  ]);

  // ----------------------------------------------------------------------
  // DELETE HANDLERS

  const handleDeleteLaptop = async (item) => {
    const id = item.laptopId ?? item.id ?? item.laptop_id;

    if (!id) return toast.error("Laptop ID missing");
    if (!window.confirm("Delete this laptop?")) return;

    try {
      await deleteLaptop(id);
      fetchLaptops();
      toast.success("Laptop deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleDeleteBike = async (item) => {
    const id = item.bike_id ?? item.id ?? item.bikeId;

    if (!id) return toast.error("Bike ID missing");
    if (!window.confirm("Delete this bike?")) return;

    try {
      await deleteBike(id);
      fetchBikes();
      toast.success("Bike deleted");
    } catch (err) {
      toast.error("Bike delete failed");
    }
  };

  const handleDeleteCar = async (item) => {
    const id = item.carId ?? item.id ?? item.car_id;

    if (!id) return toast.error("Car ID missing");
    if (!window.confirm("Delete this car?")) return;

    try {
      await deleteCar(id);
      fetchCars();
      toast.success("Car deleted");
    } catch {
      toast.error("Car delete failed");
    }
  };

  const handleDeleteMobile = async (item) => {
    const id = item.mobileId ?? item.id ?? item.mobile_id;

    if (!id) return toast.error("Mobile ID missing");
    if (!window.confirm("Delete this mobile?")) return;

    try {
      await deleteMobile(id);
      fetchMobiles();
      toast.success("Mobile deleted");
    } catch {
      toast.error("Mobile delete failed");
    }
  };

  // ----------------------------------------------------------------------
  // EDIT ROUTES

  const goToEditLaptop = (item) => {
    const id = item.laptopId ?? item.id ?? item.laptop_id;
    navigate(`/sell-laptop/${id}`, { state: { mode: "edit", item } });
  };

  const goToEditBike = (item) => {
    const id = item.bike_id ?? item.id ?? item.bikeId;
    navigate(`/sell-bike/${id}`, { state: { mode: "edit", item } });
  };

  const goToEditCar = (item) => {
    const id = item.carId ?? item.id ?? item.car_id;
    navigate(`/sell-car/${id}`, { state: { mode: "edit", item } });
  };

  const goToEditMobile = (item) => {
    const id = item.mobileId ?? item.id ?? item.mobile_id;
    navigate(`/sell-mobile/${id}`, { state: { mode: "edit", item } });
  };

  // ----------------------------------------------------------------------
  // UI --------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => navigate("/sellfrom")}
          className="px-5 py-2 bg-green-600 text-white rounded-md"
        >
          + Sell Product
        </button>
      </div>

      {/* STATUS SUMMARY */}
      <DashboardStats
        listings={
          activeCategory === "LAPTOPS"
            ? laptops
            : activeCategory === "BIKES"
            ? bikes
            : activeCategory === "CARS"
            ? cars
            : mobiles
        }
      />

      {/* CATEGORY TABS */}
      <div className="flex gap-3 my-6 flex-wrap">
        {["LAPTOPS", "BIKES", "CARS", "MOBILES", "LIVE PRODUCTS"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-md font-semibold transition-all ${
              activeCategory === cat
                ? cat === "LIVE PRODUCTS"
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg"
                  : "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat === "LIVE PRODUCTS" && "🔴 "}
            {cat}
          </button>
        ))}
      </div>

      {/* TABLES */}
      {activeCategory === "LAPTOPS" && (
        <LaptopTable
          items={laptops}
          onEdit={goToEditLaptop}
          onDelete={handleDeleteLaptop}
        />
      )}

      {activeCategory === "BIKES" && (
        <BikeTable
          items={bikes}
          onEdit={goToEditBike}
          onDelete={handleDeleteBike}
        />
      )}

      {activeCategory === "CARS" && (
        <CarTable
          items={cars}
          onEdit={goToEditCar}
          onDelete={handleDeleteCar}
        />
      )}

      {activeCategory === "MOBILES" && (
        <MobileTable
          items={mobiles}
          onEdit={goToEditMobile}
          onDelete={handleDeleteMobile}
        />
      )}

      {/* LIVE PRODUCTS SECTION */}
      {activeCategory === "LIVE PRODUCTS" && <LiveProductsSection />}
    </div>
  );
}

// ----------------------------------------------------------------------
// REUSABLE TABLE COMPONENTS
// ----------------------------------------------------------------------

function CategoryWrapper({ title, children }) {
  return (
    <div className="p-4 border rounded-md bg-white shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Table({ children }) {
  return (
    <table className="w-full border bg-white rounded-sm">{children}</table>
  );
}

function Th({ children }) {
  return <th className="p-3 border bg-gray-100">{children}</th>;
}

function Td({ children }) {
  return <td className="p-3 border text-sm">{children}</td>;
}

function ActionBtn({ children, onClick, color }) {
  const cls =
    color === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-red-600 hover:bg-red-700";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-white text-sm ${cls} mr-2`}
    >
      {children}
    </button>
  );
}

// ----------------------------------------------------------------------
// LAPTOP TABLE
// ----------------------------------------------------------------------

function LaptopTable({ items, onEdit, onDelete }) {
  return (
    <CategoryWrapper title="Laptop Listings">
      {items.length === 0 ? (
        <p>No laptops found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((l) => (
              <tr key={l.laptopId ?? l.id}>
                <Td>{l.brand}</Td>
                <Td>{l.model}</Td>
                <Td>{l.price}</Td>
                <Td>{l.status}</Td>
                <Td>
                  <ActionBtn onClick={() => onEdit(l)} color="blue">
                    Edit
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(l)} color="red">
                    Delete
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CategoryWrapper>
  );
}

// ----------------------------------------------------------------------
// BIKE TABLE
// ----------------------------------------------------------------------

function BikeTable({ items, onEdit, onDelete }) {
  return (
    <CategoryWrapper title="Bike Listings">
      {items.length === 0 ? (
        <p>No bikes found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Variant</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((b) => (
              <tr key={b.bike_id}>
                <Td>{b.brand}</Td>
                <Td>{b.model}</Td>
                <Td>{b.variant}</Td>
                <Td>{b.prize}</Td>
                <Td>{b.status}</Td>
                <Td>
                  <ActionBtn onClick={() => onEdit(b)} color="blue">
                    Edit
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(b)} color="red">
                    Delete
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CategoryWrapper>
  );
}

// ----------------------------------------------------------------------
// CAR TABLE
// ----------------------------------------------------------------------

function CarTable({ items, onEdit, onDelete }) {
  return (
    <CategoryWrapper title="Car Listings">
      {items.length === 0 ? (
        <p>No cars found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.carId}>
                <Td>{c.brand}</Td>
                <Td>{c.model}</Td>
                <Td>{c.price}</Td>
                <Td>{c.status}</Td>
                <Td>
                  <ActionBtn onClick={() => onEdit(c)} color="blue">
                    Edit
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(c)} color="red">
                    Delete
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CategoryWrapper>
  );
}

// ----------------------------------------------------------------------
// MOBILE TABLE
// ----------------------------------------------------------------------

function MobileTable({ items, onEdit, onDelete }) {
  return (
    <CategoryWrapper title="Mobile Listings">
      {items.length === 0 ? (
        <p>No mobiles found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((m) => (
              <tr key={m.mobileId}>
                <Td>{m.brand}</Td>
                <Td>{m.model}</Td>
                <Td>{m.price}</Td>
                <Td>{m.status}</Td>
                <Td>
                  <ActionBtn onClick={() => onEdit(m)} color="blue">
                    Edit
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(m)} color="red">
                    Delete
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CategoryWrapper>
  );
}
