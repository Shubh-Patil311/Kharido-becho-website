import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import SellBikeForm from "../../components/Bike/SellBikeForm";
import SellCarForm from "../../components/Car/SellCarForm";
import SellLaptopForm from "../../components/Laptop/SellLaptopForm";
import SellMobileForm from "../../components/Mobile/SellMobileForm";

export default function SellProducts({ initialTab }) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(initialTab || "laptop");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = useMemo(
    () => [
      {
        id: "laptop",
        label: "Laptop",
        component: <SellLaptopForm productId={id} />,
      },
      {
        id: "mobile",
        label: "Mobile",
        component: <SellMobileForm productId={id} />,
      },
      { id: "car", label: "Car", component: <SellCarForm productId={id} /> },
      { id: "bike", label: "Bike", component: <SellBikeForm productId={id} /> },
    ],
    [id]
  );

  const activeComponent =
    tabs.find((tab) => tab.id === activeTab)?.component ?? tabs[0].component;

  return (
    <div className="container bg-cyan-400 mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">SELL YOUR PRODUCT</h2>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm overflow-hidden border">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 text-sm font-medium ${
                index !== 0 ? "border-l" : ""
              } ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        {activeComponent}
      </div>
    </div>
  );
}
