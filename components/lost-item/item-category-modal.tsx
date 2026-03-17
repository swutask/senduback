"use client";

import { X } from "lucide-react";
import { useState } from "react";

import bagsSuitcases from "@/lib/icons/bags-suitcases.svg";
import clothes from "@/lib/icons/clothes.svg";
import documents from "@/lib/icons/documents.svg";
import electronics from "@/lib/icons/electronics.svg";
import jewellery from "@/lib/icons/jewellery.svg";
import others from "@/lib/icons/others.svg";
import personalItems from "@/lib/icons/personal-items.svg";
import sportsGear from "@/lib/icons/sports-gear.svg";
import toys from "@/lib/icons/toys.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

// Main categories with subcategories data
const CATEGORY_STRUCTURE = [
  {
    id: "documents",
    name: "Documents & IDs",
    icon: documents as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Passport", name: "Passport" },
      { id: "ID Card", name: "ID Card" },
      { id: "Drivers Licence", name: "Drivers Licence" },
      { id: "Professional Card", name: "Professional Card" },
      { id: "Credit Cards", name: "Credit Cards" },
      { id: "Purse", name: "Purse" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: electronics as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Smartphone", name: "Smart phone" },
      { id: "Laptop", name: "Laptop" },
      { id: "Tablet", name: "Tablet" },
      { id: "Camera", name: "Camera" },
      { id: "Charger", name: "Charger" },
      { id: "Smartwatch", name: "Smartwatch" },
      { id: "e-reader", name: "E-reader" },
      { id: "Headphones & Airpods", name: "Headphones & Airpods" },
      { id: "Game Console", name: "Game Console" },
    ],
  },
  {
    id: "clothes",
    name: "Clothes",
    icon: clothes as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Trousers", name: "Trousers" },
      { id: "Shorts", name: "Shorts" },
      { id: "Blouse", name: "Blouse" },
      { id: "Shirt", name: "Shirt" },
      { id: "Skirt", name: "Skirt" },
      { id: "Jacket", name: "Jacket" },
      { id: "Swimsuit", name: "Swimsuit" },
      { id: "Sweatshirt - Hoodie", name: "Sweatshirt - Hoodie" },
      { id: "Shoes", name: "Shoes" },
      { id: "Belt", name: "Belt" },
      { id: "Hat", name: "Hat" },
    ],
  },
  {
    id: "toys",
    name: "Toys",
    icon: toys as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "action_figure", name: "Action Figure" },
      { id: "board_game", name: "Board Game" },
      { id: "plushie", name: "Plushie" },
      { id: "lego", name: "LEGO Set" },
      { id: "doll", name: "Doll" },
      { id: "puzzle", name: "Puzzle" },
    ],
  },
  {
    id: "personal",
    name: "Personal Items",
    icon: personalItems as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Keys", name: "Keys" },
      { id: "Glasses", name: "Glasses" },
      { id: "Perfume", name: "Perfume" },
    ],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: jewellery as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Ring", name: "Ring" },
      { id: "Earring", name: "Earring" },
      { id: "Bracelet", name: "Bracelet" },
      { id: "Necklace", name: "Necklace" },
      { id: "Watch", name: "Watch" },
    ],
  },
  {
    id: "sports",
    name: "Sports gear",
    icon: sportsGear as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Surf", name: "Surf" },
      { id: "Kite", name: "Kite" },
      { id: "Ski", name: "Ski" },
      { id: "Golf bag", name: "Golf bag" },
      { id: "Tennis", name: "Tennis" },
      { id: "Bicycle", name: "Bicycle" },
      { id: "Bicycle", name: "Bicycle" },
      { id: "Other Sport Gear", name: "Other Sport Gear" },
    ],
  },
  {
    id: "bags",
    name: "Bags & Suitcases",
    icon: bagsSuitcases as StaticImport,
    hasSubcategories: true,
    subcategories: [
      { id: "Handbag", name: "Handbag" },
      { id: "Backpack", name: "Backpack" },
      { id: "Large suitcase", name: "Large suitcase" },
      { id: "Small cabin bag", name: "Small cabin bag" },
      { id: "Purse, Pencil case", name: "Purse, Pencil case" },
      { id: "Shopping bag", name: "Shopping bag" },
      { id: "Fanny pack", name: "Fanny pack" },
    ],
  },
  {
    id: "Other",
    name: "Others",
    icon: others as StaticImport,
    hasSubcategories: false, // Others category has no subcategories
    subcategories: [],
  },
];

interface ItemCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: {
    name: string;
    category: string;
    subcategory: string;
    icon: StaticImport;
    description?: string;
    weight?: string;
    width?: string;
    height?: string;
    length?: string;
  }) => void;
}

