"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  Category,
  CategoryCard,
  Field,
  GradientButton,
  Input,
  ItemRow,
  StepHeader,
  Textarea,
  TwoCol,
} from "./common";
import { ChevronLeft, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SelectedItem,
  useLostItemForm,
} from "@/contexts/lost-item-form.context";
import FormFooter from "./form-footer";
import { useForm } from "react-hook-form";

type ViewState = "category" | "item-list";
type ModalState = "subcategory" | "item-form" | null;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function CategorySelectView({
  onSelect,
}: {
  onSelect: (cat: Category) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (cat: Category) => {
    setSelected(cat.id);
    setTimeout(() => onSelect(cat), 150);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat, index) => (
          <CategoryCard
            key={`${cat.id}-${index}`}
            category={cat}
            selected={selected === cat.id}
            onClick={() => handleClick(cat)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SubcategoryModal({
  open,
  category,
  onSelect,
  onClose,
}: {
  open: boolean;
  category: Category | null;
  onSelect: (subcategoryId: string, subcategoryName: string) => void;
  onClose: () => void;
}) {
  if (!category) return null;

  const Icon = category.icon;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              style={{
                background: category.gradient,
                padding: 7,
                borderRadius: "8px",
                color: "white",
              }}
            >
              <Icon className={`w-5 h-5`} />
            </div>

            <DialogTitle className="text-[15px] font-bold text-[#0d1b8e]">
              {category.name}
            </DialogTitle>
          </div>
          <p className="text-[13px] text-slate-400">Select a subcategory</p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {category.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelect(sub.id, sub.name)}
              className={cn(
                "text-left px-4 py-3 rounded-xl border border-slate-200",
                "text-[13px] font-medium text-slate-700",
                "hover:border-[#1D6FF2] hover:text-[#1D6FF2] hover:bg-blue-50/40",
                "transition-all duration-150",
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
interface FormValues {
  name: string;
  description: string;
}

function ItemFormModal({
  open,
  category,
  subcategoryName,
  hasSubcategories,
  editingItem,
  onBack,
  onSave,
  onClose,
}: {
  open: boolean;
  category: Category | null;
  subcategoryName: string;
  hasSubcategories: boolean;
  editingItem?: SelectedItem;
  onBack: () => void;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: editingItem?.name ?? "",
      description: editingItem?.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: editingItem?.name ?? "",
      description: editingItem?.description ?? "",
    });
  }, [editingItem, reset]);

  if (!category) return null;

  const Icon = category.icon;

  const onSubmit = (data: FormValues) => {
    onSave(data.name.trim(), data.description);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg rounded-[24px]">
        <DialogHeader>
          {hasSubcategories && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-[#1D6FF2] transition-colors mb-2 w-fit"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to subcategories
            </button>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div
              style={{
                background: category.gradient,
                padding: 10,
                borderRadius: "8px",
                color: "white",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                {category.name}
              </p>
              {subcategoryName && (
                <p className="text-[13px] font-bold text-[#0d1b8e]">
                  {subcategoryName}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <Field label="Item Name *" error={errors.name?.message}>
            <Input
              {...register("name", {
                required: "Item name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
              placeholder="e.g. Blue Cotton T-Shirt"
            />
          </Field>

          <Field label="Description (optional)">
            <Textarea
              {...register("description")}
              placeholder="Add any identifying details — colour, brand, size…"
            />
          </Field>

          <TwoCol mobileLayout="twoCol">
            <button
              type="button"
              className="rounded-xl border-[#CBD5E1] h-12 border-2 text-[15px] bg-accent text-primary font-semibold"
              onClick={handleClose}
            >
              Cancel
            </button>

            <GradientButton type="submit">
              {editingItem ? "Update Item" : "Add Item"}
            </GradientButton>
          </TwoCol>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function ItemListView({
  items,
  onAddAnother,
  onEdit,
  onDelete,
}: {
  items: SelectedItem[];
  onAddAnother: () => void;
  onEdit: (item: SelectedItem, index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-5"
    >
      <p className="text-[15px] font-bold text-[#0d1b8e]">Your Items</p>
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, index) => (
            <ItemRow
              key={item.name}
              item={item}
              onEdit={() => onEdit(item, index)}
              onDelete={() => onDelete(index)}
            />
          ))}
        </AnimatePresence>
      </div>
      <button
        onClick={onAddAnother}
        className={cn(
          "w-full flex items-center justify-center gap-2 h-14 rounded-2xl",
          "border-2 border-slate-300 text-slate-500",
          "text-[14px] font-medium",
          "hover:border-[#1D6FF2] hover:text-[#1D6FF2] hover:bg-blue-50/40",
          "transition-all duration-200 font-semibold text-primary",
        )}
      >
        <div className="w-5 h-5 rounded-full bg-fade-blue flex items-center justify-center">
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        </div>
        Add Another Item
      </button>
    </motion.div>
  );
}

export default function ItemDetailsStep() {
  const [modal, setModal] = useState<ModalState>(null);

  const { form, state, actions } = useLostItemForm();
  const selectedItems = form.watch("selectedItems");

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingItem, setEditingItem] = useState<SelectedItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<undefined | number>(
    undefined,
  );

  const headerMap: Record<ViewState, { title: string; subtitle?: string }> = {
    category: {
      title: "Select Category",
      subtitle: "Select a category and describe your item",
    },
    "item-list": { title: "What items did you forget?" },
  };

  const closeModals = () => {
    setModal(null);
    setEditingItem(null);
  };

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    setEditingItem(null);

    if (!cat.hasSubcategories || cat.subcategories.length === 0) {
      setSelectedSubcategory({ id: "other", name: cat.name });
      setModal("item-form");
    } else {
      setSelectedSubcategory(null);
      setModal("subcategory");
    }
  };

  const handleSubcategorySelect = (
    subcategoryId: string,
    subcategoryName: string,
  ) => {
    setSelectedSubcategory({ id: subcategoryId, name: subcategoryName });
    setModal("item-form");
  };

  const handlePrevStep = () => {
    if (!!(form.watch("placeName") || form.watch("businessName"))) {
      actions.goToStep("location");
      actions.setView("confirmed");
      return;
    }
    actions.prevStep();
  };

  const handleNextStep = () => {
    if (
      !!(form.watch("selectedItems").length > 0 && state.view === "category")
    ) {
      actions.setView("item-list");
      return;
    }

    if (form.watch("sendAddress")) {
      actions.goToStep("delivery");
      actions.setView("recipient");
      return;
    }

    actions.nextStep();
  };

  const handleSave = (name: string, description: string) => {
    if (!selectedCategory) return;

    const currentItems = selectedItems || [];
    const index = editingIndex;

    if (editingItem && index !== undefined) {
      const updated = currentItems.map((item, i) =>
        i === index
          ? {
              ...item,
              name,
              description,
              category: selectedCategory.name ?? "",
              subcategory: selectedSubcategory?.name ?? "",
            }
          : item,
      );
      form.setValue("selectedItems", updated);
    } else {
      form.setValue("selectedItems", [
        ...currentItems,
        {
          name,
          description,
          category: selectedCategory.name,
          subcategory: selectedSubcategory?.name || "",
        },
      ]);
    }

    closeModals();
    actions.setView("item-list");
  };

  const handleEdit = (item: SelectedItem, index: number) => {
    const cat =
      CATEGORIES.find((c) => c.name === item.category) ?? CATEGORIES[0];
    const sub =
      cat.subcategories.find((c) => c.name === item.subcategory) ??
      cat.subcategories[0];
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    setEditingItem(item);
    setEditingIndex(index);
    setModal("item-form");
  };

  const handleDelete = (index: number) => {
    const currentItems = selectedItems || [];
    const updated = currentItems.filter((_, i) => i !== index);
    form.setValue("selectedItems", updated);
    if (updated.length === 0) actions.setView("category");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-5 pb-24 sm:pb-40">
        <div className="w-full max-w-[640px]">
          <StepHeader {...headerMap[state.view as ViewState]} step={2} />

          <AnimatePresence mode="wait">
            {state.view === "category" && (
              <CategorySelectView
                key="category"
                onSelect={handleCategorySelect}
              />
            )}
            {state.view === "item-list" && (
              <ItemListView
                key="item-list"
                items={form.watch("selectedItems") || []}
                onAddAnother={() => actions.setView("category")}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </AnimatePresence>
        </div>

        <SubcategoryModal
          open={modal === "subcategory"}
          category={selectedCategory}
          onSelect={handleSubcategorySelect}
          onClose={closeModals}
        />

        <ItemFormModal
          open={modal === "item-form"}
          category={selectedCategory}
          subcategoryName={selectedSubcategory?.name ?? ""}
          hasSubcategories={
            !!(
              selectedCategory?.hasSubcategories &&
              selectedCategory.subcategories.length > 0
            )
          }
          editingItem={editingItem ?? undefined}
          onBack={() => setModal("subcategory")}
          onSave={handleSave}
          onClose={closeModals}
        />
      </div>

      <FormFooter
        onBack={handlePrevStep}
        onNext={handleNextStep}
        nextLabel={
          form.watch("selectedItems").length > 0 && state.view === "category"
            ? "Next"
            : "Delivery"
        }
        disableNext={
          state.view !== "item-list" && !form.watch("selectedItems").length
        }
      />
    </>
  );
}
