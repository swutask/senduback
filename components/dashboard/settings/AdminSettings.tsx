// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useEffect, useState } from "react";
// import { useGetSettingsQuery, useUpdateSettingMutation } from "@/redux/features/settings/settingApi";
// import { toast } from "sonner";

// const AdminSettings = () => {
//     const { data, refetch } = useGetSettingsQuery({});
//     const [updateSetting, { isLoading }] = useUpdateSettingMutation();

//     const settingsData = data?.data;

//     const [insurancePercentage, setInsurancePercentage] = useState(8);
//     const [insuranceMaxValue, setInsuranceMaxValue] = useState(1000);
//     const [profitMargin, setProfitMargin] = useState(20);

//     useEffect(() => {
//         if (settingsData) {
//             setInsurancePercentage(settingsData.insurance?.percentage || 8);
//             setInsuranceMaxValue(settingsData.insurance?.maxValue || 1000);
//             setProfitMargin(settingsData.profitMargin || 20);
//         }
//     }, [settingsData]);

//     const handleSave = async () => {
//         try {
//             await updateSetting({
//                 insurance: {
//                     percentage: insurancePercentage,
//                     maxValue: insuranceMaxValue,
//                 },
//                 profitMargin: profitMargin,
//             }).unwrap();

//             toast.success("Settings saved successfully");
//             refetch();
//         } catch (error) {
//             toast.error("Failed to save settings");
//         }
//     };

//     return (
//         <div className="p-0 md:p-6 space-y-6">
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-[#25324B]">Platform settings</h1>
//                 <p className="text-[#7C8493] text-lg">Configure global rules for pricing and insurance.</p>
//             </div>

//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-bold text-[#3A3A3A]">Profit & Pricing</CardTitle>
//                     <p className="text-sm text-[#3A3A3A] mt-1">Set your global profit margin on shipments. This markup is added on top of courier costs.</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                             <Label className="font-bold text-[#3A3A3A]">Global Profit (%)</Label>
//                             <Input type="number" value={profitMargin} onChange={(e) => setProfitMargin(Number(e.target.value))} className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Percentage added to the base shipping cost.</p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-[#3A3A3A]">Insurance rules</CardTitle>
//                     <p className="text-sm text-[#3A3A3A] mt-1">Define how insurance is handled for shipped items.</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <Label className="font-bold">Insurance Percentage (%)</Label>
//                             <Input type="number" value={insurancePercentage} onChange={(e) => setInsurancePercentage(Number(e.target.value))} className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Percentage fee for insurance coverage.</p>
//                         </div>

//                         <div className="space-y-2">
//                             <Label className="font-bold">Maximum Insurance Value</Label>
//                             <Input type="number" value={insuranceMaxValue} onChange={(e) => setInsuranceMaxValue(Number(e.target.value))} className="w-full bg-[#E6EAEF] p-6" />
//                             <p className="text-xs text-[#3A3A3A]">Maximum value covered by insurance.</p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             <div className="flex justify-end">
//                 <Button onClick={handleSave} className="bg-[#0096FF] text-white px-8 py-2" disabled={isLoading}>
//                     {isLoading ? "Saving..." : "Save All Changes"}
//                 </Button>
//             </div>
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
    <div className="p-0 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Platform settings</h1>
        <p className="text-[#7C8493] text-lg">
          Configure global rules for pricing and insurance.
        </p>
      </div>

      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardContent className="p-6 space-y-8">
          {/* Profit & Pricing Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#3A3A3A]">
                Profit & Pricing
              </h3>
              <p className="text-sm text-[#3A3A3A] mt-1">
                Set your global profit margin on shipments. This markup is added
                on top of courier costs.
              </p>
            </div>
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

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Insurance Rules Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#3A3A3A]">
                Insurance rules
              </h3>
              <p className="text-sm text-[#3A3A3A] mt-1">
                Define how insurance is handled for shipped items.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Insurance Percentage (%)</Label>
                <Input
                  type="number"
                  value={insurancePercentage}
                  onChange={(e) =>
                    setInsurancePercentage(Number(e.target.value))
                  }
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
          </div>

          {/* Save Button */}
          <div className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
