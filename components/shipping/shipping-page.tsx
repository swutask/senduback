"use client";
import express from "@/assets/Express.png";
import standard from "@/assets/Standard.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/lib/loading-spinner";
import { ShippingRate } from "@/lib/Types";
import { useCreatePaymentMutation } from "@/redux/features/payment/paymentApi";
import {
  useAddInsuranceMutation,
  useAddSelectedRateMutation,
  useGetShippingRatesMutation,
} from "@/redux/features/shipping/shippingApi";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Interface to define the shape of shipping form data
interface ShippingFormData {
  selectedDelivery: string;
  insuranceAmount: string;
  insureShipment: boolean;
  promoCode: string;
}

export interface ShippingRateResponse {
  success: boolean;
  data: ShippingRate;
}

export default function ShippingPage() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    defaultValues: {
      selectedDelivery: "ups",
      insuranceAmount: "",
      insureShipment: false,
      promoCode: "",
    },
  });

  // Watch form values to update the UI dynamically
  const selectedDelivery = watch("selectedDelivery");
  const insureShipment = watch("insureShipment");
  const insuranceAmount = watch("insuranceAmount");

  const router = useRouter();
  const params = useParams();
  const orderId = params?.slug as string;

  const [shippingCost, setshippingCost] = useState<number>(0);
  const [insuranceCost, setInsuranceCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isRateSelected, setIsRateSelected] = useState<boolean>(false);

  console.log(insuranceCost);

  const [getShippingRates, { data, isLoading: shippingLoading }] =
    useGetShippingRatesMutation();
  const [addSelectedRate] = useAddSelectedRateMutation();
  const [addInsurance, { isLoading: addInsuranceLoading }] =
    useAddInsuranceMutation();
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  console.log(data);

  useEffect(() => {
    if (!orderId) return;

    getShippingRates(orderId)
      .unwrap()
      .then()
      .catch(() => {});
  }, [orderId, getShippingRates]);

  // const handleAddSelectedRate = async (id: string) => {
  //   console.log("selectedRate", id);
  //   try {
  //     const res = await addSelectedRate({
  //       orderId,
  //       id,
  //     }).unwrap();
  //     if (res?.success) {
  //       console.log(res?.data?.total_cost);
  //       setTotalCost(res?.data?.total_cost || 0);
  //       setshippingCost(res?.data?.shipping_cost || 0);
  //     }
  //     console.log("handleAddSelectedRate", res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleAddSelectedRate = async (id: string) => {
    try {
      const res = await addSelectedRate({
        orderId,
        id,
      }).unwrap();

      console.log("handleAddSelectedRate", res);

      if (res?.success) {
        setIsRateSelected(true);
        setTotalCost(res?.data?.total_cost || 0);
        setshippingCost(res?.data?.shipping_cost || 0);
        setInsuranceCost(res?.data?.insurance?.insuranceCost || 0);

        toast.success("Delivery option selected successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to select delivery option");
    }
  };

  const handleAddInsurance = async () => {
    try {
      const res = await addInsurance({
        orderId,
        insurance: {
          isInsured: insureShipment,
          productValue: parseFloat(insuranceAmount),
        },
      }).unwrap();

      console.log("addInsurance", res);

      if (res?.success) {
        setTotalCost(res?.data?.total_cost || 0);
        setshippingCost(res?.data?.shipping_cost || 0);

        // ✅ FIX: update insurance cost in real time
        setInsuranceCost(res?.data?.insurance?.insuranceCost || 0);

        toast.success(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "something wrong");
    }
  };

  const onSubmit = async () => {
    if (!isRateSelected) {
      toast.error("Please select a delivery option before payment");
      return;
    }

    try {
      const res = await createPayment(orderId).unwrap();
      if (res?.url) {
        toast.success("Redirecting to Stripe checkout");
        router.push(res.url);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Payment initialization failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#e6f2ff] py-8 px-4 pt-40">
      <div className="w-full md:max-w-5xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping</h1>
          <p className="text-gray-600">
            At SendUBack, we help people reconnect with the things that matter
            to them – even after they've checked out, flown home, or moved on to
            their next destination.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Delivery Options Section */}
          <Card className="border-2 border-blue-200 bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 ">
              Choose delivery option
            </h2>

            {/* Delivery option cards */}
            {shippingLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {data?.data?.map((option: ShippingRate) => (
                  <label
                    key={option?._id}
                    onClick={() => handleAddSelectedRate(option?._id)}
                    className="flex items-center justify-between gap-5 flex-col md:flex-row p-3 border-2 rounded-lg cursor-pointer transition hover:bg-blue-50"
                    style={{
                      borderColor:
                        selectedDelivery === option?._id
                          ? "#3b82f6"
                          : "#e5e7eb",
                      backgroundColor:
                        selectedDelivery === option?._id ? "#f0f9ff" : "white",
                    }}
                  >
                    <div className="flex items-center">
                      <Input
                        type="radio"
                        {...register("selectedDelivery")}
                        value={option._id}
                        className="w-5 h-5 cursor-pointer text-transparent hidden"
                      />

                      {/* Conditionally show shipping type image */}
                      {option.shippingType === "express" && (
                        <div className="w-14 h-12 flex items-center justify-center bg-white border rounded">
                          <Image
                            src={express}
                            alt="Express delivery"
                            width={100}
                            height={100}
                            className="max-w-[90%] object-cover"
                          />
                        </div>
                      )}
                      {option.shippingType === "standard" && (
                        <div className="w-14 h-12 flex items-center justify-center bg-white border rounded">
                          <Image
                            src={standard}
                            alt="Standard delivery"
                            width={100}
                            height={100}
                            className="max-w-[90%] object-cover"
                          />
                        </div>
                      )}

                      {/* Delivery info */}
                      <div className="flex-1 ml-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            {option.title}
                          </p>
                          <div className="flex gap-6 mt-1 text-sm">
                            <p className="font-semibold">
                              Shipping:{" "}
                              <span className="font-normal">
                                {option?.shippingType}
                              </span>
                            </p>
                            <p className="font-semibold">
                              Duration:{" "}
                              <span className="font-normal">
                                {option?.duration}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-gray-900 text-lg">
                      £ {option.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Insurance Options Section */}
          <Card className="border-2 border-blue-200 bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900">
              Insurance Options
            </h2>

            {/* Insurance checkbox */}
            <label className="flex items-center gap-3  cursor-pointer">
              <input
                type="checkbox"
                {...register("insureShipment")}
                disabled={!isRateSelected}
                className="w-5 h-5 text-primary rounded cursor-pointer"
              />
              <span className="font-semibold text-gray-900">
                I want to insure this shipment
              </span>
            </label>

            {/* Insurance amount input - shows only when checkbox is checked */}
            {insureShipment && (
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Amount to insure this shipment?
                </label>
                <div className="flex gap-3">
                  <div className="w-full">
                    <Input
                      {...register("insuranceAmount", {
                        required: "Insurance amount is required",
                        min: {
                          value: 1,
                          message: "Amount must be greater than 0",
                        },
                      })}
                      placeholder="Enter amount"
                      type="number"
                      className="rounded-2xl"
                    />
                    {errors.insuranceAmount && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.insuranceAmount.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAddInsurance()}
                    className="bg-primary hover:bg-blue-600 w-44 text-white font-semibold px-6 py-5 rounded-2xl"
                  >
                    {addInsuranceLoading ? (
                      <Loader className="size-6 animate-spin" />
                    ) : (
                      "Save Value"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Insurance info text */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>Full refund in case of loss - Learn about our insurance</p>
              <p>
                By choosing to insure this shipment, you agree to the insurance{" "}
                <Link
                  href={"/terms-conditions"}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Terms & Conditions
                </Link>
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-bold">Note: </span> I acknowledge that if
                insurance is not selected, SendUBack will not be liable to
                provide compensation in the event of loss or damage.
              </p>
            </div>
          </Card>

          {/* Promo Code Section */}
          {/* <Card className="border-2 border-blue-200 bg-white p-6 rounded-lg">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              Promo Code (Optional)
            </label>
            <div className="flex gap-3">
              <Input
                {...register("promoCode")}
                placeholder="Enter promo code"
                className="flex-1"
              />
              <Button
                type="button"
                className="bg-primary hover:bg-blue-600 text-white font-semibold px-6"
              >
                Apply
              </Button>
            </div>
          </Card> */}

          {/* Order Summary Section */}
          <Card className="border-2 border-blue-200 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order summary
            </h2>

            {/* Summary rows */}
            <div className="space-y-4 border-b pb-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Shipping Cost</span>
                <span className="font-semibold text-gray-900">
                  £ {shippingCost || 0}
                </span>
              </div>
              {insureShipment && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Insurance Cost</span>
                  <span className="font-semibold text-gray-900">
                    £ {insuranceCost || 0}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  £ {totalCost || 0}
                </span>
              </div>

              {/* <div className="flex justify-between items-center">
                <span className="text-gray-700">Taxes (24%)</span>
                <span className="font-semibold text-gray-900"></span>
              </div> */}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">
                Total Price
              </span>
              <span className="text-2xl font-bold text-gray-900">
                £ {totalCost || 0}
              </span>
            </div>
          </Card>

          {/* Payment Button */}
          <Button
            type="submit"
            disabled={!isRateSelected || isLoading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-6 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span>Processing</span>
                <Loader className="size-6 animate-spin" />
              </>
            ) : (
              `Pay Securely (Stripe) - ${totalCost || 0}`
            )}
          </Button>

          {/* Back Button */}
          <Button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-6 px-4 rounded-lg border-2 border-gray-300 transition"
          >
            Back
          </Button>
        </form>
      </div>
    </main>
  );
}