export default function ItemCategoryModal({
  isOpen,
  onClose,
  onSelectItem,
}: ItemCategoryModalProps) {
  const [modalStep, setModalStep] = useState<
    "categories" | "subcategories" | "input" | "others-form"
  >("categories");
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof CATEGORY_STRUCTURE)[0] | null
  >(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const [othersFormData, setOthersFormData] = useState({
    description: "",
    weight: "",
    width: "",
    height: "",
    length: "",
  });

  // Step 1: User selects main category
  const handleCategorySelect = (category: (typeof CATEGORY_STRUCTURE)[0]) => {
    setSelectedCategory(category);
    if (category.hasSubcategories) {
      setModalStep("subcategories");
    } else {
      // Others category goes directly to form
      setModalStep("others-form");
    }
  };

  // Step 2: User selects subcategory
  const handleSubcategorySelect = (subcategory: {
    id: string;
    name: string;
  }) => {
    setSelectedSubcategory(subcategory);
    setModalStep("input");
  };

  // Step 3: User enters item name and submits
  const handleAddItem = () => {
    if (selectedCategory && selectedSubcategory && itemName.trim()) {
      onSelectItem({
        name: itemName,
        category: selectedCategory.name,
        subcategory: selectedSubcategory.name,
        icon: selectedCategory.icon,
        description: itemDescription,
      });
      resetModal();
    }
  };

  const handleAddOthersItem = () => {
    if (selectedCategory && othersFormData.description.trim()) {
      onSelectItem({
        name: othersFormData.description,
        category: selectedCategory.name,
        subcategory: "Other Item",
        icon: selectedCategory.icon,
        description: othersFormData.description,
        weight: othersFormData.weight,
        width: othersFormData.width,
        height: othersFormData.height,
        length: othersFormData.length,
      });
      resetModal();
    }
  };

  // Reset modal to initial state
  const resetModal = () => {
    setModalStep("categories");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setItemName("");
    setOthersFormData({
      description: "",
      weight: "",
      width: "",
      height: "",
      length: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div className="bg-[#e6f2ff] rounded-lg max-w-4xl w-full h-full md:h-[500px] lg:h-auto overflow-y-auto flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between p-6 py-4 border-b">
            <div className="flex items-center gap-3">
              {/* <span className="text-2xl">{selectedCategory?.icon}</span> */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalStep === "categories" && "Select a category"}
                  {modalStep === "subcategories" &&
                    `Select ${selectedCategory?.name}`}
                  {modalStep === "input" && `Enter item details`}
                  {modalStep === "others-form" && selectedCategory?.name}
                </h2>
                {modalStep === "others-form" && (
                  <p className="text-sm text-gray-600">
                    {selectedCategory?.name} items
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={resetModal}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {/* Step 1: Category Selection Grid (3x3) */}
            {modalStep === "categories" && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                {CATEGORY_STRUCTURE.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="p-4 rounded-lg border-2 border-gray-100 bg-white hover:border-primary hover:shadow-lg transition text-center"
                  >
                    {/* <div className="text-4xl mb-2">{category.icon}</div> */}
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="md:w-24 md:h-24 mx-auto"
                    />
                    <div className="font-semibold text-sm text-gray-900 mt-4">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Subcategory Selection (2 columns) */}
            {modalStep === "subcategories" && selectedCategory && (
              <div className="grid grid-cols-2 gap-3">
                {selectedCategory.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className="p-4 rounded-lg border bg-white border-gray-200 hover:bg-blue-50 hover:border-primary transition text-left"
                  >
                    <div className="font-semibold text-gray-900">
                      {subcategory.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Item Name Input */}
            {modalStep === "input" && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Category:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedCategory?.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Type:{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedSubcategory?.name}
                    </span>
                  </p>
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Item Name or Model
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder={`e.g., My ${
                      selectedSubcategory?.name || "Item"
                    }`}
                    className="w-full border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>

                {/* Description field (NEW) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Color, brand, special marks, etc."
                    rows={3}
                    className="w-full border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                </div>
              </div>
            )}

            {modalStep === "others-form" && (
              <div className="space-y-4">
                {/* Description field - main input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Other items description{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={othersFormData.description}
                    onChange={(e) =>
                      setOthersFormData({
                        ...othersFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brand, colour, name etc"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>

                {/* Weight field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Weight <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={othersFormData.weight}
                      onChange={(e) =>
                        setOthersFormData({
                          ...othersFormData,
                          weight: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-3 py-2 text-sm text-gray-600">
                      kg
                    </span>
                  </div>
                </div>

                {/* Dimensions: Width, Height, Length in one row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Width */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Width <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={othersFormData.width}
                        onChange={(e) =>
                          setOthersFormData({
                            ...othersFormData,
                            width: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-2 py-2 text-sm text-gray-600">
                        cm
                      </span>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Height <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={othersFormData.height}
                        onChange={(e) =>
                          setOthersFormData({
                            ...othersFormData,
                            height: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-2 py-2 text-sm text-gray-600">
                        cm
                      </span>
                    </div>
                  </div>

                  {/* Length */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Length <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={othersFormData.length}
                        onChange={(e) =>
                          setOthersFormData({
                            ...othersFormData,
                            length: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-2 py-2 text-sm text-gray-600">
                        cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 py-4 border-t justify-end">
            <button
              onClick={() => {
                if (
                  modalStep === "subcategories" ||
                  modalStep === "others-form"
                ) {
                  setModalStep("categories");
                } else if (modalStep === "input") {
                  setModalStep("subcategories");
                } else {
                  resetModal();
                }
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              {modalStep === "categories" ? "Cancel" : "Back"}
            </button>

            {modalStep === "input" && (
              <button
                onClick={handleAddItem}
                disabled={!itemName.trim()}
                className={`px-6 py-2 rounded font-semibold text-white transition ${
                  itemName.trim()
                    ? "bg-primary hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add Item
              </button>
            )}

            {modalStep === "others-form" && (
              <button
                onClick={handleAddOthersItem}
                disabled={!othersFormData.description.trim()}
                className={`px-6 py-2 rounded font-semibold text-white transition ${
                  othersFormData.description.trim()
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add an Item
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
