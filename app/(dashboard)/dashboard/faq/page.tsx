"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/redux/features/faq/faqApi";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

const FAQPage = () => {
  const { data: faqs = [], isLoading, refetch } = useGetFAQQuery(undefined);
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [editData, setEditData] = useState({
    question: "",
    answer: "",
  });

  const handleCreate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createFAQ({
        question: formData.question,
        answer: formData.answer,
      }).unwrap();

      toast.success("FAQ created successfully");
      setFormData({ question: "", answer: "" });
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create FAQ");
      console.error(error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editData.question.trim() || !editData.answer.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateFAQ({
        id,
        question: editData.question,
        answer: editData.answer,
      }).unwrap();

      toast.success("FAQ updated successfully");
      setEditingId(null);
      setEditData({ question: "", answer: "" });
      refetch();
    } catch (error) {
      toast.error("Failed to update FAQ");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id).unwrap();
      toast.success("FAQ deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete FAQ");
      console.error(error);
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingId(faq._id);
    setEditData({
      question: faq.question,
      answer: faq.answer,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ question: "", answer: "" });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage frequently asked questions and their answers
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0096FF] hover:bg-[#0085e6] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add New FAQ
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold">
                Add New FAQ
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Question *
                </label>
                <Input
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Enter question"
                  className="border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Answer *
                </label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Enter answer"
                  rows={4}
                  className="border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="w-full sm:w-auto bg-[#0096FF] hover:bg-[#0085e6] text-white"
              >
                Save FAQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-gray-500 mb-2">No FAQs found</div>
            <p className="text-sm text-gray-400">
              Create your first FAQ by clicking "Add New FAQ"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq: FAQ) => (
              <div
                key={faq._id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-[#0096FF] transition-all duration-200 hover:shadow-sm"
              >
                {editingId === faq._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={editData.question}
                        onChange={(e) =>
                          setEditData({ ...editData, question: e.target.value })
                        }
                        className="border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        value={editData.answer}
                        onChange={(e) =>
                          setEditData({ ...editData, answer: e.target.value })
                        }
                        rows={4}
                        className="border-gray-300 focus:border-[#0096FF] focus:ring-[#0096FF] resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleUpdate(faq._id)}
                        className="w-full sm:w-auto bg-[#0096FF] hover:bg-[#0085e6] text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {faq.question}
                            </h3>

                            {expandedId === faq._id && (
                              <div className="mt-3 text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-100">
                                {faq.answer}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              <span>Created: {formatDate(faq.createdAt)}</span>
                              <span>•</span>
                              <span>Updated: {formatDate(faq.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(faq._id)}
                          className="h-8 px-2 text-gray-600 hover:text-[#0096FF] hover:bg-blue-50"
                        >
                          {expandedId === faq._id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span className="ml-1 hidden sm:inline">
                                Collapse
                              </span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span className="ml-1 hidden sm:inline">
                                Expand
                              </span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(faq)}
                          className="h-8 px-2 text-gray-600 hover:text-[#0096FF] hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="ml-1 hidden sm:inline">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="ml-1 hidden sm:inline">
                                Delete
                              </span>
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="bg-white max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">
                                Delete FAQ
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Are you sure you want to delete this FAQ? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(faq._id)}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPage;
