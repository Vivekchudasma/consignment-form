import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { fetchLocations, submitConsignment } from "../api/mockApi";

export interface ConsignmentFormData {
  source: string;
  destination: string;
  weight: number;
  width: "";
  height: "";
  depth: "";
  units: "centimetres" | "millimetres";
}

const ConsignmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<ConsignmentFormData>({
    mode: "onSubmit",
    defaultValues: { units: "centimetres" },
  });
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const units = watch("units");

  useEffect(() => {
    setLoadingLocations(true);
    fetchLocations()
      .then((res) => setLocations(res.data.locations))
      .catch(() => { })
      .finally(() => setLoadingLocations(false));
  }, []);

  const onSubmit = async (data: ConsignmentFormData) => {
    setSubmitStatus("loading");
    try {
      const payload = {
        ...data,
        dimensions: {
          width: data.width,
          height: data.height,
          depth: data.depth,
        },
      };
      await submitConsignment(payload);
      setSubmitStatus("success");
      reset({
        source: "",
        destination: "",
        weight: undefined,
        width: "",
        height: "",
        depth: "",
        units: "centimetres",
      });
    } catch {
      setSubmitStatus("error");
    }
  };

  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);
  console.log(locations, "check")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Consignment
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label htmlFor="source" className="block mb-1 font-medium">
            Source
          </label>
          <select
            id="source"
            {...register("source", {
              required: "Source is required",
              validate: (value) =>
                value !== watch("destination") ||
                "Source and destination cannot be the same",
            })}
            disabled={loadingLocations}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="text-red-500 text-sm">{errors.source.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="destination" className="block mb-1 font-medium">
            Destination
          </label>
          <select
            id="destination"
            {...register("destination", {
              required: "Destination is required",
              validate: (value) =>
                value !== watch("source") ||
                "Destination and source cannot be the same",
            })}
            disabled={loadingLocations}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.destination && (
            <p className="text-red-500 text-sm">{errors.destination.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="weight" className="block mb-1 font-medium">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            {...register("weight", {
              required: "Weight is required",
              //   valueAsNumber: true,
              min: { value: 1, message: "Minimum weight is 1kg" },
              max: { value: 1000, message: "Maximum weight is 1000kg" },
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm">{errors.weight.message}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {["width", "height", "depth"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block mb-1 font-medium capitalize"
              >
                {field}
              </label>
              <Controller
                name={field as keyof ConsignmentFormData}
                control={control}
                rules={{
                  required: `${field} is required`,
                  //   valueAsNumber: true,
                  min: { value: 1, message: "Minimum is 1" },
                  max: {
                    value: units === "centimetres" ? 1200 : 12000,
                    message: `Maximum is ${units === "centimetres" ? 1200 : 12000
                      }`,
                  },
                }}
                render={({ field: f }) => (
                  <input
                    id={field}
                    type="number"
                    {...f}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}
              />
              {errors[field as keyof ConsignmentFormData] && (
                <p className="text-red-500 text-sm">
                  {(errors[field as keyof ConsignmentFormData] as any).message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="units" className="block mb-1 font-medium">
            Units
          </label>
          <select
            id="units"
            {...register("units")}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="centimetres">Centimetres</option>
            <option value="millimetres">Millimetres</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitStatus === "loading" ? "Submitting..." : "Submit"}
        </button>

        {submitStatus === "success" && (
          <p className="text-green-600 font-medium text-center">
            Consignment submitted successfully!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-600 font-medium text-center">
            Failed to submit consignment.
          </p>
        )}
      </form>
    </div>
  );
};

export default ConsignmentForm;
