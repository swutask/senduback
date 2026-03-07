// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import { Check, X } from "lucide-react";

// const AdminSettings = () => {
//     const [couriers, setCouriers] = useState([
//         { name: "DHL", status: "Active" },
//         { name: "UPS", status: "Active" },
//         { name: "FedEx", status: "Inactive" },
//     ]);

//     const handleToggle = (index: number) => {
//         const updatedCouriers = [...couriers];
//         updatedCouriers[index].status = updatedCouriers[index].status === "Active" ? "Inactive" : "Active";
//         setCouriers(updatedCouriers);
//     };

//     return (
//         <div className="p-0 md:p-6 space-y-6">
//             {/* Header Section */}
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-[#25324B]">Platform settings</h1>
//                 <p className="text-[#7C8493] text-lg">Configure global rules for pricing, insurance, couriers, countries, emails and branding.</p>
//             </div>

//             {/* Profit & Pricing Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-bold text-[#3A3A3A]">Profit & Pricing</CardTitle>
//                     <p className="text-sm text-[#3A3A3A] mt-1">Set your global profit margin on shipments. This markup is added on top of courier costs.</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                             <Label htmlFor="global-profit" className=" font-bold text-[#3A3A3A]">
//                                 Global Profit (%)
//                             </Label>
//                             <Input id="global-profit" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs  text-[#3A3A3A]">Percentage added to the base shipping cost.</p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="min-fee" className=" font-bold">
//                                 Minimum fee (Optional)
//                             </Label>
//                             <Input id="min-fee" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Minimum service fee applied per order.</p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="max-fee" className=" font-bold">
//                                 Maximum fee (Optional)
//                             </Label>
//                             <Input id="max-fee" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Optional cap for your service fee.</p>
//                         </div>
//                     </div>
//                     <div className="flex justify-end">
//                         <Button className="bg-[#0096FF] text-white px-8 py-2">Save Changes</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Insurance Rules Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-[#3A3A3A]">Insurance rules</CardTitle>
//                     <p className="text-sm text-[#3A3A3A] mt-1">Define how insurance is handled for shipped items.</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <Label htmlFor="default-insured" className=" font-bold">
//                                 Default insured amount (Per order)
//                             </Label>
//                             <Input id="default-insured" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Maximum value covered by standard insurance</p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="max-insured" className=" font-bold">
//                                 Max insured amount (with extra fee)
//                             </Label>
//                             <Input id="max-insured" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Maximum value allowed if guest pays extra</p>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <Label htmlFor="extra-insurance" className=" font-bold">
//                                 Extra insurance fee (%)
//                             </Label>
//                             <Input id="extra-insurance" type="number" placeholder="0" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Percentage added when guest chooses higher coverage.</p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="excluded-items" className=" font-bold">
//                                 Excluded item type
//                             </Label>
//                             <Input id="excluded-items" type="text" placeholder="e.g., Jewelry, Electronics" className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">These items are not covered by insurance.</p>
//                         </div>
//                     </div>
//                     <div className="flex justify-end">
//                         <Button className="bg-[#0096FF] text-white px-8 py-2">Save Changes</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Allowed Couriers Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-[#3A3A3A]">Allowed couriers</CardTitle>
//                     <p className="text-sm text-[#3A3A3A] mt-1">Choose which courier partners can be used in the system.</p>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
//                         <table className="w-full table-fixed">
//                             <thead>
//                                 <tr className="border-b border-[#454B6066] bg-[#EAEAEA]">
//                                     <th className="text-sm font-bold text-[#3A3A3A] py-3 text-left px-4 w-1/3">Courier Name</th>
//                                     <th className="text-sm font-bold text-[#3A3A3A] py-3 text-left px-4 w-1/3">Status</th>
//                                     <th className="text-sm font-bold text-[#3A3A3A] py-3 text-left px-4 w-1/3">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {couriers.map((courier, index) => (
//                                     <tr key={index} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
//                                         <td className="text-sm text-[#3A3A3A] py-3 px-4 truncate">{courier.name}</td>
//                                         <td className="text-sm text-[#3A3A3A] py-3 px-4">
//                                             <Badge variant={courier.status === "Active" ? "default" : "secondary"} className={courier.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
//                                                 {courier.status}
//                                             </Badge>
//                                         </td>
//                                         <td className="py-3 px-4">
//                                             <div className="flex justify-start">
//                                                 <button onClick={() => handleToggle(index)} className={`relative inline-flex h-6 w-12 items-center rounded-full border-0 outline-none transition-colors shrink-0 ${courier.status === "Active" ? "bg-[#0096FF]" : "bg-gray-300"}`}>
//                                                     <span className={`absolute inline-flex h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 items-center justify-center left-1 ${courier.status === "Active" ? "translate-x-6" : "translate-x-0"}`}>{courier.status === "Active" ? <Check className="h-3 w-3 text-[#0096FF]" /> : <X className="h-3 w-3 text-gray-400" />}</span>
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default AdminSettings;

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingMutation,
} from "@/redux/features/settings/settingApi";
import { toast } from "sonner";

const AdminSettings = () => {
  const { data, refetch } = useGetSettingsQuery({});
  const [updateSetting, { isLoading }] = useUpdateSettingMutation();

  const settingsData = data?.data;

  const [insurancePercentage, setInsurancePercentage] = useState(8);
  const [insuranceMaxValue, setInsuranceMaxValue] = useState(1000);
  const [profitMargin, setProfitMargin] = useState(20);

  useEffect(() => {
    if (settingsData) {
      setInsurancePercentage(settingsData.insurance?.percentage || 8);
      setInsuranceMaxValue(settingsData.insurance?.maxValue || 1000);
      setProfitMargin(settingsData.profitMargin || 20);
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      await updateSetting({
        insurance: {
          percentage: insurancePercentage,
          maxValue: insuranceMaxValue,
        },
        profitMargin: profitMargin,
      }).unwrap();

      toast.success("Settings saved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="p-0 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Platform settings</h1>
        <p className="text-[#7C8493] text-lg">
          Configure global rules for pricing and insurance.
        </p>
      </div>

      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#3A3A3A]">
            Profit & Pricing
          </CardTitle>
          <p className="text-sm text-[#3A3A3A] mt-1">
            Set your global profit margin on shipments. This markup is added on
            top of courier costs.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-[#3A3A3A]">
                Global Profit (%)
              </Label>
              <Input
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="w-full bg-[#E6EAEF] p-6"
              />
              <p className="text-xs text-[#3A3A3A]">
                Percentage added to the base shipping cost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#3A3A3A]">
            Insurance rules
          </CardTitle>
          <p className="text-sm text-[#3A3A3A] mt-1">
            Define how insurance is handled for shipped items.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold">Insurance Percentage (%)</Label>
              <Input
                type="number"
                value={insurancePercentage}
                onChange={(e) => setInsurancePercentage(Number(e.target.value))}
                className="w-full bg-[#E6EAEF] p-6"
              />
              <p className="text-xs text-[#3A3A3A]">
                Percentage fee for insurance coverage.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Maximum Insurance Value</Label>
              <Input
                type="number"
                value={insuranceMaxValue}
                onChange={(e) => setInsuranceMaxValue(Number(e.target.value))}
                className="w-full bg-[#E6EAEF] p-6"
              />
              <p className="text-xs text-[#3A3A3A]">
                Maximum value covered by insurance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#0096FF] text-white px-8 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
