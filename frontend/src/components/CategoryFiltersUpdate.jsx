import { useState, useEffect } from "react";

const CategoryFiltersUpdate = ({ filters, setFilters }) => {
  const [valuesInputs, setValuesInputs] = useState([]);

  useEffect(() => {
    setValuesInputs(filters.map((f) => f.values.join(", ")));
  }, [filters]);

  const handleFilterChange = (index, field, value) => {
    const updated = filters.map((f, i) =>
      i === index
        ? {
            ...f,
            [field]: field === "order" ? parseInt(value) || 0 : value,
          }
        : f
    );
    setFilters(updated);
  };

  const handleValuesInput = (index, value) => {
    setValuesInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleValuesBlur = (index) => {
    const raw = valuesInputs[index];
    const valuesArray = raw.split(",").map((v) => v.trim()).filter(Boolean);

    const updated = filters.map((f, i) =>
      i === index ? { ...f, values: valuesArray } : f
    );
    setFilters(updated);
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { Key: "", displayName: "", values: [], order: 0 },
    ]);
    setValuesInputs((prev) => [...prev, ""]);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
    setValuesInputs(valuesInputs.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-purple-700 mb-2">Category Filters</h3>

      {filters.map((filter, idx) => (
        <div key={idx} className="mb-4 p-3 bg-gray-50 border rounded space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Key</label>
            <input
              value={filter.Key}
              onChange={(e) => handleFilterChange(idx, "Key", e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="e.g., color"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
            <input
              value={filter.displayName}
              onChange={(e) => handleFilterChange(idx, "displayName", e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="e.g., Color"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Values (comma-separated)</label>
            <input
              value={valuesInputs[idx] || ""}
              onChange={(e) => handleValuesInput(idx, e.target.value)}
              onBlur={() => handleValuesBlur(idx)}
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="e.g., Red, Blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={filter.order ?? 0}
              onChange={(e) => handleFilterChange(idx, "order", e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="e.g., 0"
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveFilter(idx)}
            className="text-xs text-red-500 hover:underline mt-1"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddFilter}
        className="text-sm bg-gray-100 border rounded px-3 py-1 hover:bg-gray-200"
      >
        + Add Filter
      </button>
    </div>
  );
};

export default CategoryFiltersUpdate;
